import { PatientProfile, CareEvent, SmsMessage, AuditEvent } from './types';

// Zero synthetic test subjects / placeholders. Clean clinical start.
export const INITIAL_PATIENTS: PatientProfile[] = [];

export const INITIAL_EVENTS: CareEvent[] = [];

export const INITIAL_SMS_LOG: SmsMessage[] = [];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-init-001',
    timestamp: 'Just now',
    action: 'CAREPATH_REGISTRY_INITIALIZED',
    details: 'Primary Healthcare Continuity Platform active. Connected to Garki Primary Healthcare Centre (FCT-04).',
    actor: 'Federal Ministry of Health Protocol',
    status: 'info',
  },
];
