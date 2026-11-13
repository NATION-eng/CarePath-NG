import fs from 'node:fs';
import path from 'node:path';
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

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'carepath_primary.db.json');

const INITIAL_CLEAN_DATABASE: DatabaseSchema = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  facility: {
    name: 'Garki Primary Healthcare Centre',
    code: 'FCT-AMAC-PHC-004',
    state: 'FCT Abuja',
    lga: 'Abuja Municipal (AMAC)',
  },
  // CLEAN START: No synthetic test subjects / placeholders
  patients: [],
  events: [],
  sms: [],
  audit: [
    {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT',
      action: 'SYSTEM_INITIALIZED',
      details: 'CarePath NG Care Continuity Database initialized. Awaiting live clinical registrations.',
      actor: 'Garki PHC Registry',
      status: 'info',
    },
  ],
};

function ensureDbFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
      saveDb(INITIAL_CLEAN_DATABASE);
      return INITIAL_CLEAN_DATABASE;
    }

    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file, resetting to clean schema:', err);
    saveDb(INITIAL_CLEAN_DATABASE);
    return INITIAL_CLEAN_DATABASE;
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    data.lastUpdated = new Date().toISOString();
    
    // Atomic write pattern: write to temp file then rename
    const tempPath = `${DB_PATH}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
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
