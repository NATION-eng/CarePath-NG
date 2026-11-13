'use client';

import React, { useState } from 'react';
import { PatientProfile, CareEvent, SmsMessage } from '@/lib/types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  FileText, 
  PhoneForwarded, 
  Home, 
  Layers, 
  Smartphone, 
  Building2,
  Radio,
  CheckCheck
} from 'lucide-react';
import { AudioVoicePlayer } from './AudioVoicePlayer';
import { playChime } from '@/lib/audioVoice';

interface PatientCareViewProps {
  patients: PatientProfile[];
  activePatient: PatientProfile;
  events: CareEvent[];
  smsLog: SmsMessage[];
  mobileTab: 'home' | 'timeline' | 'sms' | 'portal';
  onMobileTabChange: (tab: 'home' | 'timeline' | 'sms' | 'portal') => void;
  onSelectPatient: (patientId: string) => void;
  onOpenEventSheet: (event: CareEvent) => void;
  onConfirmEvent: (eventId: string) => void;
  onRescheduleEvent: (eventId: string, newDate: string) => void;
  onReplySms: (replyText: string) => void;
  onDispatchReminder: (eventId: string) => void;
}

export function PatientCareView({
  patients,
  activePatient,
  events,
  smsLog,
  mobileTab,
  onMobileTabChange,
  onSelectPatient,
  onOpenEventSheet,
  onConfirmEvent,
  onReplySms,
  onDispatchReminder,
}: PatientCareViewProps) {
  const [selectedTimelineFilter, setSelectedTimelineFilter] = useState<'all' | 'upcoming'>('all');

  // Next active upcoming appointment
  const nextEvent = events.find((e) => e.status === 'scheduled' || e.status === 'confirmed') || events[0];
  const isConfirmed = nextEvent?.status === 'confirmed';

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col min-h-full pb-20 md:pb-8">
      {/* 1. TOP RESPONSIVE PROFILE BANNER & SWITCHER */}
      <div className="bg-white rounded-2xl border-2 border-surface-border p-5 sm:p-6 shadow-subtle mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded-md border border-teal-300">
                {activePatient.categoryLabel}
              </span>
              <span className="text-xs sm:text-sm text-surface-dark/70 font-mono font-bold">
                ID: {activePatient.code}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-teal-950 tracking-tight">
              {activePatient.name}
            </h1>
            <p className="text-sm sm:text-base text-surface-dark/85 font-semibold mt-1">
              Current Stage: <strong className="text-teal-900 font-extrabold">{activePatient.stageInfo}</strong> • Registered at <strong className="text-surface-dark font-extrabold">Garki Primary Health Centre</strong>
            </p>
          </div>

          {/* Profile Switcher Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <span className="text-xs font-black text-surface-dark/70 uppercase tracking-wider hidden lg:inline-block">
              Switch Managed Profile:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
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
                    className={`btn-tactile flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-2 ${
                      isSelected
                        ? 'bg-teal-800 text-white border-teal-800 shadow-card ring-2 ring-teal-700/30'
                        : 'bg-surface-base text-surface-dark border-surface-border hover:bg-surface-muted hover:border-teal-400'
                    }`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
                      isSelected ? 'bg-teal-950 text-cream-200' : 'bg-teal-200 text-teal-950'
                    }`}>
                      {pat.avatarInitials}
                    </span>
                    <span>{pat.name}</span>
                    {pat.relationship === 'child' && (
                      <span className={`text-[11px] px-1.5 py-0.5 rounded font-black ${
                        isSelected ? 'bg-teal-900 text-teal-100' : 'bg-cream-200 text-teal-950 border border-teal-900/10'
                      }`}>
                        Proxy
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN RESPONSIVE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT / MAIN COLUMN (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* HERO CARD: NEXT SCHEDULED CLINIC EVENT */}
          {nextEvent && (
            <div className="rounded-3xl bg-teal-900 text-white p-6 sm:p-7 shadow-float border-2 border-teal-700/80 relative overflow-hidden">
              {/* Top Status & Milestone Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-teal-800 text-cream-200 px-3.5 py-1 rounded-lg border border-teal-600">
                  {nextEvent.duePeriod}
                </span>
                <span
                  className={`text-xs sm:text-sm font-black px-3.5 py-1 rounded-full ${
                    isConfirmed
                      ? 'bg-emerald-400 text-emerald-950 shadow-xs'
                      : 'bg-amber-400 text-amber-950 animate-pulse'
                  }`}
                >
                  {isConfirmed ? '✓ Attendance Confirmed' : '● Due: Action Required'}
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1.5 tracking-tight">
                {nextEvent.title}
              </h2>
              <p className="text-sm sm:text-base text-teal-100 font-bold mb-5">
                {nextEvent.subtitle}
              </p>

              {/* Date, Time, Location & Clinician Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-teal-950/80 p-4 rounded-2xl border border-teal-700/60 mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800/80 text-cream-200 shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-300 uppercase tracking-wider">Date & Time</p>
                    <p className="font-black text-white text-base leading-tight">{nextEvent.date}</p>
                    <p className="text-xs font-extrabold text-teal-200">{nextEvent.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:border-l border-teal-800 sm:pl-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800/80 text-cream-200 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-300 uppercase tracking-wider">Facility</p>
                    <p className="font-black text-white text-base truncate leading-tight">{nextEvent.facilityName}</p>
                    <p className="text-xs font-bold text-teal-200 truncate">Area 10, Garki, Abuja</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:border-l border-teal-800 sm:pl-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800/80 text-emerald-300 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-300 uppercase tracking-wider">Clinical Officer</p>
                    <p className="font-black text-white text-base truncate leading-tight">{nextEvent.clinicianName}</p>
                    <p className="text-xs font-bold text-teal-200 truncate">{nextEvent.clinicianRole}</p>
                  </div>
                </div>
              </div>

              {/* Spoken Voice Note Preview */}
              <div className="mb-5">
                <AudioVoicePlayer
                  pidginText={nextEvent.pidginAudioText}
                  englishText={nextEvent.englishAudioText}
                  label="Listen to Clinic Voice Reminder"
                />
              </div>

              {/* Preparation Checklist */}
              <div className="bg-teal-950/60 rounded-2xl p-4 mb-5 border border-teal-800">
                <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-teal-200 mb-2.5">
                  What to Bring & Preparation Checklist:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-white font-semibold">
                  {nextEvent.instructions.map((ins, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-teal-900/80 p-2.5 rounded-xl border border-teal-700/60">
                      <CheckCircle2 className="h-4 w-4 text-cream-200 shrink-0 mt-0.5" />
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                {!isConfirmed ? (
                  <button
                    type="button"
                    onClick={() => onConfirmEvent(nextEvent.id)}
                    className="btn-tactile flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-teal-950 py-3.5 px-6 font-black text-sm sm:text-base shadow-card transition-colors"
                  >
                    <CheckCircle2 className="h-5 w-5 text-teal-900" />
                    <span>Confirm Attendance (I Will Go)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-teal-950 py-3.5 px-6 font-black text-sm sm:text-base shadow-card cursor-default"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Attendance Confirmed ✓</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenEventSheet(nextEvent)}
                  className="btn-tactile flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white py-3.5 px-5 font-extrabold text-sm sm:text-base border border-teal-600 transition-colors"
                >
                  <span>Full Instructions & Reschedule</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* CARE PATHWAY MILESTONES */}
          <div className="bg-white rounded-2xl border-2 border-surface-border p-5 sm:p-6 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-teal-950">
                  {activePatient.category === 'immunisation' ? 'National Immunisation Schedule (NPHCDA 2024)' : 'Federal Maternal ANC Pathway'}
                </h3>
                <p className="text-xs sm:text-sm text-surface-dark/70 font-bold">
                  Sequential clinical milestones with interval protection
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-surface-base p-1 rounded-xl border border-surface-border text-xs sm:text-sm font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedTimelineFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedTimelineFilter === 'all'
                      ? 'bg-teal-800 text-white font-extrabold shadow-xs'
                      : 'text-surface-dark/70 hover:text-teal-950'
                  }`}
                >
                  All Milestones
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTimelineFilter('upcoming')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedTimelineFilter === 'upcoming'
                      ? 'bg-teal-800 text-white font-extrabold shadow-xs'
                      : 'text-surface-dark/70 hover:text-teal-950'
                  }`}
                >
                  Upcoming Only
                </button>
              </div>
            </div>

            {/* Milestones Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {events
                .filter((ev) => selectedTimelineFilter === 'all' || ev.status !== 'completed')
                .map((ev) => {
                  const isDone = ev.status === 'completed';
                  const isConfirmed = ev.status === 'confirmed';
                  const isCurrent = ev.id === nextEvent?.id;

                  return (
                    <div
                      key={ev.id}
                      onClick={() => onOpenEventSheet(ev)}
                      className={`btn-tactile p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-cream-50/80 border-teal-700/50 shadow-xs'
                          : isDone
                          ? 'bg-surface-base border-surface-border opacity-80'
                          : 'bg-white border-surface-border hover:border-teal-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2.5">
                          <span className="text-xs font-black uppercase tracking-wider text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded-md border border-teal-200">
                            {ev.duePeriod}
                          </span>
                          <span
                            className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : isConfirmed
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {isDone ? '✓ Completed' : isConfirmed ? '● Confirmed' : '○ Scheduled'}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-black text-surface-dark leading-snug mb-1">
                          {ev.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-surface-dark/80 font-semibold mb-3.5 line-clamp-1">
                          {ev.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs sm:text-sm text-surface-dark/70 pt-3 border-t border-surface-border font-bold">
                        <span>{ev.date} • {ev.time}</span>
                        <span className="text-teal-800 font-extrabold flex items-center gap-0.5">
                          View Details <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* RIGHT / SIDEBAR COMPANION COLUMN (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. OFFICIAL HEALTH CARD / YELLOW CARD SUMMARY */}
          <div className="bg-white rounded-2xl border-2 border-surface-border p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-800" />
                <h3 className="text-base font-black text-teal-950">
                  {activePatient.category === 'immunisation' ? 'Digital Child Yellow Card' : 'Official Maternal ANC Card'}
                </h3>
              </div>
              <span className="text-xs font-black bg-cream-200 text-teal-950 px-2.5 py-0.5 rounded border border-teal-900/10">
                Verified
              </span>
            </div>

            <div className="bg-surface-base rounded-xl p-3.5 border border-surface-border text-xs sm:text-sm space-y-2.5 mb-3.5">
              <div className="flex justify-between border-b border-surface-border pb-1.5">
                <span className="text-surface-dark/70 font-semibold">Registered Name:</span>
                <span className="font-black text-teal-950">{activePatient.name}</span>
              </div>
              <div className="flex justify-between border-b border-surface-border pb-1.5">
                <span className="text-surface-dark/70 font-semibold">National Record #:</span>
                <span className="font-mono font-black text-teal-900">{activePatient.code}</span>
              </div>
              <div className="flex justify-between border-b border-surface-border pb-1.5">
                <span className="text-surface-dark/70 font-semibold">Primary Centre:</span>
                <span className="font-bold text-surface-dark">Garki PHC (FCT-04)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-dark/70 font-semibold">Proxy Guardian:</span>
                <span className="font-extrabold text-teal-800">{activePatient.notificationContact.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-surface-dark/70 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Complies with Federal Child Health Registry & NDPA 2023.</span>
            </div>
          </div>

          {/* 2. LIVE TELEPHONY COMPANION WIDGET */}
          <div className="bg-white rounded-2xl border-2 border-surface-border shadow-subtle overflow-hidden">
            <div className="bg-teal-950 text-white px-4 py-3 flex items-center justify-between text-xs sm:text-sm border-b border-teal-900">
              <div className="flex items-center gap-2 font-black">
                <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>Live SMS Telephony Feed</span>
              </div>
              <span className="text-xs text-teal-300 font-bold">MTN Whitelisted</span>
            </div>

            <div className="p-4 bg-surface-base space-y-3 max-h-[320px] overflow-y-auto">
              {smsLog.slice(0, 2).map((sms) => (
                <div key={sms.id} className="rounded-xl bg-white border border-surface-border p-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-surface-dark/60 mb-1.5 font-bold">
                    <span className="font-black text-teal-900">{sms.sender}</span>
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <CheckCheck className="h-3.5 w-3.5" /> Delivered
                    </span>
                  </div>
                  <p className="text-surface-dark font-semibold leading-relaxed text-xs sm:text-sm">{sms.messageText}</p>
                </div>
              ))}
            </div>

            {/* Quick SMS interactive buttons on desktop */}
            <div className="p-3.5 bg-white border-t border-surface-border">
              <div className="text-xs font-black text-surface-dark/70 uppercase tracking-wider mb-2">
                Quick Stage Test:
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onReplySms('1')}
                  className="btn-tactile flex-1 rounded-xl border-2 border-emerald-300 bg-emerald-50 py-2.5 px-3 text-xs sm:text-sm font-black text-emerald-950 hover:bg-emerald-100 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Reply &ldquo;1&rdquo;</span>
                  <span className="text-xs font-bold text-emerald-800">(Confirm)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onReplySms('2')}
                  className="btn-tactile flex-1 rounded-xl border-2 border-amber-300 bg-amber-50 py-2.5 px-3 text-xs sm:text-sm font-black text-amber-950 hover:bg-amber-100 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Reply &ldquo;2&rdquo;</span>
                  <span className="text-xs font-bold text-amber-800">(Reschedule)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. PROXY NOTIFICATION ARCHITECTURE NOTE */}
          <div className="rounded-2xl border-2 border-teal-900/20 bg-teal-950 text-white p-4 sm:p-5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-black text-cream-200 text-sm sm:text-base mb-2">
              <PhoneForwarded className="h-5 w-5 text-teal-400" />
              <span>Independent Proxy Architecture</span>
            </div>
            <p className="text-white/90 leading-relaxed text-xs sm:text-sm font-medium mb-2.5">
              In Nigerian care journeys, account owners frequently coordinate for multiple dependents without phones.
            </p>
            <div className="bg-teal-900/70 p-3 rounded-xl border border-teal-800 text-xs sm:text-sm font-semibold space-y-1.5">
              <p>• <strong>Patient</strong>: {activePatient.name} (Phone-less profile)</p>
              <p>• <strong>Account Owner</strong>: Ada Eze (Signed in)</p>
              <p>• <strong>SMS Recipient</strong>: {activePatient.notificationContact.name} ({activePatient.notificationContact.phone})</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. FIXED BOTTOM THUMB NAVIGATION (MOBILE ONLY) */}
      <nav className="fixed md:hidden bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t-2 border-surface-border px-4 py-2 flex items-center justify-around safe-bottom z-30 shadow-subtle">
        <button
          type="button"
          onClick={() => onMobileTabChange('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-black transition-colors ${
            mobileTab === 'home' ? 'text-teal-900' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Home className={`h-5 w-5 mb-0.5 ${mobileTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Care Hub</span>
        </button>

        <button
          type="button"
          onClick={() => onMobileTabChange('timeline')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-black transition-colors ${
            mobileTab === 'timeline' ? 'text-teal-900' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Layers className={`h-5 w-5 mb-0.5 ${mobileTab === 'timeline' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Timeline</span>
        </button>

        <button
          type="button"
          onClick={() => onMobileTabChange('sms')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-black transition-colors ${
            mobileTab === 'sms' ? 'text-teal-900' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Smartphone className={`h-5 w-5 mb-0.5 ${mobileTab === 'sms' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>SMS Feed</span>
        </button>

        <button
          type="button"
          onClick={() => onMobileTabChange('portal')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-black transition-colors ${
            mobileTab === 'portal' ? 'text-teal-900' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Building2 className={`h-5 w-5 mb-0.5 ${mobileTab === 'portal' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>PHC Portal</span>
        </button>
      </nav>
    </div>
  );
}
