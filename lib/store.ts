'use client';

import { useState, useEffect } from 'react';
import { PatientProfile, CareEvent, SmsMessage, AuditEvent } from './types';
import { INITIAL_PATIENTS, INITIAL_EVENTS, INITIAL_SMS_LOG, INITIAL_AUDIT_LOGS } from './mockData';

const STORAGE_KEYS = {
  PATIENTS: 'carepath_patients_v1',
  EVENTS: 'carepath_events_v1',
  SMS: 'carepath_sms_v1',
  AUDIT: 'carepath_audit_v1',
  ACTIVE_PATIENT: 'carepath_active_patient_v1',
  CUSTOM_PHONE: 'carepath_custom_phone_v1',
};

export function useCarePathStore() {
  const [isClient, setIsClient] = useState(false);
  const [patients, setPatients] = useState<PatientProfile[]>(INITIAL_PATIENTS);
  const [events, setEvents] = useState<CareEvent[]>(INITIAL_EVENTS);
  const [smsLog, setSmsLog] = useState<SmsMessage[]>(INITIAL_SMS_LOG);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [activePatientId, setActivePatientId] = useState<string>('pat-chinedu');
  const [customJudgePhone, setCustomJudgePhone] = useState<string>('');
  const [selectedEventForSheet, setSelectedEventForSheet] = useState<CareEvent | null>(null);

  // Initialize and sync with localStorage / BroadcastChannel
  useEffect(() => {
    setIsClient(true);
    try {
      const storedPatients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const storedSms = localStorage.getItem(STORAGE_KEYS.SMS);
      const storedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT);
      const storedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_PATIENT);
      const storedPhone = localStorage.getItem(STORAGE_KEYS.CUSTOM_PHONE);

      if (storedPatients) setPatients(JSON.parse(storedPatients));
      if (storedEvents) setEvents(JSON.parse(storedEvents));
      if (storedSms) setSmsLog(JSON.parse(storedSms));
      if (storedAudit) setAuditLogs(JSON.parse(storedAudit));
      if (storedActive) setActivePatientId(storedActive);
      if (storedPhone) setCustomJudgePhone(storedPhone);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('carepath_sync') : null;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.EVENTS && e.newValue) setEvents(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.SMS && e.newValue) setSmsLog(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.AUDIT && e.newValue) setAuditLogs(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.PATIENTS && e.newValue) setPatients(JSON.parse(e.newValue));
    };

    const handleChannelMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC') {
        if (event.data.events) setEvents(event.data.events);
        if (event.data.smsLog) setSmsLog(event.data.smsLog);
        if (event.data.auditLogs) setAuditLogs(event.data.auditLogs);
        if (event.data.patients) setPatients(event.data.patients);
      }
    };

    window.addEventListener('storage', handleStorage);
    if (channel) channel.onmessage = handleChannelMessage;

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
    };
  }, []);

  // Broadcast state changes
  const broadcastSync = (
    newEvents: CareEvent[],
    newSms: SmsMessage[],
    newAudit: AuditEvent[],
    newPatients?: PatientProfile[]
  ) => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(newEvents));
      localStorage.setItem(STORAGE_KEYS.SMS, JSON.stringify(newSms));
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(newAudit));
      if (newPatients) {
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(newPatients));
      }
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('carepath_sync');
        channel.postMessage({
          type: 'SYNC',
          events: newEvents,
          smsLog: newSms,
          auditLogs: newAudit,
          patients: newPatients || patients,
        });
        channel.close();
      }
    } catch (e) {
      console.warn('Sync error:', e);
    }
  };

  const handleSelectPatient = (id: string) => {
    setActivePatientId(id);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT, id);
    } catch {}
  };

  const handleUpdateJudgePhone = (phone: string) => {
    setCustomJudgePhone(phone);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PHONE, phone);
    } catch {}
  };

  // Action: Confirm Appointment (from App or SMS Reply '1')
  const confirmAppointment = (eventId: string, source: 'app' | 'sms' = 'app') => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const newEvents = events.map((ev) =>
      ev.id === eventId
        ? {
            ...ev,
            status: 'confirmed' as const,
            reminderDeliveryStatus: 'acknowledged' as const,
          }
        : ev
    );

    const activePatient = patients.find((p) => p.id === targetEvent.patientId);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';

    const newAuditEntry: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: timeNow,
      action: 'ATTENDANCE_CONFIRMED',
      details: `${source === 'sms' ? 'SMS Reply [1]' : 'Caregiver In-App action'}: Attendance confirmed for ${targetEvent.title} (${activePatient?.name}).`,
      actor: source === 'sms' ? 'Telco Inbound Webhook' : `${activePatient?.notificationContact.name}`,
      status: 'success',
    };

    const newAudit = [newAuditEntry, ...auditLogs];
    setEvents(newEvents);
    setAuditLogs(newAudit);
    broadcastSync(newEvents, smsLog, newAudit);
  };

  // Action: Reschedule Request (from App or SMS Reply '2')
  const requestReschedule = (eventId: string, newDateText: string = 'Next Week Thursday, Nov 21') => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const newEvents = events.map((ev) =>
      ev.id === eventId
        ? {
            ...ev,
            date: newDateText,
            status: 'rescheduled' as const,
            reminderDeliveryStatus: 'scheduled' as const,
          }
        : ev
    );

    const activePatient = patients.find((p) => p.id === targetEvent.patientId);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';

    // New discreet SMS sent for reschedule confirmation
    const newSmsEntry: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: 'CAREPATH-NG',
      recipientPhone: customJudgePhone || activePatient?.notificationContact.phone || '+234 803 456 7890',
      recipientName: activePatient?.notificationContact.name || 'Ada Eze',
      patientName: activePatient?.name || 'Patient',
      messageText: `CarePath: Appointment for ${activePatient?.name} has been moved to ${newDateText} at 09:00 AM at Garki PHC. Ref: #${activePatient?.code}. Reply 1 to Confirm.`,
      timestamp: 'Just now',
      deliveryStatus: 'delivered',
      discreet: true,
      referenceCode: activePatient?.code || 'CP-NEW',
    };

    const newAuditEntry: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: timeNow,
      action: 'RESCHEDULE_OUTBOX_TRIGGERED',
      details: `Old reminder jobs cancelled/superseded. New date allocated: ${newDateText}. Outbox job queued for ${activePatient?.name}.`,
      actor: 'Continuity Outbox Engine',
      status: 'warning',
    };

    const newSms = [newSmsEntry, ...smsLog];
    const newAudit = [newAuditEntry, ...auditLogs];

    setEvents(newEvents);
    setSmsLog(newSms);
    setAuditLogs(newAudit);
    broadcastSync(newEvents, newSms, newAudit);
  };

  // Action: Send New Outbound Reminder (e.g., Nurse triggers from portal or Judge triggers)
  const dispatchManualReminder = (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const activePatient = patients.find((p) => p.id === targetEvent.patientId);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';

    const newSmsEntry: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: 'CAREPATH-NG',
      recipientPhone: customJudgePhone || activePatient?.notificationContact.phone || '+234 803 456 7890',
      recipientName: activePatient?.notificationContact.name || 'Ada Eze',
      patientName: activePatient?.name || 'Baby Chinedu',
      messageText: `CarePath: Urgent reminder for ${targetEvent.title} (${activePatient?.name}) at ${targetEvent.facilityName} on ${targetEvent.date} at ${targetEvent.time}. Ref: #${activePatient?.code}. Reply 1 to Confirm.`,
      timestamp: 'Just now',
      deliveryStatus: 'delivered',
      discreet: true,
      referenceCode: activePatient?.code || 'CP-REM',
    };

    const newAuditEntry: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: timeNow,
      action: 'SMS_DISPATCHED_DIRECT',
      details: `Transactional DND whitelist route used. Operator bind: MTN-NG. Recipient: ${newSmsEntry.recipientPhone}`,
      actor: 'Termii / SMS Adapter',
      status: 'info',
    };

    const newSms = [newSmsEntry, ...smsLog];
    const newAudit = [newAuditEntry, ...auditLogs];

    setSmsLog(newSms);
    setAuditLogs(newAudit);
    broadcastSync(events, newSms, newAudit);
  };

  // Action: Fast PHC Child Registration (Nurse 20s Workflow)
  const registerNewChildPatient = (childName: string, motherName: string, phone: string, birthDate: string) => {
    const newId = `pat-${Date.now()}`;
    const code = `CP-C-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPatient: PatientProfile = {
      id: newId,
      code,
      name: childName,
      relationship: 'child',
      category: 'immunisation',
      categoryLabel: 'National Immunisation (NPHCDA)',
      stageInfo: '0 Weeks (Newborn)',
      avatarInitials: childName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      phoneOwnedByPatient: false,
      registeredPhone: undefined,
      notificationContact: {
        name: `${motherName} (Mother / Guardian)`,
        phone: phone || '+234 803 000 1122',
        relationship: 'Mother',
      },
    };

    // Auto-generate NPHCDA immunisation schedule
    const newEvent: CareEvent = {
      id: `evt-${Date.now()}`,
      patientId: newId,
      title: 'At-Birth Immunisation',
      subtitle: 'BCG, OPV 0, Hep B 0',
      facilityName: 'Garki Primary Healthcare Centre',
      facilityAddress: 'Area 10, Garki, Abuja FCT',
      date: 'Today',
      time: '12:00 PM',
      duePeriod: 'Birth Milestone',
      status: 'scheduled',
      category: 'immunisation',
      instructions: ['Administer BCG right forearm', 'Record on Federal Child Health Card'],
      clinicianName: 'Nurse Blessing Aliyu',
      clinicianRole: 'Senior CHO',
      vaccines: ['BCG', 'OPV 0', 'Hep B 0'],
      pidginAudioText: `Welcome ${childName}. First injection na for birth today for clinic. Yellow card don open.`,
      englishAudioText: `Welcome ${childName}. First birth immunisations scheduled for today.`,
      reminderSent: true,
      reminderDeliveryStatus: 'delivered',
    };

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';

    const newSmsEntry: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: 'CAREPATH-NG',
      recipientPhone: phone || '+234 803 000 1122',
      recipientName: motherName,
      patientName: childName,
      messageText: `CarePath: Welcome. ${childName} registered at Garki PHC. Card #${code}. Routine reminders will arrive on this number. Reply STOP to opt out.`,
      timestamp: 'Just now',
      deliveryStatus: 'delivered',
      discreet: true,
      referenceCode: code,
    };

    const newAuditEntry: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: timeNow,
      action: 'FAST_PHC_REGISTRATION',
      details: `Nurse registered newborn ${childName}. Proxy contact linked to ${motherName} (${phone}). NPHCDA DAG schedule initialized.`,
      actor: 'Garki PHC Rapid Entry',
      status: 'success',
    };

    const updatedPatients = [newPatient, ...patients];
    const updatedEvents = [newEvent, ...events];
    const updatedSms = [newSmsEntry, ...smsLog];
    const updatedAudit = [newAuditEntry, ...auditLogs];

    setPatients(updatedPatients);
    setEvents(updatedEvents);
    setSmsLog(updatedSms);
    setAuditLogs(updatedAudit);
    setActivePatientId(newId);

    broadcastSync(updatedEvents, updatedSms, updatedAudit, updatedPatients);
  };

  // Reset to default
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.SMS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PATIENT);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_PHONE);

    setPatients(INITIAL_PATIENTS);
    setEvents(INITIAL_EVENTS);
    setSmsLog(INITIAL_SMS_LOG);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActivePatientId('pat-chinedu');
    setCustomJudgePhone('');

    broadcastSync(INITIAL_EVENTS, INITIAL_SMS_LOG, INITIAL_AUDIT_LOGS, INITIAL_PATIENTS);
  };

  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0];
  const activeEvents = events.filter((e) => e.patientId === activePatientId);

  return {
    isClient,
    patients,
    events,
    smsLog,
    auditLogs,
    activePatient,
    activePatientId,
    activeEvents,
    customJudgePhone,
    selectedEventForSheet,
    setSelectedEventForSheet,
    handleSelectPatient,
    handleUpdateJudgePhone,
    confirmAppointment,
    requestReschedule,
    dispatchManualReminder,
    registerNewChildPatient,
    resetDemoData,
  };
}
