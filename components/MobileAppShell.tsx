'use client';

import React, { useState } from 'react';
import { PatientProfile, CareEvent } from '@/lib/types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Volume2, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  FileText, 
  PhoneCall, 
  Bell, 
  Home, 
  Layers, 
  Smartphone, 
  Building2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { AudioVoicePlayer } from './AudioVoicePlayer';
import { playChime } from '@/lib/audioVoice';

interface MobileAppShellProps {
  patients: PatientProfile[];
  activePatient: PatientProfile;
  events: CareEvent[];
  activeTab: 'home' | 'timeline' | 'sms' | 'portal';
  onTabChange: (tab: 'home' | 'timeline' | 'sms' | 'portal') => void;
  onSelectPatient: (patientId: string) => void;
  onOpenEventSheet: (event: CareEvent) => void;
  onConfirmEvent: (eventId: string) => void;
  onRescheduleEvent: (eventId: string, newDate: string) => void;
}

export function MobileAppShell({
  patients,
  activePatient,
  events,
  activeTab,
  onTabChange,
  onSelectPatient,
  onOpenEventSheet,
  onConfirmEvent,
}: MobileAppShellProps) {
  const [timelineTab, setTimelineTab] = useState<'upcoming' | 'all'>('upcoming');

  // Next active upcoming appointment
  const nextEvent = events.find((e) => e.status === 'scheduled' || e.status === 'confirmed') || events[0];
  const isConfirmed = nextEvent?.status === 'confirmed';

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-surface-base border-x border-surface-border shadow-float overflow-hidden relative select-none">
      {/* Native App Top Header */}
      <header className="sticky top-0 z-30 bg-teal-900 text-white px-4 pt-3 pb-3 border-b border-teal-800 shadow-subtle">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-800 border border-teal-700 text-white font-bold text-xs">
              CP
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-none">
                CarePath NG
              </span>
              <span className="text-[10px] text-teal-200/80 font-medium">
                Garki Primary Healthcare Network
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-800 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-teal-100 font-medium">Ada&apos;s Family Hub</span>
          </div>
        </div>

        {/* Profile Switcher Pills (Ada vs Baby Chinedu vs Mama Nkechi) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-0.5">
          {patients.map((pat) => {
            const isSelected = pat.id === activePatient.id;
            return (
              <button
                key={pat.id}
                type="button"
                onClick={() => {
                  playChime('reminder');
                  onSelectPatient(pat.id);
                }}
                className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cream-200 text-teal-950 shadow-xs ring-1 ring-white/40 font-bold'
                    : 'bg-teal-800/80 text-teal-100 hover:bg-teal-800'
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-900 text-[9px] text-cream-200">
                  {pat.avatarInitials}
                </span>
                <span>{pat.name}</span>
                {pat.relationship === 'child' && (
                  <span className="text-[9px] bg-teal-900/40 text-teal-950 px-1 rounded font-normal">
                    Proxy
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Scrollable Viewport */}
      <main className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 pb-20 safe-bottom">
        {/* Active Patient Identity Banner */}
        <div className="rounded-xl border border-surface-border bg-white p-3 flex items-center justify-between shadow-subtle">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-teal-950">{activePatient.name}</span>
              <span className="text-[10px] text-surface-dark/50 font-mono">({activePatient.code})</span>
            </div>
            <p className="text-[11px] text-teal-800 font-medium mt-0.5">
              {activePatient.categoryLabel} • <strong className="text-surface-dark">{activePatient.stageInfo}</strong>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 block mb-0.5">
              ● NPHCDA Active
            </span>
            <span className="text-[10px] text-surface-dark/50">
              {activePatient.phoneOwnedByPatient ? 'Personal Phone' : 'Caregiver Proxy'}
            </span>
          </div>
        </div>

        {activeTab === 'home' && (
          <>
            {/* HERO CARD: Next Appointment Milestone */}
            {nextEvent && (
              <div className="rounded-2xl bg-teal-900 text-white p-4 shadow-float relative overflow-hidden border border-teal-800">
                {/* Subtle reassurance ribbon */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase bg-teal-800 text-teal-200 px-2.5 py-0.5 rounded-md border border-teal-700/60">
                    {nextEvent.duePeriod}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      isConfirmed
                        ? 'bg-emerald-400 text-emerald-950'
                        : 'bg-amber-400 text-amber-950 animate-pulse'
                    }`}
                  >
                    {isConfirmed ? '✓ Attendance Confirmed' : '● Due: Action Needed'}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white leading-tight mb-1">
                  {nextEvent.title}
                </h3>
                <p className="text-xs text-teal-100/90 font-medium mb-3">
                  {nextEvent.subtitle}
                </p>

                {/* Date & Location Pill Grid */}
                <div className="grid grid-cols-2 gap-2 bg-teal-950/60 p-2.5 rounded-xl border border-teal-800/80 mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cream-200 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-[12px]">{nextEvent.date}</p>
                      <p className="text-[11px] text-teal-200">{nextEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-l border-teal-800 pl-2">
                    <MapPin className="h-4 w-4 text-cream-200 shrink-0" />
                    <div>
                      <p className="font-bold text-white truncate text-[12px]">{nextEvent.facilityName}</p>
                      <p className="text-[10px] text-teal-200 truncate">Area 10, Abuja</p>
                    </div>
                  </div>
                </div>

                {/* Spoken Voice Note Preview */}
                <div className="mb-3">
                  <AudioVoicePlayer
                    pidginText={nextEvent.pidginAudioText}
                    englishText={nextEvent.englishAudioText}
                    label="Listen to Clinic Voice Note"
                    compact
                  />
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {!isConfirmed ? (
                    <button
                      type="button"
                      onClick={() => onConfirmEvent(nextEvent.id)}
                      className="btn-tactile flex items-center justify-center gap-1.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-teal-950 py-2.5 px-3 font-bold text-xs shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-teal-900" />
                      <span>Confirm (I Will Go)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-teal-950 py-2.5 px-3 font-bold text-xs"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Attendance Confirmed</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenEventSheet(nextEvent)}
                    className="btn-tactile flex items-center justify-center gap-1 rounded-xl bg-teal-800 hover:bg-teal-700 text-white py-2.5 px-3 font-semibold text-xs border border-teal-700 transition-colors"
                  >
                    <span>View Instructions</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Care Actions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-950">
                  Quick Actions
                </span>
                <span className="text-[11px] text-teal-800 font-medium">Garki Ward</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  onClick={() => nextEvent && onOpenEventSheet(nextEvent)}
                  className="btn-tactile card-clinical p-3 rounded-xl cursor-pointer hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <FileText className="h-4 w-4 text-teal-800" />
                    <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-1.5 py-0.2 rounded">
                      Official
                    </span>
                  </div>
                  <p className="font-bold text-surface-dark text-xs">
                    {activePatient.category === 'immunisation' ? 'Child Yellow Card' : 'Maternal ANC Card'}
                  </p>
                  <p className="text-[10px] text-surface-dark/60 mt-0.5">
                    View official registered antigens & records
                  </p>
                </div>

                <div 
                  onClick={() => onTabChange('sms')}
                  className="btn-tactile card-clinical p-3 rounded-xl cursor-pointer hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Smartphone className="h-4 w-4 text-teal-800" />
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                      Active
                    </span>
                  </div>
                  <p className="font-bold text-surface-dark text-xs">SMS Notification Log</p>
                  <p className="text-[10px] text-surface-dark/60 mt-0.5">
                    Discreet SMS delivery to {activePatient.notificationContact.name.split(' ')[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Milestone Schedule List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-950">
                  Care Pathway Milestones
                </span>
                <button
                  type="button"
                  onClick={() => onTabChange('timeline')}
                  className="text-[11px] font-semibold text-teal-800 hover:underline"
                >
                  See Full Timeline
                </button>
              </div>

              <div className="space-y-2">
                {events.slice(0, 3).map((ev) => {
                  const isDone = ev.status === 'completed';
                  const isCurrent = ev.status === 'scheduled' || ev.status === 'confirmed';

                  return (
                    <div
                      key={ev.id}
                      onClick={() => onOpenEventSheet(ev)}
                      className={`btn-tactile flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isDone
                          ? 'bg-surface-base border-surface-border text-surface-dark/70'
                          : isCurrent
                          ? 'bg-white border-teal-600/40 shadow-xs'
                          : 'bg-white border-surface-border'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCurrent
                              ? 'bg-teal-800 text-white'
                              : 'bg-surface-muted text-surface-dark/60'
                          }`}
                        >
                          {isDone ? '✓' : '●'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-surface-dark">{ev.title}</p>
                          <p className="text-[10px] text-surface-dark/60">
                            {ev.date} • {ev.facilityName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-teal-800 font-semibold text-xs">
                        <span className="text-[11px]">
                          {isDone ? 'Done' : ev.status === 'confirmed' ? 'Confirmed' : 'View'}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-surface-dark/40" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* FULL TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-teal-950">Care Journey Protocol</h3>
                <p className="text-xs text-surface-dark/60">
                  {activePatient.category === 'immunisation' ? 'NPHCDA 2024 Infant Schedule' : 'Federal ANC Timeline'}
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cream-200 text-teal-900">
                DAG Managed
              </span>
            </div>

            <div className="relative pl-6 space-y-4 border-l-2 border-teal-800/20 ml-2 py-1">
              {events.map((ev, index) => {
                const isDone = ev.status === 'completed';
                const isConfirmed = ev.status === 'confirmed';

                return (
                  <div key={ev.id} className="relative group">
                    {/* Timeline Node Icon */}
                    <div
                      className={`absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                        isDone
                          ? 'bg-emerald-600 border-white text-white shadow-xs'
                          : isConfirmed
                          ? 'bg-emerald-500 border-teal-800 text-white'
                          : 'bg-white border-teal-700 text-teal-900'
                      }`}
                    >
                      {isDone ? '✓' : index + 1}
                    </div>

                    {/* Milestone Card */}
                    <div
                      onClick={() => onOpenEventSheet(ev)}
                      className="card-clinical p-3.5 rounded-xl cursor-pointer hover:border-teal-400 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                          {ev.duePeriod}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : isConfirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isDone ? 'Completed' : isConfirmed ? 'Confirmed' : 'Scheduled'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-surface-dark mb-0.5">{ev.title}</h4>
                      <p className="text-[11px] text-surface-dark/70 mb-2">{ev.subtitle}</p>

                      <div className="flex items-center justify-between text-[11px] text-surface-dark/60 pt-2 border-t border-surface-border">
                        <span>{ev.date} at {ev.time}</span>
                        <span className="text-teal-800 font-medium">Details & Audio →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* FIXED BOTTOM THUMB NAVIGATION BAR */}
      <nav className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-surface-border px-3 py-1.5 flex items-center justify-around safe-bottom z-30 shadow-subtle">
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'home' ? 'text-teal-800 font-bold' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Home className={`h-4 w-4 mb-0.5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('timeline')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'timeline' ? 'text-teal-800 font-bold' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Layers className={`h-4 w-4 mb-0.5 ${activeTab === 'timeline' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>My Care</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('sms')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'sms' ? 'text-teal-800 font-bold' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Smartphone className={`h-4 w-4 mb-0.5 ${activeTab === 'sms' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>SMS Feed</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('portal')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'portal' ? 'text-teal-800 font-bold' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Building2 className={`h-4 w-4 mb-0.5 ${activeTab === 'portal' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>PHC Portal</span>
        </button>
      </nav>
    </div>
  );
}
