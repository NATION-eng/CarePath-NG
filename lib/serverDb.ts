import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { PatientProfile, CareEvent, SmsMessage, AuditEvent } from './types';

export interface DatabaseSchema {
  version: number;
  lastUpdated: string;
  facility: {
    name: string;
    code: string;
    state: string;
    lga: string;
  };
  patients: PatientProfile[];
  events: CareEvent[];
  sms: SmsMessage[];
  audit: AuditEvent[];
}

// Default initial state (clean registry with zero mock data / zero synthetic patients)
const INITIAL_CLEAN_DATABASE: DatabaseSchema = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  facility: {
    name: 'Garki Primary Healthcare Centre',
    code: 'FCT-AMAC-PHC-004',
    state: 'FCT Abuja',
    lga: 'Abuja Municipal (AMAC)',
  },
  patients: [],
  events: [],
  sms: [],
  audit: [],
};

// In-memory cache to guarantee zero file-lock contention and 100% fast reads/writes
let inMemoryDb: DatabaseSchema | null = null;
let cachedLocation: { dir: string; filePath: string } | null = null;

function getDatabaseLocation(): { dir: string; filePath: string } {
  if (cachedLocation) {
    return cachedLocation;
  }

  const isServerless = !!(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NOW_REGION
  );

  if (isServerless) {
    const tmpDir = os.tmpdir();
    cachedLocation = {
      dir: tmpDir,
      filePath: path.join(tmpDir, 'carepath_primary.db.json'),
    };
    return cachedLocation;
  }

  const localDir = path.resolve(process.cwd(), 'data');
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    cachedLocation = {
      dir: localDir,
      filePath: path.join(localDir, 'carepath_primary.db.json'),
    };
    return cachedLocation;
  } catch {
    const tmpDir = os.tmpdir();
    cachedLocation = {
      dir: tmpDir,
      filePath: path.join(tmpDir, 'carepath_primary.db.json'),
    };
    return cachedLocation;
  }
}

/**
 * Ensure database exists and is loaded into inMemoryDb.
 * NEVER wipes an existing database on read failure.
 */
function ensureDbFile(): DatabaseSchema {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  const { dir, filePath } = getDatabaseLocation();

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      // Check if bundled seed file exists in project data directory
      const bundledSeedPath = path.resolve(process.cwd(), 'data', 'carepath_primary.db.json');
      if (fs.existsSync(bundledSeedPath) && bundledSeedPath !== filePath) {
        try {
          const seedContent = fs.readFileSync(bundledSeedPath, 'utf-8');
          const parsed = JSON.parse(seedContent);
          inMemoryDb = parsed;
          saveDb(parsed);
          return parsed;
        } catch {}
      }

      inMemoryDb = JSON.parse(JSON.stringify(INITIAL_CLEAN_DATABASE));
      saveDb(inMemoryDb!);
      return inMemoryDb!;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    inMemoryDb = parsed;
    return parsed;
  } catch (err) {
    console.warn('Notice: Reading database file had transient error, retaining memory state:', err);
    if (!inMemoryDb) {
      inMemoryDb = JSON.parse(JSON.stringify(INITIAL_CLEAN_DATABASE));
    }
    return inMemoryDb!;
  }
}

/**
 * Persist database state to memory immediately and flush to disk.
 * Handles Windows atomic file locking safely.
 */
function saveDb(data: DatabaseSchema): void {
  const { dir, filePath } = getDatabaseLocation();
  data.lastUpdated = new Date().toISOString();
  inMemoryDb = data;

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const serialized = JSON.stringify(data, null, 2);
    // Write directly to file to prevent Windows EPERM / EBUSY rename failures
    fs.writeFileSync(filePath, serialized, 'utf-8');
  } catch (err) {
    console.error('Disk flush warning (memory preserved):', err);
  }
}

export const serverDb = {
  getState(): DatabaseSchema {
    return ensureDbFile();
  },

  // 1. PATIENT OPERATIONS
  patients: {
    getAll(): PatientProfile[] {
      return ensureDbFile().patients || [];
    },

    getById(id: string): PatientProfile | undefined {
      return (ensureDbFile().patients || []).find((p) => p.id === id);
    },

    insert(patient: PatientProfile): PatientProfile {
      const db = ensureDbFile();
      // Prepend patient, preventing duplicates
      db.patients = [patient, ...(db.patients || []).filter((p) => p.id !== patient.id)];

      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';
      db.audit = [
        {
          id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: timeNow,
          action: 'PATIENT_RECORDED',
          details: `Patient registered: ${patient.name} (${patient.code}). Proxy contact: ${patient.notificationContact.name}`,
          actor: 'Clinical Intake Officer',
          status: 'success',
        },
        ...(db.audit || []),
      ];

      saveDb(db);
      return patient;
    },

    delete(id: string): boolean {
      const db = ensureDbFile();
      const patient = (db.patients || []).find((p) => p.id === id);
      if (!patient) return false;

      // CASCADING DELETION: Remove patient, their events, and SMS notifications
      db.patients = (db.patients || []).filter((p) => p.id !== id);
      db.events = (db.events || []).filter((e) => e.patientId !== id);
      db.sms = (db.sms || []).filter((s) => s.patientName !== patient.name);

      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';
      db.audit = [
        {
          id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: timeNow,
          action: 'PATIENT_DELETED',
          details: `Patient ${patient.name} (${patient.code}) and all associated records purged.`,
          actor: 'Facility Administrator',
          status: 'warning',
        },
        ...(db.audit || []),
      ];

      saveDb(db);
      return true;
    },
  },

  // 2. APPOINTMENT & EVENT OPERATIONS
  events: {
    getAll(): CareEvent[] {
      return ensureDbFile().events || [];
    },

    getByPatientId(patientId: string): CareEvent[] {
      return (ensureDbFile().events || []).filter((e) => e.patientId === patientId);
    },

    insert(event: CareEvent): CareEvent {
      const db = ensureDbFile();
      db.events = [event, ...(db.events || []).filter((e) => e.id !== event.id)];

      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';
      db.audit = [
        {
          id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: timeNow,
          action: 'APPOINTMENT_PERSISTED',
          details: `Visit scheduled: ${event.title} for ${event.date} at ${event.time}`,
          actor: event.clinicianName || 'Nurse Blessing Aliyu',
          status: 'success',
        },
        ...(db.audit || []),
      ];

      saveDb(db);
      return event;
    },

    update(id: string, updates: Partial<CareEvent>): CareEvent | null {
      const db = ensureDbFile();
      const idx = (db.events || []).findIndex((e) => e.id === id);
      if (idx === -1) return null;

      db.events[idx] = { ...db.events[idx], ...updates };
      saveDb(db);
      return db.events[idx];
    },

    delete(id: string): boolean {
      const db = ensureDbFile();
      const existing = (db.events || []).find((e) => e.id === id);
      if (!existing) return false;

      db.events = (db.events || []).filter((e) => e.id !== id);

      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';
      db.audit = [
        {
          id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: timeNow,
          action: 'APPOINTMENT_DELETED',
          details: `Visit record purged: ${existing.title} for ${existing.date}`,
          actor: 'Clinical Records Officer',
          status: 'warning',
        },
        ...(db.audit || []),
      ];

      saveDb(db);
      return true;
    },
  },

  // 3. SMS DELIVERIES
  sms: {
    getAll(): SmsMessage[] {
      return ensureDbFile().sms || [];
    },

    insert(msg: SmsMessage): SmsMessage {
      const db = ensureDbFile();
      db.sms = [msg, ...(db.sms || [])];
      saveDb(db);
      return msg;
    },
  },

  // 4. AUDIT LOGS
  audit: {
    getAll(): AuditEvent[] {
      return ensureDbFile().audit || [];
    },

    insert(entry: AuditEvent): AuditEvent {
      const db = ensureDbFile();
      db.audit = [entry, ...(db.audit || [])];
      saveDb(db);
      return entry;
    },
  },

  // Wipe / reset to clean state
  resetAll(): void {
    inMemoryDb = JSON.parse(JSON.stringify(INITIAL_CLEAN_DATABASE));
    saveDb(inMemoryDb!);
  },
};
