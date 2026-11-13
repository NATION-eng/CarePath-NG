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

/**
 * Resolves the writable database path.
 * In Vercel serverless functions, the root filesystem is read-only (/var/task).
 * We automatically route to os.tmpdir() (/tmp) when running on Vercel or when
 * the project data directory is read-only.
 */
function getDatabaseLocation(): { dir: string; filePath: string } {
  const isServerless = !!(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NOW_REGION
  );

  if (isServerless) {
    const tmpDir = os.tmpdir();
    return {
      dir: tmpDir,
      filePath: path.join(tmpDir, 'carepath_primary.db.json'),
    };
  }

  const localDir = path.resolve(process.cwd(), 'data');
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    // Test write permission
    const testFile = path.join(localDir, `.write-test-${Date.now()}`);
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    return {
      dir: localDir,
      filePath: path.join(localDir, 'carepath_primary.db.json'),
    };
  } catch {
    // Filesystem is read-only (e.g. Vercel build container), fallback to temp directory
    const tmpDir = os.tmpdir();
    return {
      dir: tmpDir,
      filePath: path.join(tmpDir, 'carepath_primary.db.json'),
    };
  }
}

/**
 * Ensure database file exists. If running on Vercel/tmp and file not yet copied,
 * seeds from bundled repository data or clean initial schema.
 */
function ensureDbFile(): DatabaseSchema {
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
          saveDb(parsed);
          return parsed;
        } catch {
          // If reading seed fails, write clean default
          saveDb(INITIAL_CLEAN_DATABASE);
          return INITIAL_CLEAN_DATABASE;
        }
      }

      saveDb(INITIAL_CLEAN_DATABASE);
      return INITIAL_CLEAN_DATABASE;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file, resetting to clean schema:', err);
    saveDb(INITIAL_CLEAN_DATABASE);
    return INITIAL_CLEAN_DATABASE;
  }
}

/**
 * Persist database state atomically with fallback to direct write.
 */
function saveDb(data: DatabaseSchema): void {
  const { dir, filePath } = getDatabaseLocation();

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    data.lastUpdated = new Date().toISOString();

    const serialized = JSON.stringify(data, null, 2);
    const tempPath = path.join(dir, `.tmp.${Date.now()}.${Math.random().toString(36).slice(2)}.db.json`);

    try {
      fs.writeFileSync(tempPath, serialized, 'utf-8');
      fs.renameSync(tempPath, filePath);
    } catch {
      // In environments where atomic rename across volumes fails, fallback to direct write
      fs.writeFileSync(filePath, serialized, 'utf-8');
      if (fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
        } catch {}
      }
    }
  } catch (err) {
    console.error('Failed to commit transaction to disk:', err);
    throw new Error('Database write failure');
  }
}

export const serverDb = {
  // Read full state
  getState(): DatabaseSchema {
    return ensureDbFile();
  },

  // 1. PATIENT OPERATIONS
  patients: {
    getAll(): PatientProfile[] {
      return ensureDbFile().patients;
    },

    getById(id: string): PatientProfile | undefined {
      return ensureDbFile().patients.find((p) => p.id === id);
    },

    insert(patient: PatientProfile): PatientProfile {
      const db = ensureDbFile();
      // Prevent duplicates by code or id
      db.patients = [patient, ...db.patients.filter((p) => p.id !== patient.id)];

      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';
      db.audit.unshift({
        id: `aud-${Date.now()}`,
        timestamp: timeNow,
        action: 'PATIENT_RECORDED',
        details: `Patient registered: ${patient.name} (${patient.code}). Proxy contact: ${patient.notificationContact.name}`,
        actor: 'Clinical Intake Officer',
        status: 'success',
      });

      saveDb(db);
      return patient;
    },

    delete(id: string): boolean {
      const db = ensureDbFile();
      const patient = db.patients.find((p) => p.id === id);
      if (!patient) return false;

      // CASCADING DELETION: Remove patient, their events, and SMS notifications
      db.patients = db.patients.filter((p) => p.id !== id);
      db.events = db.events.filter((e) => e.patientId !== id);
      db.sms = db.sms.filter((s) => s.patientName !== patient.name);

      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';
      db.audit.unshift({
        id: `aud-${Date.now()}`,
        timestamp: timeNow,
        action: 'PATIENT_DELETED',
        details: `Patient ${patient.name} (${patient.code}) and all associated care schedules purged per NDPA 2023 request.`,
        actor: 'Facility Administrator',
        status: 'warning',
      });

      saveDb(db);
      return true;
    },
  },

  // 2. APPOINTMENT & EVENT OPERATIONS
  events: {
    getAll(): CareEvent[] {
      return ensureDbFile().events;
    },

    getByPatientId(patientId: string): CareEvent[] {
      return ensureDbFile().events.filter((e) => e.patientId === patientId);
    },

    insert(event: CareEvent): CareEvent {
      const db = ensureDbFile();
      db.events = [event, ...db.events.filter((e) => e.id !== event.id)];

      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';
      db.audit.unshift({
        id: `aud-${Date.now()}`,
        timestamp: timeNow,
        action: 'APPOINTMENT_PERSISTED',
        details: `Visit scheduled: ${event.title} at ${event.facilityName} for ${event.date} at ${event.time}`,
        actor: event.clinicianName || 'Nurse Blessing Aliyu',
        status: 'success',
      });

      saveDb(db);
      return event;
    },

    update(id: string, updates: Partial<CareEvent>): CareEvent | null {
      const db = ensureDbFile();
      const idx = db.events.findIndex((e) => e.id === id);
      if (idx === -1) return null;

      db.events[idx] = { ...db.events[idx], ...updates };
      saveDb(db);
      return db.events[idx];
    },

    delete(id: string): boolean {
      const db = ensureDbFile();
      const existing = db.events.find((e) => e.id === id);
      if (!existing) return false;

      db.events = db.events.filter((e) => e.id !== id);
      saveDb(db);
      return true;
    },
  },

  // 3. SMS DELIVERIES
  sms: {
    getAll(): SmsMessage[] {
      return ensureDbFile().sms;
    },

    insert(msg: SmsMessage): SmsMessage {
      const db = ensureDbFile();
      db.sms = [msg, ...db.sms];
      saveDb(db);
      return msg;
    },
  },

  // 4. AUDIT LOGS
  audit: {
    getAll(): AuditEvent[] {
      return ensureDbFile().audit;
    },

    insert(entry: AuditEvent): AuditEvent {
      const db = ensureDbFile();
      db.audit = [entry, ...db.audit];
      saveDb(db);
      return entry;
    },
  },

  // Wipe / reset to empty state
  resetAll(): void {
    saveDb(INITIAL_CLEAN_DATABASE);
  },
};
