'use client';

import { useState, useEffect, useCallback } from 'react';
import { PatientProfile, CareEvent, SmsMessage, AuditEvent, CareCategory } from './types';
import { INITIAL_PATIENTS, INITIAL_EVENTS, INITIAL_SMS_LOG, INITIAL_AUDIT_LOGS } from './mockData';

const STORAGE_KEYS = {
  PATIENTS: 'carepath_patients_v2',
  EVENTS: 'carepath_events_v2',
  SMS: 'carepath_sms_v2',
  AUDIT: 'carepath_audit_v2',
  ACTIVE_ID: 'carepath_active_patient_id_v2',
};

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

  // Save to client localStorage backup
  const persistLocally = (
    newPatients?: PatientProfile[],
    newEvents?: CareEvent[],
    newSms?: SmsMessage[],
    newAudit?: AuditEvent[],
    newActiveId?: string
  ) => {
    if (typeof window === 'undefined') return;
    try {
      if (newPatients !== undefined) localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(newPatients));
      if (newEvents !== undefined) localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(newEvents));
      if (newSms !== undefined) localStorage.setItem(STORAGE_KEYS.SMS, JSON.stringify(newSms));
      if (newAudit !== undefined) localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(newAudit));
      if (newActiveId !== undefined) localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, newActiveId);
    } catch {}
  };

  // Fetch initial data from server database with local storage resilience
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
        const serverPatients: PatientProfile[] = patData.patients || [];
        
        setPatients((prev) => {
          // If server returned patients, use them. If server returned empty but local has items, preserve local!
          if (serverPatients.length > 0) {
            persistLocally(serverPatients);
            return serverPatients;
          }
          if (prev.length > 0) {
            // Re-sync local patients to server in case server restarted
            prev.forEach((pat) => {
              fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pat),
              }).catch(() => {});
            });
            return prev;
          }
          persistLocally([]);
          return [];
        });

        if (serverPatients.length > 0) {
          setActivePatientId((prev) => {
            const stillExists = serverPatients.some((p: PatientProfile) => p.id === prev);
            const chosenId = stillExists && prev ? prev : serverPatients[0].id;
            persistLocally(undefined, undefined, undefined, undefined, chosenId);
            return chosenId;
          });
        }
      }

      if (aptRes.ok) {
        const aptData = await aptRes.json();
        const serverEvents: CareEvent[] = aptData.events || [];
        setEvents((prev) => {
          if (serverEvents.length > 0) {
            persistLocally(undefined, serverEvents);
            return serverEvents;
          }
          return prev;
        });
      }

      if (smsRes.ok) {
        const smsData = await smsRes.json();
        const serverSms: SmsMessage[] = smsData.sms || [];
        setSmsLog(serverSms);
        persistLocally(undefined, undefined, serverSms);
      }

      if (audRes.ok) {
        const audData = await audRes.json();
        const serverAudit: AuditEvent[] = audData.logs || [];
        setAuditLogs(serverAudit);
        persistLocally(undefined, undefined, undefined, serverAudit);
      }
    } catch (err) {
      console.warn('Backend fetch note (local cache active):', err);
    } finally {
      setIsLoadingBackend(false);
    }
  }, []);

  // On initial mount: load localStorage IMMEDIATELY so records never flash empty
  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined') {
      try {
        const localPat = localStorage.getItem(STORAGE_KEYS.PATIENTS);
        const localApt = localStorage.getItem(STORAGE_KEYS.EVENTS);
        const localSms = localStorage.getItem(STORAGE_KEYS.SMS);
        const localAud = localStorage.getItem(STORAGE_KEYS.AUDIT);
        const localActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);

        if (localPat) {
          const parsed = JSON.parse(localPat);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPatients(parsed);
            if (localActiveId) {
              setActivePatientId(localActiveId);
            } else {
              setActivePatientId(parsed[0].id);
            }
          }
        }

        if (localApt) {
          const parsed = JSON.parse(localApt);
          if (Array.isArray(parsed)) setEvents(parsed);
        }

        if (localSms) {
          const parsed = JSON.parse(localSms);
          if (Array.isArray(parsed)) setSmsLog(parsed);
        }

        if (localAud) {
          const parsed = JSON.parse(localAud);
          if (Array.isArray(parsed)) setAuditLogs(parsed);
        }
      } catch {}
    }

    refreshFromBackend();

    // BroadcastChannel for cross-tab synchronization
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
    persistLocally(undefined, undefined, undefined, undefined, id);
  };

  const handleUpdateJudgePhone = (phone: string) => {
    setCustomJudgePhone(phone);
  };

  // 1. REGISTER REAL PATIENT
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
        const newPatient: PatientProfile = result.patient;
        const initialEvt: CareEvent | undefined = result.initialEvent;

        setPatients((prev) => {
          const updated = [newPatient, ...prev.filter((p) => p.id !== newPatient.id)];
          persistLocally(updated);
          return updated;
        });

        setActivePatientId(newPatient.id);
        persistLocally(undefined, undefined, undefined, undefined, newPatient.id);

        if (initialEvt) {
          setEvents((prev) => {
            const updated = [initialEvt, ...prev.filter((e) => e.id !== initialEvt.id)];
            persistLocally(undefined, updated);
            return updated;
          });
        }

        notifySync();
      }
    } catch (err) {
      console.error('Failed to register patient:', err);
    }
  };

  // 2. DELETE PATIENT & THEIR RECORDS (CASCADING PURGE)
  const deletePatient = async (patientId: string) => {
    const patientToDelete = patients.find((p) => p.id === patientId);

    // Optimistically remove from client state and storage immediately
    const remainingPatients = patients.filter((p) => p.id !== patientId);
    const remainingEvents = events.filter((e) => e.patientId !== patientId);
    const remainingSms = patientToDelete ? smsLog.filter((s) => s.patientName !== patientToDelete.name) : smsLog;

    const nextActiveId = remainingPatients.length > 0 ? remainingPatients[0].id : '';

    setPatients(remainingPatients);
    setEvents(remainingEvents);
    setSmsLog(remainingSms);
    setActivePatientId(nextActiveId);

    persistLocally(remainingPatients, remainingEvents, remainingSms, undefined, nextActiveId);

    try {
      await fetch(`/api/patients?id=${encodeURIComponent(patientId)}`, {
        method: 'DELETE',
      });
      notifySync();
    } catch (err) {
      console.error('Failed to delete patient on backend:', err);
    }
  };

  // 3. SCHEDULE REAL APPOINTMENT
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
        const newEvent: CareEvent = result.event;

        setEvents((prev) => {
          const updated = [newEvent, ...prev.filter((e) => e.id !== newEvent.id)];
          persistLocally(undefined, updated);
          return updated;
        });

        // Automatically switch active patient to the patient of this appointment
        if (data.patientId) {
          setActivePatientId(data.patientId);
          persistLocally(undefined, undefined, undefined, undefined, data.patientId);
        }

        notifySync();
      }
    } catch (err) {
      console.error('Failed to schedule appointment:', err);
    }
  };

  // 4. CONFIRM APPOINTMENT
  const confirmAppointment = async (eventId: string, source: 'app' | 'sms' = 'app') => {
    setEvents((prev) => {
      const updated = prev.map((e) => (e.id === eventId ? { ...e, status: 'confirmed' as const } : e));
      persistLocally(undefined, updated);
      return updated;
    });

    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, status: 'confirmed' }),
      });
      notifySync();
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
    }
  };

  // 5. REQUEST RESCHEDULE
  const requestReschedule = async (eventId: string, newDate: string) => {
    setEvents((prev) => {
      const updated = prev.map((e) => (e.id === eventId ? { ...e, date: newDate, status: 'rescheduled' as const } : e));
      persistLocally(undefined, updated);
      return updated;
    });

    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, date: newDate, status: 'rescheduled' }),
      });
      notifySync();
    } catch (err) {
      console.error('Failed to reschedule:', err);
    }
  };

  // 6. MARK ADMINISTERED / COMPLETED
  const markAdministeredAndCompleted = async (eventId: string) => {
    setEvents((prev) => {
      const updated = prev.map((e) => (e.id === eventId ? { ...e, status: 'completed' as const } : e));
      persistLocally(undefined, updated);
      return updated;
    });

    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, status: 'completed' }),
      });
      notifySync();
    } catch (err) {
      console.error('Failed to complete appointment:', err);
    }
  };

  // 7. DISPATCH MANUAL SMS
  const dispatchManualReminder = async (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const patientForEvent = patients.find((p) => p.id === targetEvent.patientId);
    const recipientPhone = patientForEvent?.notificationContact.phone || customJudgePhone || '+234 800 000 0000';

    try {
      await fetch('/api/telephony/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientPhone,
          message: `CarePath: Important visit for ${patientForEvent?.name || 'patient'} at ${targetEvent.facilityName} on ${targetEvent.date} at ${targetEvent.time}. Ref: #${patientForEvent?.code}. Reply 1 to Confirm.`,
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
    a.download = `carepath-records-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Resolves the active patient and always matches activeEvents to that patient
  const activePatient = patients.find((p) => p.id === activePatientId) || (patients.length > 0 ? patients[0] : undefined);
  const resolvedPatientId = activePatient?.id || activePatientId;
  const activeEvents = events.filter((e) => e.patientId === resolvedPatientId);

  return {
    isClient,
    isLoadingBackend,
    patients,
    events,
    smsLog,
    auditLogs,
    activePatient,
    activePatientId: resolvedPatientId,
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
