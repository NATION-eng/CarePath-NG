export type CareCategory = 'maternal' | 'immunisation' | 'postnatal' | 'general';

export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'rescheduled'
  | 'cancelled'
  | 'completed'
  | 'missed';

export type ReminderStatus =
  | 'scheduled'
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'acknowledged'
  | 'failed';

export interface PatientProfile {
  id: string;
  code: string;
  name: string;
  relationship: 'self' | 'child' | 'mother' | 'dependent';
  category: CareCategory;
  categoryLabel: string;
  stageInfo: string;
  avatarInitials: string;
  phoneOwnedByPatient: boolean;
  registeredPhone?: string;
  notificationContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface CareEvent {
  id: string;
  patientId: string;
  title: string;
  subtitle: string;
  facilityName: string;
  facilityAddress: string;
  date: string;
  time: string;
  duePeriod: string;
  status: AppointmentStatus;
  category: CareCategory;
  instructions: string[];
  clinicianName: string;
  clinicianRole: string;
  vaccines?: string[];
  pidginAudioText: string;
  englishAudioText: string;
  reminderSent: boolean;
  reminderDeliveryStatus: ReminderStatus;
  lastNotificationSnippet?: string;
}

export interface SmsMessage {
  id: string;
  sender: string;
  recipientPhone: string;
  recipientName: string;
  patientName: string;
  messageText: string;
  timestamp: string;
  deliveryStatus: ReminderStatus;
  discreet: boolean;
  referenceCode: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  actor: string;
  status: 'info' | 'success' | 'warning' | 'alert';
}
