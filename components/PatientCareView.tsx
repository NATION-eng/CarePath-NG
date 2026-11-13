'use client';

import React, { useState } from 'react';
import { PatientProfile, CareEvent, SmsMessage } from '@/lib/types';
import { 
  Calendar, 
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
  CheckCheck,
  UserPlus,
  CalendarPlus,
  Trash2,
  AlertTriangle,
  Users
} from 'lucide-react';
import { AudioVoicePlayer } from './AudioVoicePlayer';
import { playChime } from '@/lib/audioVoice';

interface PatientCareViewProps {
  patients: PatientProfile[];
  activePatient?: PatientProfile;
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
  onOpenNewPatientModal: () => void;
  onOpenNewAppointmentModal: () => void;
  onDeletePatient: (patientId: string) => void;
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
  onOpenNewPatientModal,
  onOpenNewAppointmentModal,
  onDeletePatient,
}: PatientCareViewProps) {
  const [selectedTimelineFilter, setSelectedTimelineFilter] = useState<'all' | 'upcoming'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ZERO-PATIENT STATE
  if (!activePatient || patients.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 sm:py-16 px-4 text-center">
        <div className="bg-white rounded-3xl border-2 border-surface-border p-6 sm:p-12 shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 mx-auto mb-4 border-2 border-teal-200">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-teal-950 mb-2">
            Primary Healthcare Patient Registry
          </h2>
          <p className="text-sm sm:text-base text-surface-dark/80 font-semibold max-w-lg mx-auto mb-6">
            No patients registered in the current session. Register a patient to initiate Antenatal Care (ANC), Child Immunisation (NPHCDA), or Chronic Healthcare schedules.
          </p>
          <button
            type="button"
            onClick={onOpenNewPatientModal}
            className="btn-tactile inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-black text-sm sm:text-base shadow-card w-full sm:w-auto"
          >
            <UserPlus className="h-5 w-5" />
            <span>+ Register Patient</span>
          </button>
        </div>
      </div>
    );
  }

  // Next active upcoming appointment
  const nextEvent = events.find((e) => e.status === 'scheduled' || e.status === 'confirmed') || events[0];
  const isConfirmed = nextEvent?.status === 'confirmed';

  return (
    <div className="w-full flex flex-col min-h-full">
      
      {/* 1. TOP RESPONSIVE PROFILE BANNER & SWITCHER */}
      <div className="bg-white rounded-2xl border-2 border-surface-border p-3.5 sm:p-5 shadow-subtle mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          
          {/* Active Patient Details */}
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-teal-800 text-cream-200 text-sm sm:text-base font-black shrink-0 shadow-xs">
              {activePatient.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-teal-950 tracking-tight leading-tight truncate">
                  {activePatient.name}
                </h1>
                <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-teal-900 bg-teal-100 px-2 py-0.5 rounded border border-teal-200 shrink-0">
                  {activePatient.categoryLabel}
                </span>
                <span className="text-xs text-surface-dark/70 font-mono font-bold shrink-0">
                  ID: {activePatient.code}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-surface-dark/80 font-semibold truncate mt-0.5">
                Stage: <strong className="text-teal-900 font-bold">{activePatient.stageInfo}</strong> • Garki Primary Health Centre (Ward FCT-04)
              </p>
            </div>
          </div>

          {/* Profile Switcher & Actions */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0 w-full lg:w-auto">
            <span className="text-xs font-black text-surface-dark/60 uppercase tracking-wider hidden 2xl:inline-block mr-1">
              Family Registry:
            </span>

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
                  className={`btn-tactile flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-2 shrink-0 ${
                    isSelected
                      ? 'bg-teal-800 text-white border-teal-800 shadow-xs ring-2 ring-teal-700/20'
                      : 'bg-surface-base text-surface-dark border-surface-border hover:bg-surface-muted hover:border-teal-400'
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                    isSelected ? 'bg-teal-950 text-cream-200' : 'bg-teal-200 text-teal-950'
                  }`}>
                    {pat.avatarInitials}
                  </span>
                  <span>{pat.name}</span>
                  {pat.relationship === 'child' && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                      isSelected ? 'bg-teal-900 text-teal-100' : 'bg-cream-200 text-teal-950 border border-teal-900/10'
                    }`}>
                      Proxy
                    </span>
                  )}
                </button>
              );
            })}

            {/* "+ Register Patient" Button */}
            <button
              type="button"
              onClick={onOpenNewPatientModal}
              className="btn-tactile flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-black bg-cream-200 hover:bg-cream-300 text-teal-950 border-2 border-teal-800/20 shadow-xs shrink-0"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ Register</span>
            </button>

            {/* "DELETE PATIENT" BUTTON */}
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete patient and permanently purge all their records (NDPA 2023)"
              className="btn-tactile flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-red-50 hover:bg-red-100 text-red-800 border-2 border-red-200 transition-colors shrink-0"
            >
              <Trash2 className="h-4 w-4 text-red-700" />
              <span className="hidden sm:inline">Delete Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-float border-2 border-red-200 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700 mx-auto mb-3.5 border-2 border-red-200">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-black text-teal-950 mb-1.5">Purge Patient Record?</h3>
            <p className="text-xs sm:text-sm text-surface-dark/80 font-semibold mb-5 leading-relaxed">
              Are you sure you want to permanently delete <strong>{activePatient.name}</strong> ({activePatient.code})? This will immediately purge all scheduled appointments, notifications, and care pathways per NDPA 2023 compliance.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-tactile flex-1 py-2.5 rounded-xl border-2 border-surface-border text-surface-dark text-xs sm:text-sm font-black hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeletePatient(activePatient.id);
                }}
                className="btn-tactile flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-black shadow-xs"
              >
                Yes, Purge Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN RESPONSIVE GRID (Single column on mobile/tablet, 12-col on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* MAIN COLUMN (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          
          {/* HERO CARD: NEXT SCHEDULED CLINIC EVENT */}
          {nextEvent ? (
            <div className="rounded-3xl bg-teal-900 text-white p-4 sm:p-6 shadow-float border-2 border-teal-700/80 relative overflow-hidden">
              {/* Top Status & Milestone Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-teal-800 text-cream-200 px-3 py-1 rounded-lg border border-teal-600">
                  {nextEvent.duePeriod}
                </span>
                <span
                  className={`text-xs sm:text-sm font-black px-3 py-1 rounded-full ${
                    isConfirmed
                      ? 'bg-emerald-400 text-emerald-950 shadow-xs'
                      : 'bg-amber-400 text-amber-950 animate-pulse'
                  }`}
                >
                  {isConfirmed ? '✓ Attendance Confirmed' : '● Due: Action Required'}
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-1 tracking-tight">
                {nextEvent.title}
              </h2>
              <p className="text-xs sm:text-sm text-teal-100 font-bold mb-4">
                {nextEvent.subtitle}
              </p>

              {/* 3 TILES GRID (1-col on mobile, 2-col on sm, 3-col on lg/xl) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 bg-teal-950/80 p-3 rounded-2xl border border-teal-700/60 mb-4">
                
                {/* Tile 1: Date & Time */}
                <div className="bg-teal-900/70 rounded-xl p-3 border border-teal-800/80 flex flex-col justify-between min-w-0">
                  <div className="flex items-center gap-1.5 text-teal-300 mb-1">
                    <Calendar className="h-4 w-4 text-cream-200 shrink-0" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Date & Time</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white text-sm sm:text-base leading-snug truncate">{nextEvent.date}</p>
                    <p className="text-xs font-bold text-teal-200 mt-0.5">{nextEvent.time}</p>
                  </div>
                </div>

                {/* Tile 2: Healthcare Centre */}
                <div className="bg-teal-900/70 rounded-xl p-3 border border-teal-800/80 flex flex-col justify-between min-w-0">
                  <div className="flex items-center gap-1.5 text-teal-300 mb-1">
                    <MapPin className="h-4 w-4 text-cream-200 shrink-0" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Healthcare Centre</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white text-sm sm:text-base leading-snug truncate" title={nextEvent.facilityName}>
                      {nextEvent.facilityName}
                    </p>
                    <p className="text-xs font-bold text-teal-200 mt-0.5 truncate">{nextEvent.facilityAddress}</p>
                  </div>
                </div>

                {/* Tile 3: Clinical Officer */}
                <div className="bg-teal-900/70 rounded-xl p-3 border border-teal-800/80 flex flex-col justify-between min-w-0 sm:col-span-2 xl:col-span-1">
                  <div className="flex items-center gap-1.5 text-teal-300 mb-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Clinical Officer</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white text-sm sm:text-base leading-snug truncate" title={nextEvent.clinicianName}>
                      {nextEvent.clinicianName}
                    </p>
                    <p className="text-xs font-bold text-teal-200 mt-0.5 truncate">{nextEvent.clinicianRole}</p>
                  </div>
                </div>
              </div>

              {/* Spoken Voice Note Preview */}
              <div className="mb-4">
                <AudioVoicePlayer
                  pidginText={nextEvent.pidginAudioText}
                  englishText={nextEvent.englishAudioText}
                  label="Listen to Clinic Voice Reminder"
                />
              </div>

              {/* Preparation Checklist */}
              <div className="bg-teal-950/60 rounded-2xl p-3.5 mb-4 border border-teal-800">
                <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-teal-200 mb-2">
                  What to Bring & Preparation Checklist:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-white font-semibold">
                  {nextEvent.instructions.map((ins, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-teal-900/80 p-2 rounded-xl border border-teal-700/60">
                      <CheckCircle2 className="h-4 w-4 text-cream-200 shrink-0 mt-0.5" />
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsive Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                {!isConfirmed ? (
                  <button
                    type="button"
                    onClick={() => onConfirmEvent(nextEvent.id)}
                    className="btn-tactile flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-teal-950 py-3 px-5 font-black text-sm shadow-card transition-colors"
                  >
                    <CheckCircle2 className="h-5 w-5 text-teal-900" />
                    <span>Confirm Attendance</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-teal-950 py-3 px-5 font-black text-sm shadow-card cursor-default"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Attendance Confirmed ✓</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenEventSheet(nextEvent)}
                  className="btn-tactile flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white py-3 px-4 font-extrabold text-sm border border-teal-600 transition-colors"
                >
                  <span>Full Instructions & Reschedule</span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenNewAppointmentModal}
                  className="btn-tactile flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-teal-950 hover:bg-black text-cream-200 py-3 px-4 font-black text-sm border border-teal-700 transition-colors"
                >
                  <CalendarPlus className="h-4 w-4" />
                  <span>+ Book Visit</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-surface-border text-center shadow-subtle">
              <CalendarPlus className="h-12 w-12 text-teal-800 mx-auto mb-3" />
              <h3 className="text-xl font-black text-teal-950">No Active Visits Scheduled</h3>
              <p className="text-xs sm:text-sm text-surface-dark/70 font-semibold mb-4">
                Schedule a clinical follow-up or immunisation session for {activePatient.name}.
              </p>
              <button
                type="button"
                onClick={onOpenNewAppointmentModal}
                className="btn-tactile px-5 py-3 rounded-2xl bg-teal-800 text-white font-black text-sm hover:bg-teal-900"
              >
                + Schedule First Clinic Visit
              </button>
            </div>
          )}

          {/* CARE PATHWAY MILESTONES SECTION */}
          <div id="carepath-milestones" className="bg-white rounded-2xl border-2 border-surface-border p-4 sm:p-5 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-teal-950">
                  {activePatient.category === 'immunisation' ? 'National Immunisation Schedule (NPHCDA 2024)' : 'Federal Maternal ANC Pathway'}
                </h3>
                <p className="text-xs sm:text-sm text-surface-dark/70 font-bold">
                  Sequential clinical milestones with interval protection
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={onOpenNewAppointmentModal}
                  className="btn-tactile text-xs font-black bg-cream-200 text-teal-950 px-3 py-1.5 rounded-lg border border-teal-800/20"
                >
                  + Add Event
                </button>
                <div className="flex items-center gap-1.5 bg-surface-base p-1 rounded-xl border border-surface-border text-xs sm:text-sm font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedTimelineFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      selectedTimelineFilter === 'all'
                        ? 'bg-teal-800 text-white font-extrabold shadow-xs'
                        : 'text-surface-dark/70 hover:text-teal-950'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTimelineFilter('upcoming')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      selectedTimelineFilter === 'upcoming'
                        ? 'bg-teal-800 text-white font-extrabold shadow-xs'
                        : 'text-surface-dark/70 hover:text-teal-950'
                    }`}
                  >
                    Upcoming
                  </button>
                </div>
              </div>
            </div>

            {/* Milestones Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      className={`btn-tactile p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-cream-50/80 border-teal-700/50 shadow-xs'
                          : isDone
                          ? 'bg-surface-base border-surface-border opacity-80'
                          : 'bg-white border-surface-border hover:border-teal-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-teal-900 bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200">
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

                        <h4 className="text-base sm:text-lg font-black text-surface-dark leading-snug mb-0.5">
                          {ev.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-surface-dark/80 font-semibold mb-3 line-clamp-1">
                          {ev.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs sm:text-sm text-surface-dark/70 pt-2.5 border-t border-surface-border font-bold">
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

        {/* SIDEBAR COMPANION COLUMN (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-5">
          
          {/* 1. OFFICIAL HEALTH CARD / YELLOW CARD SUMMARY */}
          <div className="bg-white rounded-2xl border-2 border-surface-border p-4 sm:p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-800" />
                <h3 className="text-base font-black text-teal-950">
                  {activePatient.category === 'immunisation' ? 'Digital Child Yellow Card' : 'Official Maternal ANC Card'}
                </h3>
              </div>
              <span className="text-xs font-black bg-cream-200 text-teal-950 px-2 py-0.5 rounded border border-teal-900/10">
                Verified
              </span>
            </div>

            <div className="bg-surface-base rounded-xl p-3 border border-surface-border text-xs sm:text-sm space-y-2 mb-3">
              <div className="flex justify-between border-b border-surface-border pb-1.5">
                <span className="text-surface-dark/70 font-semibold">Registered Name:</span>
                <span className="font-black text-teal-950 truncate max-w-[170px]">{activePatient.name}</span>
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
                <span className="font-extrabold text-teal-800 truncate max-w-[160px]">{activePatient.notificationContact.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-surface-dark/70 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>NDPA 2023 Compliant</span>
              </span>

              {/* Delete Patient Link in Sidebar */}
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-red-700 hover:text-red-900 font-bold hover:underline"
              >
                Delete Record
              </button>
            </div>
          </div>

          {/* 2. LIVE TELEPHONY COMPANION WIDGET */}
          <div className="bg-white rounded-2xl border-2 border-surface-border shadow-subtle overflow-hidden">
            <div className="bg-teal-950 text-white px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm border-b border-teal-900">
              <div className="flex items-center gap-2 font-black">
                <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>Live SMS Telephony Feed</span>
              </div>
              <span className="text-[11px] text-teal-300 font-bold">MTN Whitelisted</span>
            </div>

            <div className="p-3 bg-surface-base space-y-2.5 max-h-[260px] overflow-y-auto">
              {smsLog.slice(0, 3).map((sms) => (
                <div key={sms.id} className="rounded-xl bg-white border border-surface-border p-2.5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-surface-dark/60 mb-1 font-bold">
                    <span className="font-black text-teal-900">{sms.sender}</span>
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <CheckCheck className="h-3.5 w-3.5" /> Delivered
                    </span>
                  </div>
                  <p className="text-surface-dark font-semibold leading-relaxed text-xs sm:text-sm">{sms.messageText}</p>
                </div>
              ))}
              {smsLog.length === 0 && (
                <p className="text-xs text-surface-dark/60 italic text-center py-4">
                  No notifications dispatched yet.
                </p>
              )}
            </div>

            {/* Quick SMS interactive buttons on desktop */}
            <div className="p-3 bg-white border-t border-surface-border">
              <div className="text-xs font-black text-surface-dark/70 uppercase tracking-wider mb-1.5">
                Patient Inbound SMS Response:
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onReplySms('1')}
                  className="btn-tactile flex-1 rounded-xl border-2 border-emerald-400 bg-emerald-50 py-2 px-2.5 text-xs sm:text-sm font-black text-emerald-950 hover:bg-emerald-100 flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Reply &ldquo;1&rdquo;</span>
                  <span className="text-xs font-bold text-emerald-800">(Confirm)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onReplySms('2')}
                  className="btn-tactile flex-1 rounded-xl border-2 border-amber-400 bg-amber-50 py-2 px-2.5 text-xs sm:text-sm font-black text-amber-950 hover:bg-amber-100 flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Reply &ldquo;2&rdquo;</span>
                  <span className="text-xs font-bold text-amber-800">(Reschedule)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. PROXY NOTIFICATION ARCHITECTURE NOTE */}
          <div className="rounded-2xl border-2 border-teal-900/20 bg-teal-950 text-white p-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-black text-cream-200 text-sm mb-1.5">
              <PhoneForwarded className="h-4 w-4 text-teal-400" />
              <span>Independent Proxy Architecture</span>
            </div>
            <p className="text-white/90 leading-relaxed text-xs font-medium mb-2">
              In Nigerian care journeys, account owners frequently coordinate for multiple dependents without phones.
            </p>
            <div className="bg-teal-900/70 p-2.5 rounded-xl border border-teal-800 text-xs font-semibold space-y-1">
              <p>• <strong>Patient</strong>: {activePatient.name} ({activePatient.phoneOwnedByPatient ? 'Personal phone' : 'Phone-less profile'})</p>
              <p>• <strong>SMS Recipient</strong>: {activePatient.notificationContact.name} ({activePatient.notificationContact.phone})</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. FIXED BOTTOM THUMB NAVIGATION (MOBILE ONLY: < md screens) */}
      <nav className="fixed md:hidden bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t-2 border-surface-border px-2 sm:px-4 py-2 flex items-center justify-around safe-bottom z-30 shadow-subtle">
        <button
          type="button"
          onClick={() => {
            onMobileTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[11px] sm:text-xs font-black transition-colors ${
            mobileTab === 'home' ? 'text-teal-900' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Home className={`h-5 w-5 mb-0.5 ${mobileTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>Care Hub</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onMobileTabChange('home');
            const el = document.getElementById('carepath-milestones');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center py-1 px-2.5 rounded-lg text-[11px] sm:text-xs font-black text-surface-dark/60 hover:text-teal-900 transition-colors"
        >
          <Layers className="h-5 w-5 mb-0.5 stroke-2" />
          <span>Timeline</span>
        </button>

        <button
          type="button"
          onClick={() => onMobileTabChange('sms')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[11px] sm:text-xs font-black transition-colors ${
            mobileTab === 'sms' ? 'text-teal-900' : 'text-surface-dark/60 hover:text-teal-900'
          }`}
        >
          <Smartphone className={`h-5 w-5 mb-0.5 ${mobileTab === 'sms' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span>SMS Feed</span>
        </button>

        <button
          type="button"
          onClick={() => onMobileTabChange('portal')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[11px] sm:text-xs font-black transition-colors ${
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
