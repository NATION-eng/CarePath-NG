'use client';

import React, { useState } from 'react';
import { useCarePathStore } from '@/lib/store';
import { PatientCareView } from '@/components/PatientCareView';
import { AppointmentSheet } from '@/components/AppointmentSheet';
import { SmsSimulator } from '@/components/SmsSimulator';
import { FacilityPortal } from '@/components/FacilityPortal';
import { LiveEventLog } from '@/components/LiveEventLog';
import { NewPatientModal } from '@/components/NewPatientModal';
import { NewAppointmentModal } from '@/components/NewAppointmentModal';
import { 
  Building2, 
  Activity, 
  Smartphone,
  HeartHandshake,
  UserPlus,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

type AppTab = 'patient' | 'portal' | 'sms' | 'logs';

export default function CarePathApp() {
  const store = useCarePathStore();
  const [activeTab, setActiveTab] = useState<AppTab>('patient');

  if (!store.isClient || store.isLoadingBackend) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-base px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-cream-200 font-black text-lg border-2 border-teal-700 animate-pulse shadow-card">
            CP
          </div>
          <div className="flex items-center gap-2 text-teal-950 font-black text-sm sm:text-base">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Connecting to CarePath Clinical Database...</span>
          </div>
          <p className="text-xs text-surface-dark/60 font-semibold">
            Initializing national continuity schedules & SMS engine
          </p>
        </div>
      </div>
    );
  }

  // Handle SMS Reply from simulator
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

  return (
    <div className="flex flex-col min-h-screen w-full bg-surface-base antialiased">
      {/* 1. UNIVERSAL RESPONSIVE NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-teal-950 text-white px-3 sm:px-6 py-2.5 border-b-2 border-teal-900 shadow-subtle">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-800 text-cream-200 font-black text-sm border-2 border-teal-700 shadow-xs shrink-0">
              CP
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black tracking-tight text-base sm:text-lg text-white truncate">
                  CarePath NG
                </span>
                <span className="hidden sm:inline-block text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-teal-800 text-teal-200 border border-teal-700 shrink-0">
                  Clinical v1.0
                </span>
              </div>
              <p className="hidden xl:block text-[11px] text-teal-300 font-bold leading-none mt-0.5 truncate">
                Maternal & Child Healthcare Continuity Platform • Nigeria
              </p>
            </div>
          </div>

          {/* Desktop & Tablet Navigation Tabs (>= md screens) */}
          <nav className="hidden md:flex items-center bg-teal-900/90 rounded-xl p-1 border border-teal-800 text-xs lg:text-sm">
            <button
              type="button"
              onClick={() => setActiveTab('patient')}
              className={`btn-tactile flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-1.5 rounded-lg font-black transition-all ${
                activeTab === 'patient'
                  ? 'bg-cream-200 text-teal-950 shadow-xs'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              <HeartHandshake className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">Family Care Hub</span>
              <span className="lg:hidden">Care Hub</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('portal')}
              className={`btn-tactile flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-1.5 rounded-lg font-black transition-all ${
                activeTab === 'portal'
                  ? 'bg-cream-200 text-teal-950 shadow-xs'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">PHC Nurse Portal</span>
              <span className="lg:hidden">PHC Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sms')}
              className={`btn-tactile flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-1.5 rounded-lg font-black transition-all ${
                activeTab === 'sms'
                  ? 'bg-cream-200 text-teal-950 shadow-xs'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              <Smartphone className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">SMS Gateway Feed</span>
              <span className="lg:hidden">SMS Feed</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`btn-tactile flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-1.5 rounded-lg font-black transition-all ${
                activeTab === 'logs'
                  ? 'bg-cream-200 text-teal-950 shadow-xs'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              <Activity className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">Audit Engine</span>
              <span className="lg:hidden">Audit</span>
            </button>
          </nav>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                playChime('reminder');
                store.setIsNewPatientModalOpen(true);
              }}
              className="btn-tactile flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-teal-950 text-xs sm:text-sm font-black shadow-xs transition-colors shrink-0"
            >
              <UserPlus className="h-4 w-4 text-teal-950 shrink-0" />
              <span className="hidden sm:inline">+ Register Patient</span>
              <span className="sm:hidden">+ Patient</span>
            </button>

            <button
              type="button"
              onClick={store.exportDataToJson}
              title="Export all clinical records from database"
              className="btn-tactile flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-900 hover:bg-teal-800 text-teal-200 text-xs sm:text-sm font-black border border-teal-800 transition-colors shadow-xs shrink-0"
            >
              <Download className="h-4 w-4 shrink-0" />
              <span className="hidden xl:inline">Export</span>
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE TOP TAB BAR (< md screens) */}
      <div className="md:hidden sticky top-[53px] z-30 bg-teal-900 border-b border-teal-800 px-2 py-1.5 flex items-center justify-around text-xs font-black gap-1 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('patient')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            activeTab === 'patient'
              ? 'bg-cream-200 text-teal-950 shadow-xs'
              : 'text-teal-200 hover:text-white'
          }`}
        >
          <HeartHandshake className="h-3.5 w-3.5" />
          <span>Care Hub</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('portal')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            activeTab === 'portal'
              ? 'bg-cream-200 text-teal-950 shadow-xs'
              : 'text-teal-200 hover:text-white'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Portal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sms')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            activeTab === 'sms'
              ? 'bg-cream-200 text-teal-950 shadow-xs'
              : 'text-teal-200 hover:text-white'
          }`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>SMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            activeTab === 'logs'
              ? 'bg-cream-200 text-teal-950 shadow-xs'
              : 'text-teal-200 hover:text-white'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Audit</span>
        </button>
      </div>

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5 max-w-7xl mx-auto pb-24 md:pb-8">
        
        {/* CARE HUB VIEW */}
        {activeTab === 'patient' && (
          <div className="w-full">
            <PatientCareView
              patients={store.patients}
              activePatient={store.activePatient}
              events={store.activeEvents}
              smsLog={store.smsLog}
              mobileTab="home"
              onMobileTabChange={() => {}}
              onSelectPatient={store.handleSelectPatient}
              onOpenEventSheet={store.setSelectedEventForSheet}
              onConfirmEvent={(id) => store.confirmAppointment(id, 'app')}
              onRescheduleEvent={store.requestReschedule}
              onReplySms={handleSmsReply}
              onDispatchReminder={store.dispatchManualReminder}
              onOpenNewPatientModal={() => store.setIsNewPatientModalOpen(true)}
              onOpenNewAppointmentModal={() => store.setIsNewAppointmentModalOpen(true)}
              onDeletePatient={store.deletePatient}
              onDeleteEvent={store.deleteAppointment}
            />
          </div>
        )}

        {/* PHC NURSE PORTAL VIEW */}
        {activeTab === 'portal' && (
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
                setActiveTab('patient');
              }}
              onOpenNewPatientModal={() => store.setIsNewPatientModalOpen(true)}
              onOpenNewAppointmentModal={() => store.setIsNewAppointmentModalOpen(true)}
              onExportData={store.exportDataToJson}
            />
          </div>
        )}

        {/* SMS TELEPHONY FEED VIEW */}
        {activeTab === 'sms' && (
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

        {/* DATABASE AUDIT LOGS VIEW */}
        {activeTab === 'logs' && (
          <div className="max-w-4xl mx-auto min-h-[calc(100vh-160px)]">
            <LiveEventLog logs={store.auditLogs} />
          </div>
        )}

      </main>

      {/* 3. UNIVERSAL FIXED BOTTOM THUMB NAVIGATION (MOBILE ONLY: ALWAYS VISIBLE ON ALL PAGES) */}
      <nav className="fixed md:hidden bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t-2 border-surface-border px-3 py-2 flex items-center justify-around safe-bottom z-40 shadow-subtle">
        <button
          type="button"
          onClick={() => {
            setActiveTab('patient');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-black transition-colors ${
            activeTab === 'patient' ? 'text-teal-900 font-black' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <HeartHandshake className={`h-5 w-5 mb-0.5 ${activeTab === 'patient' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Care Hub</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('portal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-black transition-colors ${
            activeTab === 'portal' ? 'text-teal-900 font-black' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Building2 className={`h-5 w-5 mb-0.5 ${activeTab === 'portal' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>PHC Portal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('sms');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-black transition-colors ${
            activeTab === 'sms' ? 'text-teal-900 font-black' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Smartphone className={`h-5 w-5 mb-0.5 ${activeTab === 'sms' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>SMS Feed</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('logs');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-black transition-colors ${
            activeTab === 'logs' ? 'text-teal-900 font-black' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Activity className={`h-5 w-5 mb-0.5 ${activeTab === 'logs' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Audit Log</span>
        </button>
      </nav>

      {/* 4. APPOINTMENT DETAIL BOTTOM SHEET MODAL */}
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

      {/* 5. REAL PATIENT REGISTRATION MODAL */}
      <NewPatientModal
        isOpen={store.isNewPatientModalOpen}
        onClose={() => store.setIsNewPatientModalOpen(false)}
        onRegisterPatient={store.registerRealPatient}
      />

      {/* 6. REAL APPOINTMENT BOOKING MODAL */}
      <NewAppointmentModal
        isOpen={store.isNewAppointmentModalOpen}
        onClose={() => store.setIsNewAppointmentModalOpen(false)}
        patients={store.patients}
        activePatientId={store.activePatientId}
        onScheduleAppointment={store.scheduleRealAppointment}
      />
    </div>
  );
}
