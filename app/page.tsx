'use client';

import React, { useState, useEffect } from 'react';
import { useCarePathStore } from '@/lib/store';
import { PatientCareView } from '@/components/PatientCareView';
import { AppointmentSheet } from '@/components/AppointmentSheet';
import { SmsSimulator } from '@/components/SmsSimulator';
import { FacilityPortal } from '@/components/FacilityPortal';
import { LiveEventLog } from '@/components/LiveEventLog';
import { 
  Building2, 
  Layers, 
  RotateCcw, 
  Activity, 
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

export default function CarePathPrototypeApp() {
  const store = useCarePathStore();
  const [activeDesktopTab, setActiveDesktopTab] = useState<'patient' | 'portal' | 'sms' | 'logs'>('patient');
  const [mobileInnerTab, setMobileInnerTab] = useState<'home' | 'timeline' | 'sms' | 'portal'>('home');

  if (!store.isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-base">
        <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
          <span className="h-2 w-2 rounded-full bg-teal-800 animate-ping" />
          <span>Loading CarePath NG Care Engine...</span>
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
    <div className="flex flex-col min-h-screen w-full bg-surface-base">
      {/* 1. RESPONSIVE TOP APP / DASHBOARD HEADER */}
      <header className="sticky top-0 z-40 bg-teal-950 text-white px-4 sm:px-6 py-2.5 border-b border-teal-900 shadow-subtle">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-800 text-cream-200 font-black text-sm border border-teal-700 shadow-xs">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-base sm:text-lg text-white">
                  CarePath NG
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-800 text-teal-200 border border-teal-700">
                  Prototype
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-teal-300/80 font-medium leading-none">
                Maternal & Child Healthcare Continuity Platform • Nigeria
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on mobile, mobile uses bottom bar) */}
          <nav className="hidden md:flex items-center bg-teal-900/90 rounded-xl p-1 border border-teal-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveDesktopTab('patient')}
              className={`btn-tactile flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeDesktopTab === 'patient'
                  ? 'bg-cream-200 text-teal-950 shadow-xs font-bold'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              <HeartHandshake className="h-4 w-4" />
              <span>Family Care Hub</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDesktopTab('portal')}
              className={`btn-tactile flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeDesktopTab === 'portal'
                  ? 'bg-cream-200 text-teal-950 shadow-xs font-bold'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>PHC Nurse Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDesktopTab('sms')}
              className={`btn-tactile flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeDesktopTab === 'sms'
                  ? 'bg-cream-200 text-teal-950 shadow-xs font-bold'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>SMS Gateway Simulator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDesktopTab('logs')}
              className={`btn-tactile flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeDesktopTab === 'logs'
                  ? 'bg-cream-200 text-teal-950 shadow-xs font-bold'
                  : 'text-teal-200 hover:text-white'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Transactional Outbox</span>
            </button>
          </nav>

          {/* Real-time Status Badge & Demo Reset */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-teal-900/70 px-2.5 py-1 rounded-lg border border-teal-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px]">Continuity Sync: Active</span>
            </div>

            <button
              type="button"
              onClick={() => {
                playChime('reminder');
                store.resetDemoData();
              }}
              title="Reset to fresh competition demo state"
              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-900 hover:bg-teal-800 text-teal-200 text-xs font-semibold border border-teal-800 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. RESPONSIVE WORKSPACE CONTAINER */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5">
        
        {/* MOBILE VIEW CONTROLLER (< md screens) */}
        <div className="block md:hidden">
          {mobileInnerTab === 'sms' ? (
            <div className="w-full max-w-lg mx-auto pb-16">
              <SmsSimulator
                smsLog={store.smsLog}
                customPhone={store.customJudgePhone}
                onUpdatePhone={store.handleUpdateJudgePhone}
                onReplySms={handleSmsReply}
                onReset={store.resetDemoData}
              />
            </div>
          ) : mobileInnerTab === 'portal' ? (
            <div className="w-full max-w-lg mx-auto pb-16">
              <FacilityPortal
                events={store.events}
                patients={store.patients}
                onConfirm={(id) => store.confirmAppointment(id, 'app')}
                onReschedule={store.requestReschedule}
                onDispatchReminder={store.dispatchManualReminder}
                onRegisterChild={store.registerNewChildPatient}
                onSelectPatient={(id) => {
                  store.handleSelectPatient(id);
                  setMobileInnerTab('home');
                }}
              />
            </div>
          ) : (
            <PatientCareView
              patients={store.patients}
              activePatient={store.activePatient}
              events={store.activeEvents}
              smsLog={store.smsLog}
              mobileTab={mobileInnerTab}
              onMobileTabChange={setMobileInnerTab}
              onSelectPatient={store.handleSelectPatient}
              onOpenEventSheet={store.setSelectedEventForSheet}
              onConfirmEvent={(id) => store.confirmAppointment(id, 'app')}
              onRescheduleEvent={store.requestReschedule}
              onReplySms={handleSmsReply}
              onDispatchReminder={store.dispatchManualReminder}
            />
          )}
        </div>

        {/* DESKTOP RESPONSIVE VIEW (>= md screens) */}
        <div className="hidden md:block">
          {activeDesktopTab === 'patient' && (
            <PatientCareView
              patients={store.patients}
              activePatient={store.activePatient}
              events={store.activeEvents}
              smsLog={store.smsLog}
              mobileTab="home"
              onMobileTabChange={setMobileInnerTab}
              onSelectPatient={store.handleSelectPatient}
              onOpenEventSheet={store.setSelectedEventForSheet}
              onConfirmEvent={(id) => store.confirmAppointment(id, 'app')}
              onRescheduleEvent={store.requestReschedule}
              onReplySms={handleSmsReply}
              onDispatchReminder={store.dispatchManualReminder}
            />
          )}

          {activeDesktopTab === 'portal' && (
            <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
              <FacilityPortal
                events={store.events}
                patients={store.patients}
                onConfirm={(id) => store.confirmAppointment(id, 'app')}
                onReschedule={store.requestReschedule}
                onDispatchReminder={store.dispatchManualReminder}
                onRegisterChild={store.registerNewChildPatient}
                onSelectPatient={(id) => {
                  store.handleSelectPatient(id);
                  setActiveDesktopTab('patient');
                }}
              />
            </div>
          )}

          {activeDesktopTab === 'sms' && (
            <div className="max-w-2xl mx-auto h-[calc(100vh-120px)]">
              <SmsSimulator
                smsLog={store.smsLog}
                customPhone={store.customJudgePhone}
                onUpdatePhone={store.handleUpdateJudgePhone}
                onReplySms={handleSmsReply}
                onReset={store.resetDemoData}
              />
            </div>
          )}

          {activeDesktopTab === 'logs' && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-120px)]">
              <LiveEventLog logs={store.auditLogs} />
            </div>
          )}
        </div>

      </main>

      {/* 3. APPOINTMENT DETAIL BOTTOM SHEET MODAL (Responsive on all screens) */}
      {store.selectedEventForSheet && (
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
        />
      )}
    </div>
  );
}
