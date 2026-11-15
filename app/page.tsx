'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useCarePathStore } from '@/lib/store';
import { LandingPage } from '@/components/landing/LandingPage';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import { FacilityPortal } from '@/components/FacilityPortal';
import { SmsSimulator } from '@/components/SmsSimulator';
import { LiveEventLog } from '@/components/LiveEventLog';
import { AppointmentSheet } from '@/components/AppointmentSheet';
import { NewPatientModal } from '@/components/NewPatientModal';
import { NewAppointmentModal } from '@/components/NewAppointmentModal';
import { StaffPinModal } from '@/components/security/StaffPinModal';
import { 
  Building2, 
  Activity, 
  Smartphone,
  HeartHandshake,
  ArrowLeft,
  Lock,
  Unlock,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

type ViewMode = 'landing' | 'client' | 'portal' | 'sms' | 'logs';

export default function CarePathApp() {
  const store = useCarePathStore();
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [, startTransition] = useTransition();
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false);
  const [isStaffPinModalOpen, setIsStaffPinModalOpen] = useState(false);

  const navigateToView = (newMode: ViewMode) => {
    startTransition(() => {
      setViewMode(newMode);
    });
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  // Handle PWA App Shortcuts & Direct Navigation Query Parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const action = params.get('action');
        if (action === 'client') {
          setViewMode('client');
        } else if (action === 'staff' || action === 'portal') {
          setIsStaffPinModalOpen(true);
        } else if (action === 'book') {
          if (store.patients.length === 0) {
            store.setIsNewPatientModalOpen(true);
          } else {
            store.setIsNewAppointmentModalOpen(true);
          }
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state
  if (!store.isClient || store.isLoadingBackend) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-base px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-petrol-900 text-peach-500 font-black text-xl border-2 border-petrol-800 animate-pulse shadow-card">
            CP
          </div>
          <div className="flex items-center gap-2 text-petrol-950 font-black text-sm sm:text-base">
            <span className="h-2.5 w-2.5 rounded-full bg-peach-500 animate-ping" />
            <span>Connecting to CarePath NG Continuity Engine...</span>
          </div>
          <p className="text-xs text-surface-dark/60 font-semibold">
            Loading Garki Primary Healthcare Centre schedules & SMS engine
          </p>
        </div>
      </div>
    );
  }

  // Handle staff entry gate
  const handleOpenStaffWorkspace = () => {
    if (isStaffAuthenticated) {
      navigateToView('portal');
    } else {
      setIsStaffPinModalOpen(true);
    }
  };

  // Handle successful staff authentication
  const handleStaffAuthSuccess = () => {
    setIsStaffAuthenticated(true);
    setIsStaffPinModalOpen(false);
    navigateToView('portal');
  };

  // Handle SMS reply simulator
  const handleSmsReply = (replyText: string) => {
    if (replyText === '1') {
      const targetEvent = store.activeEvents.find((e) => e.status === 'scheduled') || store.activeEvents[0];
      if (targetEvent) {
        store.confirmAppointment(targetEvent.id, 'sms');
      }
    } else if (replyText === '2') {
      const targetEvent = store.activeEvents.find((e) => e.status === 'scheduled') || store.activeEvents[0];
      if (targetEvent) {
        store.requestReschedule(targetEvent.id, 'Next Thursday, Nov 21');
      }
    } else {
      store.requestReschedule(store.activeEvents[0]?.id || '', 'Clinic Review Date');
    }
  };

  // 1. PUBLIC LANDING PAGE (DEFAULT VIEW)
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onStartPatientApp={() => {
            playChime('confirm');
            navigateToView('client');
          }}
          onCreateAccount={() => {
            playChime('confirm');
            store.setIsNewPatientModalOpen(true);
          }}
          onBookAppointment={() => {
            playChime('confirm');
            // Enforce: User MUST create an account first before booking!
            if (store.patients.length === 0) {
              store.setIsNewPatientModalOpen(true);
            } else {
              navigateToView('client');
              store.setIsNewAppointmentModalOpen(true);
            }
          }}
          onOpenNursePortal={() => {
            handleOpenStaffWorkspace();
          }}
          onOpenSmsSimulator={() => {
            navigateToView('sms');
          }}
        />

        {/* Staff PIN Gate Modal */}
        <StaffPinModal
          isOpen={isStaffPinModalOpen}
          onClose={() => setIsStaffPinModalOpen(false)}
          onSuccess={handleStaffAuthSuccess}
        />

        {/* Patient / Family Registration Modal (Enforced Before Booking) */}
        <NewPatientModal
          isOpen={store.isNewPatientModalOpen}
          onClose={() => store.setIsNewPatientModalOpen(false)}
          onRegisterPatient={(data) => {
            store.registerRealPatient(data);
            navigateToView('client');
          }}
        />

        {/* New Appointment Modal */}
        <NewAppointmentModal
          isOpen={store.isNewAppointmentModalOpen}
          onClose={() => store.setIsNewAppointmentModalOpen(false)}
          patients={store.patients}
          activePatientId={store.activePatientId}
          onScheduleAppointment={store.scheduleRealAppointment}
        />
      </>
    );
  }

  // 2. PATIENT & FAMILY APP (CLIENT-SIDE EXPERIENCE)
  if (viewMode === 'client') {
    return (
      <>
        <ClientAppShell
          patients={store.patients}
          activePatient={store.activePatient}
          events={store.activeEvents}
          smsLog={store.smsLog}
          onSelectPatient={store.handleSelectPatient}
          onConfirmEvent={(id) => store.confirmAppointment(id, 'app')}
          onOpenEventSheet={store.setSelectedEventForSheet}
          onOpenNewPatientModal={() => store.setIsNewPatientModalOpen(true)}
          onOpenNewAppointmentModal={() => {
            if (store.patients.length === 0) {
              store.setIsNewPatientModalOpen(true);
            } else {
              store.setIsNewAppointmentModalOpen(true);
            }
          }}
          onBackToLanding={() => {
            navigateToView('landing');
          }}
          onOpenStaffGate={handleOpenStaffWorkspace}
        />

        {/* Staff PIN Gate Modal */}
        <StaffPinModal
          isOpen={isStaffPinModalOpen}
          onClose={() => setIsStaffPinModalOpen(false)}
          onSuccess={handleStaffAuthSuccess}
        />

        {/* Modals */}
        {store.selectedEventForSheet && store.activePatient && (
          <AppointmentSheet
            event={store.selectedEventForSheet}
            patient={store.activePatient}
            isOpen={!!store.selectedEventForSheet}
            onClose={() => store.setSelectedEventForSheet(null)}
            onConfirm={(eventId) => {
              store.confirmAppointment(eventId, 'app');
              store.setSelectedEventForSheet(null);
            }}
            onReschedule={(eventId, newDate) => {
              store.requestReschedule(eventId, newDate);
              store.setSelectedEventForSheet(null);
            }}
            onDispatchReminder={(eventId) => {
              store.dispatchManualReminder(eventId);
            }}
            onDeleteEvent={(eventId) => {
              store.deleteAppointment(eventId);
              store.setSelectedEventForSheet(null);
            }}
          />
        )}

        <NewPatientModal
          isOpen={store.isNewPatientModalOpen}
          onClose={() => store.setIsNewPatientModalOpen(false)}
          onRegisterPatient={store.registerRealPatient}
        />

        <NewAppointmentModal
          isOpen={store.isNewAppointmentModalOpen}
          onClose={() => store.setIsNewAppointmentModalOpen(false)}
          patients={store.patients}
          activePatientId={store.activePatientId}
          onScheduleAppointment={store.scheduleRealAppointment}
        />
      </>
    );
  }

  // 3. CLINICAL STAFF / HOSPITAL WORKSPACE (PORTAL, SMS SIMULATOR, AUDIT LOGS)
  return (
    <div className="flex flex-col min-h-screen w-full bg-surface-base antialiased">
      
      {/* Staff Header */}
      <header className="sticky top-0 z-40 bg-petrol-900 text-white px-3 sm:px-6 py-2.5 border-b-2 border-petrol-800 shadow-card pt-safe">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Identity & Return Controls */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigateToView('landing')}
              className="p-1.5 rounded-xl bg-petrol-800 hover:bg-petrol-750 text-peach-500 border border-petrol-700 transition-colors shrink-0"
              title="Return to Public Website"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black tracking-tight text-base sm:text-lg text-white truncate">
                  CarePath NG
                </span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-petrol-800 text-peach-500 border border-petrol-700 shrink-0">
                  Staff Workspace
                </span>
              </div>
              <p className="hidden xl:block text-[11px] text-petrol-200 font-bold leading-none mt-0.5 truncate">
                Garki Primary Healthcare Centre (FCT-04) • Nurse Blessing Aliyu
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs for Clinical Staff */}
          <nav className="hidden sm:flex items-center bg-petrol-950/80 rounded-xl p-1 border border-petrol-800 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => navigateToView('portal')}
              className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black transition-all ${
                viewMode === 'portal'
                  ? 'bg-peach-500 text-petrol-950 shadow-xs'
                  : 'text-petrol-200 hover:text-white'
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span>PHC Registry</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToView('sms')}
              className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black transition-all ${
                viewMode === 'sms'
                  ? 'bg-peach-500 text-petrol-950 shadow-xs'
                  : 'text-petrol-200 hover:text-white'
              }`}
            >
              <Smartphone className="h-4 w-4 shrink-0" />
              <span>SMS Gateway</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToView('logs')}
              className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black transition-all ${
                viewMode === 'logs'
                  ? 'bg-peach-500 text-petrol-950 shadow-xs'
                  : 'text-petrol-200 hover:text-white'
              }`}
            >
              <Activity className="h-4 w-4 shrink-0" />
              <span>NDPA Audit</span>
            </button>
          </nav>

          {/* Staff Lock / Return to Public Website */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsStaffAuthenticated(false);
                navigateToView('landing');
              }}
              className="px-3 py-1.5 rounded-xl bg-petrol-800 hover:bg-petrol-750 text-petrol-200 hover:text-white text-xs font-bold border border-petrol-700 flex items-center gap-1.5"
              title="Lock staff portal and return to public website"
            >
              <Lock className="h-3.5 w-3.5 text-peach-500" />
              <span className="hidden sm:inline">Lock Portal</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToView('landing')}
              className="p-1.5 rounded-xl bg-petrol-800 hover:bg-petrol-750 text-petrol-200 hover:text-white border border-petrol-700"
              title="Return to Public Website"
            >
              <Globe className="h-4 w-4 text-peach-500" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Staff Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 w-full flex-1 pb-28 md:pb-16">
        
        {viewMode === 'portal' && (
          <div className="w-full min-h-[calc(100vh-160px)]">
            <FacilityPortal
              events={store.events}
              patients={store.patients}
              onConfirm={(id) => store.confirmAppointment(id, 'app')}
              onReschedule={store.requestReschedule}
              onDispatchReminder={store.dispatchManualReminder}
              onMarkCompleted={store.markAdministeredAndCompleted}
              onDeleteEvent={store.deleteAppointment}
              onSelectPatient={(id) => {
                store.handleSelectPatient(id);
              }}
              onOpenNewPatientModal={() => store.setIsNewPatientModalOpen(true)}
              onOpenNewAppointmentModal={() => store.setIsNewAppointmentModalOpen(true)}
              onExportData={store.exportDataToJson}
            />
          </div>
        )}

        {viewMode === 'sms' && (
          <div className="max-w-3xl mx-auto min-h-[calc(100vh-160px)]">
            <SmsSimulator
              smsLog={store.smsLog}
              customPhone={store.customJudgePhone}
              onUpdatePhone={store.handleUpdateJudgePhone}
              onReplySms={handleSmsReply}
              onReset={() => {}}
            />
          </div>
        )}

        {viewMode === 'logs' && (
          <div className="max-w-4xl mx-auto min-h-[calc(100vh-160px)]">
            <LiveEventLog logs={store.auditLogs} />
          </div>
        )}

      </main>

      {/* Mobile Staff Bottom Navigation Dock (Native PWA Feel) */}
      <nav className="fixed sm:hidden bottom-0 inset-x-0 z-40 bg-petrol-900/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 safe-bottom shadow-2xl flex items-center justify-around text-white">
        <button
          type="button"
          onClick={() => navigateToView('portal')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl text-[11px] font-black transition-all ${
            viewMode === 'portal' ? 'text-peach-500 bg-white/10 shadow-xs' : 'text-petrol-200 hover:text-white'
          }`}
        >
          <Building2 className={`h-4.5 w-4.5 mb-0.5 ${viewMode === 'portal' ? 'text-peach-500 stroke-[2.5]' : 'stroke-2'}`} />
          <span>Registry</span>
        </button>

        <button
          type="button"
          onClick={() => navigateToView('sms')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl text-[11px] font-black transition-all ${
            viewMode === 'sms' ? 'text-peach-500 bg-white/10 shadow-xs' : 'text-petrol-200 hover:text-white'
          }`}
        >
          <Smartphone className={`h-4.5 w-4.5 mb-0.5 ${viewMode === 'sms' ? 'text-peach-500 stroke-[2.5]' : 'stroke-2'}`} />
          <span>SMS Gateway</span>
        </button>

        <button
          type="button"
          onClick={() => navigateToView('logs')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl text-[11px] font-black transition-all ${
            viewMode === 'logs' ? 'text-peach-500 bg-white/10 shadow-xs' : 'text-petrol-200 hover:text-white'
          }`}
        >
          <Activity className={`h-4.5 w-4.5 mb-0.5 ${viewMode === 'logs' ? 'text-peach-500 stroke-[2.5]' : 'stroke-2'}`} />
          <span>Audit</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsStaffAuthenticated(false);
            navigateToView('landing');
          }}
          className="flex flex-col items-center py-1.5 px-3 rounded-xl text-[11px] font-bold text-petrol-200 hover:text-white transition-all"
          title="Lock portal and return to public website"
        >
          <Lock className="h-4.5 w-4.5 mb-0.5 stroke-2 text-peach-500" />
          <span>Exit</span>
        </button>
      </nav>

      {/* Global Modals */}
      {store.selectedEventForSheet && store.activePatient && (
        <AppointmentSheet
          event={store.selectedEventForSheet}
          patient={store.activePatient}
          isOpen={!!store.selectedEventForSheet}
          onClose={() => store.setSelectedEventForSheet(null)}
          onConfirm={(eventId) => {
            store.confirmAppointment(eventId, 'app');
            store.setSelectedEventForSheet(null);
          }}
          onReschedule={(eventId, newDate) => {
            store.requestReschedule(eventId, newDate);
            store.setSelectedEventForSheet(null);
          }}
          onDispatchReminder={(eventId) => {
            store.dispatchManualReminder(eventId);
          }}
          onDeleteEvent={(eventId) => {
            store.deleteAppointment(eventId);
            store.setSelectedEventForSheet(null);
          }}
        />
      )}

      <NewPatientModal
        isOpen={store.isNewPatientModalOpen}
        onClose={() => store.setIsNewPatientModalOpen(false)}
        onRegisterPatient={store.registerRealPatient}
      />

      <NewAppointmentModal
        isOpen={store.isNewAppointmentModalOpen}
        onClose={() => store.setIsNewAppointmentModalOpen(false)}
        patients={store.patients}
        activePatientId={store.activePatientId}
        onScheduleAppointment={store.scheduleRealAppointment}
      />

      <StaffPinModal
        isOpen={isStaffPinModalOpen}
        onClose={() => setIsStaffPinModalOpen(false)}
        onSuccess={handleStaffAuthSuccess}
      />

    </div>
  );
}
