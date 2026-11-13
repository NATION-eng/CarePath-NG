'use client';

import React, { useState, useEffect } from 'react';
import { useCarePathStore } from '@/lib/store';
import { MobileAppShell } from '@/components/MobileAppShell';
import { AppointmentSheet } from '@/components/AppointmentSheet';
import { SmsSimulator } from '@/components/SmsSimulator';
import { FacilityPortal } from '@/components/FacilityPortal';
import { LiveEventLog } from '@/components/LiveEventLog';
import { 
  Smartphone, 
  Building2, 
  Layers, 
  RotateCcw, 
  Activity, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Tv2
} from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

export default function CarePathPrototypeApp() {
  const store = useCarePathStore();
  const [viewMode, setViewMode] = useState<'dual' | 'mobile' | 'portal' | 'logs'>('dual');
  const [mobileInnerTab, setMobileInnerTab] = useState<'home' | 'timeline' | 'sms' | 'portal'>('home');

  // Detect if running on mobile screen initially
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewMode('mobile');
    }
  }, []);

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
      // Find the next scheduled event for the active patient
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
      // Freeform reply
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WAT';
      store.requestReschedule(store.activeEvents[0]?.id || '', 'Clinic Review Date');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-surface-base overflow-hidden">
      {/* Top Bar for Judges & Pitch Presenters */}
      <nav className="h-13 bg-teal-950 text-white px-3 sm:px-6 flex items-center justify-between border-b border-teal-900 shrink-0 z-40">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-800 text-cream-200 font-black text-sm border border-teal-700 shadow-xs">
            CP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-sm text-white">
                CarePath NG
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.2 rounded bg-teal-800 text-teal-200 border border-teal-700">
                Live Prototype
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-teal-300/80 font-medium leading-none">
              Maternal & Child Healthcare Continuity Platform • Nigeria
            </p>
          </div>
        </div>

        {/* View Mode Switcher for Desktop / Presentations */}
        <div className="hidden md:flex items-center bg-teal-900/90 rounded-xl p-1 border border-teal-800">
          <button
            type="button"
            onClick={() => setViewMode('dual')}
            className={`btn-tactile flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'dual'
                ? 'bg-cream-200 text-teal-950 shadow-xs font-bold'
                : 'text-teal-200 hover:text-white'
            }`}
          >
            <Tv2 className="h-3.5 w-3.5" />
            <span>Dual Pitch View (Live Loop)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`btn-tactile flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'mobile'
                ? 'bg-cream-200 text-teal-950 shadow-xs font-bold'
                : 'text-teal-200 hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Pure Mobile App</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('portal')}
            className={`btn-tactile flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'portal'
                ? 'bg-cream-200 text-teal-950 shadow-xs font-bold'
                : 'text-teal-200 hover:text-white'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>PHC Nurse Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('logs')}
            className={`btn-tactile flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'logs'
                ? 'bg-cream-200 text-teal-950 shadow-xs font-bold'
                : 'text-teal-200 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Audit Outbox</span>
          </button>
        </div>

        {/* Live sync badge & Reset button */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 bg-teal-900/60 px-2.5 py-1 rounded-lg border border-teal-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">Engine: Sync Active</span>
          </div>

          <button
            type="button"
            onClick={() => {
              playChime('reminder');
              store.resetDemoData();
            }}
            title="Reset to fresh competition demo state"
            className="btn-tactile flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-900 hover:bg-teal-800 text-teal-200 text-xs font-medium border border-teal-800 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-hidden p-2 sm:p-4">
        {/* VIEW 1: DUAL STAGE PITCH VIEW (3 Columns: Mobile App, SMS Simulator, Nurse Portal) */}
        {viewMode === 'dual' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full max-w-[1600px] mx-auto">
            {/* Left Column: Mobile App Frame (4 Cols) */}
            <div className="md:col-span-4 h-full flex flex-col items-center">
              <div className="w-full h-full max-w-sm rounded-3xl overflow-hidden shadow-float ring-1 ring-surface-border">
                <MobileAppShell
                  patients={store.patients}
                  activePatient={store.activePatient}
                  events={store.activeEvents}
                  activeTab={mobileInnerTab}
                  onTabChange={setMobileInnerTab}
                  onSelectPatient={store.handleSelectPatient}
                  onOpenEventSheet={store.setSelectedEventForSheet}
                  onConfirmEvent={store.confirmAppointment}
                  onRescheduleEvent={store.requestReschedule}
                />
              </div>
            </div>

            {/* Middle Column: SMS Simulator (4 Cols) */}
            <div className="md:col-span-4 h-full flex flex-col">
              <SmsSimulator
                smsLog={store.smsLog}
                customPhone={store.customJudgePhone}
                onUpdatePhone={store.handleUpdateJudgePhone}
                onReplySms={handleSmsReply}
                onReset={store.resetDemoData}
              />
            </div>

            {/* Right Column: Facility Nurse Portal (4 Cols) */}
            <div className="md:col-span-4 h-full flex flex-col">
              <FacilityPortal
                events={store.events}
                patients={store.patients}
                onConfirm={(id) => store.confirmAppointment(id, 'app')}
                onReschedule={store.requestReschedule}
                onDispatchReminder={store.dispatchManualReminder}
                onRegisterChild={store.registerNewChildPatient}
                onSelectPatient={(id) => {
                  store.handleSelectPatient(id);
                  setViewMode('dual');
                }}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: PURE MOBILE APP VIEW */}
        {viewMode === 'mobile' && (
          <div className="h-full flex items-center justify-center">
            {mobileInnerTab === 'sms' ? (
              <div className="h-full w-full max-w-md">
                <SmsSimulator
                  smsLog={store.smsLog}
                  customPhone={store.customJudgePhone}
                  onUpdatePhone={store.handleUpdateJudgePhone}
                  onReplySms={handleSmsReply}
                  onReset={store.resetDemoData}
                />
              </div>
            ) : mobileInnerTab === 'portal' ? (
              <div className="h-full w-full max-w-md">
                <FacilityPortal
                  events={store.events}
                  patients={store.patients}
                  onConfirm={(id) => store.confirmAppointment(id, 'app')}
                  onReschedule={store.requestReschedule}
                  onDispatchReminder={store.dispatchManualReminder}
                  onRegisterChild={store.registerNewChildPatient}
                  onSelectPatient={store.handleSelectPatient}
                />
              </div>
            ) : (
              <MobileAppShell
                patients={store.patients}
                activePatient={store.activePatient}
                events={store.activeEvents}
                activeTab={mobileInnerTab}
                onTabChange={setMobileInnerTab}
                onSelectPatient={store.handleSelectPatient}
                onOpenEventSheet={store.setSelectedEventForSheet}
                onConfirmEvent={store.confirmAppointment}
                onRescheduleEvent={store.requestReschedule}
              />
            )}
          </div>
        )}

        {/* VIEW 3: FULL FACILITY NURSE WORKSPACE */}
        {viewMode === 'portal' && (
          <div className="h-full max-w-5xl mx-auto">
            <FacilityPortal
              events={store.events}
              patients={store.patients}
              onConfirm={(id) => store.confirmAppointment(id, 'app')}
              onReschedule={store.requestReschedule}
              onDispatchReminder={store.dispatchManualReminder}
              onRegisterChild={store.registerNewChildPatient}
              onSelectPatient={(id) => {
                store.handleSelectPatient(id);
                setViewMode('mobile');
              }}
            />
          </div>
        )}

        {/* VIEW 4: AUDIT & TRANSACTIONAL OUTBOX LOGS */}
        {viewMode === 'logs' && (
          <div className="h-full max-w-4xl mx-auto">
            <LiveEventLog logs={store.auditLogs} />
          </div>
        )}
      </div>

      {/* Appointment Detail Bottom Sheet Modal */}
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
