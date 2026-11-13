'use client';

import { useState, useEffect, useCallback } from 'react';
import { PatientProfile, CareEvent, SmsMessage, AuditEvent, CareCategory } from './types';
import { INITIAL_PATIENTS, INITIAL_EVENTS, INITIAL_SMS_LOG, INITIAL_AUDIT_LOGS } from './mockData';

export function useCarePathStore() {
  const [isClient, setIsClient] = useState(false);
  const [patients, setPatients] = useState<PatientProfile[]>(INITIAL_PATIENTS);
  const [events, setEvents] = useState<CareEvent[]>(INITIAL_EVENTS);
  const [smsLog, setSmsLog] = useState<SmsMessage[]>(INITIAL_SMS_LOG);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [activePatientId, setActivePatientId] = useState<string>('');
  const [customJudgePhone, setCustomJudgePhone] = useState<string>('');
  const [selectedEventForSheet, setSelectedEventForSheet] = useState<CareEvent | null>(null);

  // Modal controls
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);

  // Fetch initial data from server database
  const refreshFromBackend = useCallback(async () => {
    try {
      const [patRes, aptRes, smsRes, audRes] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/appointments'),
        fetch('/api/telephony/feed'),
        fetch('/api/audit'),
      ]);

      if (patRes.ok) {
        const patData = await patRes.json();
        setPatients(patData.patients || []);
        if (patData.patients && patData.patients.length > 0) {
          setActivePatientId((prev) => {
            const stillExists = patData.patients.some((p: PatientProfile) => p.id === prev);
            return stillExists ? prev : patData.patients[0].id;
          });
        } else {
          setActivePatientId('');
        }
      }

      if (aptRes.ok) {
        const aptData = await aptRes.json();
        setEvents(aptData.events || []);
      }

      if (smsRes.ok) {
        const smsData = await smsRes.json();
        setSmsLog(smsData.sms || []);
      }

      if (audRes.ok) {
        const audData = await audRes.json();
        setAuditLogs(audData.logs || []);
      }
    } catch (err) {
      console.warn('Error fetching from backend API:', err);
    } finally {
      setIsLoadingBackend(false);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    refreshFromBackend();

    // BroadcastChannel for cross-tab sync
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('carepath_sync') : null;

    const handleChannelMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC') {
        refreshFromBackend();
      }
    };

    if (channel) channel.onmessage = handleChannelMessage;

    return () => {
      if (channel) channel.close();
    };
  }, [refreshFromBackend]);

  const notifySync = () => {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('carepath_sync');
      channel.postMessage({ type: 'SYNC' });
      channel.close();
    }
  };

  const handleSelectPatient = (id: string) => {
    setActivePatientId(id);
  };

  const handleUpdateJudgePhone = (phone: string) => {
    setCustomJudgePhone(phone);
  };

  // 1. REGISTER REAL PATIENT (POST to serverDb backend)
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
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        const newPatient = result.patient;
        setPatients((prev) => [newPatient, ...prev]);
        setActivePatientId(newPatient.id);

        if (result.initialEvent) {
          setEvents((prev) => [result.initialEvent, ...prev]);
        }

        refreshFromBackend();
        notifySync();
      }
    } catch (err) {
      console.error('Failed to register patient:', err);
    }
  };

  // 2. DELETE PATIENT & THEIR DATA (DELETE to serverDb backend with cascading purge)
  const deletePatient = async (patientId: string) => {
    const patientToDelete = patients.find((p) => p.id === patientId);
    if (!patientToDelete) return;

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        `Are you sure you want to permanently delete ${patientToDelete.name} and purge all their clinical records, appointments, and reminders from the database? This action is irreversible.`
      );
      if (!confirmed) return;
    }

    try {
      const res = await fetch(`/api/patients?id=${patientId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPatients((prev) => prev.filter((p) => p.id !== patientId));
        setEvents((prev) => prev.filter((e) => e.patientId !== patientId));
        setSmsLog((prev) => prev.filter((s) => s.patientName !== patientToDelete.name));

        setActivePatientId((prev) => {
          if (prev === patientId) {
            const remaining = patients.filter((p) => p.id !== patientId);
            return remaining.length > 0 ? remaining[0].id : '';
          }
          return prev;
        });

        refreshFromBackend();
        notifySync();
      }
    } catch (err) {
      console.error('Failed to delete patient:', err);
    }
  };

  // 3. SCHEDULE REAL APPOINTMENT (POST to serverDb backend)
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
    const recipientPhone = targetPatient?.notificationContact.phone || customJudgePhone || '+234 800 000 0000';

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          patientName: targetPatient?.name,
          recipientPhone,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setEvents((prev) => [result.event, ...prev]);
        refreshFromBackend();
        notifySync();
      }
    } catch (err) {
      console.error('Failed to schedule appointment:', err);
    }
  };

  // 4. CONFIRM APPOINTMENT
  const confirmAppointment = async (eventId: string, source: 'app' | 'sms' = 'app') => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, status: 'confirmed' }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, status: 'confirmed', reminderDeliveryStatus: 'acknowledged' } : e))
        );
        refreshFromBackend();
        notifySync();
      }
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
    }
  };

  // 5. RESCHEDULE APPOINTMENT
  const requestReschedule = async (eventId: string, newDateText: string = 'Next Thursday, Nov 21') => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, status: 'rescheduled', date: newDateText }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, status: 'rescheduled', date: newDateText } : e))
        );
        refreshFromBackend();
        notifySync();
      }
    } catch (err) {
      console.error('Failed to reschedule appointment:', err);
    }
  };

  // 6. MARK ADMINISTERED & COMPLETED
  const markAdministeredAndCompleted = async (eventId: string) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, status: 'completed' }),
      });

      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, status: 'completed', reminderDeliveryStatus: 'acknowledged' } : e))
        );
        refreshFromBackend();
        notifySync();
      }
    } catch (err) {
      console.error('Failed to complete appointment:', err);
    }
  };

  // 7. DISPATCH MANUAL SMS REMINDER
  const dispatchManualReminder = async (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const activePatient = patients.find((p) => p.id === targetEvent.patientId);
    const recipientPhone = activePatient?.notificationContact.phone || customJudgePhone || '+234 800 000 0000';

    try {
      await fetch('/api/telephony/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientPhone,
          message: `CarePath: Important visit for ${activePatient?.name || 'patient'} at ${targetEvent.facilityName} on ${targetEvent.date} at ${targetEvent.time}. Ref: #${activePatient?.code}. Reply 1 to Confirm.`,
          referenceId: targetEvent.id,
        }),
      });
      refreshFromBackend();
      notifySync();
    } catch (err) {
      console.error('Failed to dispatch SMS:', err);
    }
  };

  // 8. EXPORT CLINICAL RECORDS (JSON download)
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
    a.download = `carepath-national-records-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0];
  const activeEvents = events.filter((e) => e.patientId === activePatientId);

  return {
    isClient,
    isLoadingBackend,
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
    deletePatient,
    scheduleRealAppointment,
    confirmAppointment,
    requestReschedule,
    markAdministeredAndCompleted,
    dispatchManualReminder,
    exportDataToJson,
    refreshFromBackend,
  };
}
