'use client';

import { useState, useEffect } from 'react';
import { PatientProfile, CareEvent, SmsMessage, AuditEvent, CareCategory } from './types';
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

  // Modal controls
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);

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

  // Action: Register Real Patient
  const registerRealPatient = async (data: {
    name: string;
    category: CareCategory;
    relationship: 'self' | 'child' | 'mother' | 'dependent';
    stageInfo: string;
    phone?: string;
    proxyName?: string;
    proxyPhone?: string;
    proxyRelationship?: string;
  }) => {
    const newId = `pat-${Date.now()}`;
    const codePrefix = data.category === 'maternal' ? 'M' : data.category === 'immunisation' ? 'C' : 'A';
    const code = `CP-${codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPatient: PatientProfile = {
      id: newId,
      code,
      name: data.name,
      relationship: data.relationship,
      category: data.category,
      categoryLabel:
        data.category === 'maternal'
          ? 'Maternal & Antenatal Care'
          : data.category === 'immunisation'
          ? 'National Immunisation (NPHCDA)'
          : data.category === 'postnatal'
          ? 'Postnatal & Neonatal Care'
          : 'General & Chronic Health',
      stageInfo: data.stageInfo,
      avatarInitials: data.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      phoneOwnedByPatient: !!data.phone,
      registeredPhone: data.phone,
      notificationContact: {
        name: data.proxyName || data.name,
        phone: data.proxyPhone || data.phone || customJudgePhone || '+234 803 000 1122',
        relationship: data.proxyRelationship || (data.phone ? 'Self' : 'Caregiver Proxy'),
      },
    };

    // Auto-generate initial clinical event
    const newEvent: CareEvent = {
      id: `evt-${Date.now()}`,
      patientId: newId,
      title:
        data.category === 'immunisation'
          ? 'At-Birth / 6-Week Immunisation Intake'
          : data.category === 'maternal'
          ? 'Antenatal Registration & Initial Scan'
          : 'Initial Clinical Assessment',
      subtitle: data.stageInfo,
      facilityName: 'Garki Primary Healthcare Centre',
      facilityAddress: 'Area 10, Garki, Abuja FCT',
      date: 'Next Clinic Session',
      time: '09:00 AM',
      duePeriod: 'Intake Milestone',
      status: 'scheduled',
      category: data.category,
      instructions: ['Bring physical hospital card', 'Arrive between 8:30 AM and 10:30 AM'],
      clinicianName: 'Nurse Blessing Aliyu',
      clinicianRole: 'Senior Community Health Officer (CHO)',
      pidginAudioText: `Good day. Na reminder say your registration for Garki PHC don complete. Your next clinic date na Next Clinic Session by 9 in the morning.`,
      englishAudioText: `Good day. Your registration at Garki Primary Healthcare Centre is complete. Your next clinic session is scheduled for 09:00 AM.`,
      reminderSent: true,
      reminderDeliveryStatus: 'delivered',
    };

    const recipientPhone = newPatient.notificationContact.phone;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';

    const newSmsEntry: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: 'CAREPATH-NG',
      recipientPhone,
      recipientName: newPatient.notificationContact.name,
      patientName: newPatient.name,
      messageText: `CarePath: Registration confirmed for ${newPatient.name} at Garki PHC. Card #${code}. Routine appointment alerts will arrive on this number.`,
      timestamp: 'Just now',
      deliveryStatus: 'delivered',
      discreet: true,
      referenceCode: code,
    };

    const newAuditEntry: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: timeNow,
      action: 'PATIENT_REGISTERED',
      details: `New patient record created: ${newPatient.name} (${code}). Category: ${newPatient.categoryLabel}. Route: MTN Transactional.`,
      actor: 'Garki PHC Intake',
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

    // Call API in background
    try {
      fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch((e) => console.warn('Background API post error:', e));
    } catch {}
  };

  // Action: Schedule Real Appointment
  const scheduleRealAppointment = async (data: {
    patientId: string;
    title: string;
    subtitle: string;
    date: string;
    time: string;
    facilityName: string;
    facilityAddress: string;
    clinicianName: string;
    clinicianRole: string;
    instructions: string[];
    vaccines?: string[];
  }) => {
    const targetPatient = patients.find((p) => p.id === data.patientId) || patients[0];
    const newEventId = `evt-${Date.now()}`;

    const newEvent: CareEvent = {
      id: newEventId,
      patientId: data.patientId,
      title: data.title,
      subtitle: data.subtitle,
      facilityName: data.facilityName,
      facilityAddress: data.facilityAddress,
      date: data.date,
      time: data.time,
      duePeriod: 'Scheduled Visit',
      status: 'scheduled',
      category: targetPatient.category,
      instructions: data.instructions,
      clinicianName: data.clinicianName,
      clinicianRole: data.clinicianRole,
      vaccines: data.vaccines || [],
      pidginAudioText: `Good day. Na reminder say your appointment for ${data.title} dey come up on ${data.date} by ${data.time} for ${data.facilityName}. Carry your hospital card come. If you go fit come, reply 1. If you wan change date, reply 2. Thank you!`,
      englishAudioText: `Good day. This is a reminder for your appointment (${data.title}) at ${data.facilityName} scheduled for ${data.date} at ${data.time}. Please remember to bring your card. Reply 1 to confirm or 2 to reschedule.`,
      reminderSent: true,
      reminderDeliveryStatus: 'delivered',
      lastNotificationSnippet: `CarePath: Appointment scheduled at ${data.facilityName} on ${data.date} at ${data.time}. Reply 1 to Confirm.`,
    };

    const recipientPhone = customJudgePhone || targetPatient.notificationContact.phone || '+234 803 456 7890';
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';

    const newSmsEntry: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: 'CAREPATH-NG',
      recipientPhone,
      recipientName: targetPatient.notificationContact.name,
      patientName: targetPatient.name,
      messageText: `CarePath: Scheduled visit for ${targetPatient.name} at ${data.facilityName} on ${data.date} at ${data.time}. Ref: #${targetPatient.code}. Reply 1 to Confirm, 2 to Reschedule.`,
      timestamp: 'Just now',
      deliveryStatus: 'delivered',
      discreet: true,
      referenceCode: targetPatient.code,
    };

    const newAuditEntry: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: timeNow,
      action: 'APPOINTMENT_SCHEDULED',
      details: `Visit created: ${data.title} (${targetPatient.name}) at ${data.facilityName}. SMS reminder queued for ${recipientPhone}.`,
      actor: 'Care Continuity Engine',
      status: 'success',
    };

    const updatedEvents = [newEvent, ...events];
    const updatedSms = [newSmsEntry, ...smsLog];
    const updatedAudit = [newAuditEntry, ...auditLogs];

    setEvents(updatedEvents);
    setSmsLog(updatedSms);
    setAuditLogs(updatedAudit);

    broadcastSync(updatedEvents, updatedSms, updatedAudit);

    // Call API in background
    try {
      fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          patientName: targetPatient.name,
          recipientPhone,
        }),
      }).catch((e) => console.warn('Background API post error:', e));
    } catch {}
  };

  // Action: Confirm Appointment
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

  // Action: Reschedule Request
  const requestReschedule = (eventId: string, newDateText: string = 'Next Thursday, Nov 21') => {
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

    const newSmsEntry: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: 'CAREPATH-NG',
      recipientPhone: customJudgePhone || activePatient?.notificationContact.phone || '+234 803 456 7890',
      recipientName: activePatient?.notificationContact.name || 'Caregiver',
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

  // Action: Mark Visit Administered & Completed (NPHCDA Interval Recalculation)
  const markAdministeredAndCompleted = (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const newEvents = events.map((ev) =>
      ev.id === eventId
        ? {
            ...ev,
            status: 'completed' as const,
            reminderDeliveryStatus: 'acknowledged' as const,
          }
        : ev
    );

    const activePatient = patients.find((p) => p.id === targetEvent.patientId);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';

    const newAuditEntry: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: timeNow,
      action: 'VACCINATION_ADMINISTERED',
      details: `Clinical dose confirmed administered for ${targetEvent.title} (${activePatient?.name}). Federal Child Health Registry updated.`,
      actor: 'Matron Fatima Yusuf (Garki PHC)',
      status: 'success',
    };

    const newAudit = [newAuditEntry, ...auditLogs];
    setEvents(newEvents);
    setAuditLogs(newAudit);
    broadcastSync(newEvents, smsLog, newAudit);
  };

  // Action: Dispatch Manual Reminder
  const dispatchManualReminder = (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const activePatient = patients.find((p) => p.id === targetEvent.patientId);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WAT';
    const recipientPhone = customJudgePhone || activePatient?.notificationContact.phone || '+234 803 456 7890';

    const newSmsEntry: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: 'CAREPATH-NG',
      recipientPhone,
      recipientName: activePatient?.notificationContact.name || 'Caregiver',
      patientName: activePatient?.name || 'Patient',
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
      details: `Transactional DND whitelist route used. Operator bind: MTN-NG. Recipient: ${recipientPhone}`,
      actor: 'Termii / SMS Adapter',
      status: 'info',
    };

    const newSms = [newSmsEntry, ...smsLog];
    const newAudit = [newAuditEntry, ...auditLogs];

    setSmsLog(newSms);
    setAuditLogs(newAudit);
    broadcastSync(events, newSms, newAudit);

    // Call API in background
    try {
      fetch('/api/telephony/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientPhone,
          message: newSmsEntry.messageText,
          referenceId: targetEvent.id,
        }),
      }).catch((e) => console.warn('Background SMS dispatch error:', e));
    } catch {}
  };

  // Action: Export Clinical Records (JSON file download)
  const exportDataToJson = () => {
    const dataToExport = {
      exportTimestamp: new Date().toISOString(),
      facility: 'Garki Primary Healthcare Centre',
      patients,
      events,
      smsLog,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carepath-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Action: Clear / Purge Data for Fresh Facility Setup
  const clearAllData = () => {
    if (typeof window !== 'undefined' && window.confirm('Clear all local patient records and reset facility registry?')) {
      localStorage.clear();
      setPatients([]);
      setEvents([]);
      setSmsLog([]);
      setAuditLogs([]);
      setActivePatientId('');
      broadcastSync([], [], []);
    }
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
    isNewPatientModalOpen,
    isNewAppointmentModalOpen,
    setIsNewPatientModalOpen,
    setIsNewAppointmentModalOpen,
    setSelectedEventForSheet,
    handleSelectPatient,
    handleUpdateJudgePhone,
    registerRealPatient,
    scheduleRealAppointment,
    confirmAppointment,
    requestReschedule,
    markAdministeredAndCompleted,
    dispatchManualReminder,
    exportDataToJson,
    clearAllData,
  };
}
