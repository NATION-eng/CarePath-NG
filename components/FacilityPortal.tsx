'use client';

import React, { useState } from 'react';
import { CareEvent, PatientProfile } from '@/lib/types';
import { 
  Building2, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Send, 
  Search, 
  CalendarPlus,
  Download,
  ShieldCheck,
  Check
} from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

interface FacilityPortalProps {
  events: CareEvent[];
  patients: PatientProfile[];
  onConfirm: (eventId: string) => void;
  onReschedule: (eventId: string, newDate: string) => void;
  onDispatchReminder: (eventId: string) => void;
  onMarkCompleted: (eventId: string) => void;
  onSelectPatient: (patientId: string) => void;
  onOpenNewPatientModal: () => void;
  onOpenNewAppointmentModal: () => void;
  onExportData: () => void;
}

export function FacilityPortal({
  events,
  patients,
  onConfirm,
  onReschedule,
  onDispatchReminder,
  onMarkCompleted,
  onSelectPatient,
  onOpenNewPatientModal,
  onOpenNewAppointmentModal,
  onExportData,
}: FacilityPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((ev) => {
    const patient = patients.find((p) => p.id === ev.patientId);
    return (
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.facilityName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const confirmedCount = events.filter((e) => e.status === 'confirmed').length;
  const scheduledCount = events.filter((e) => e.status === 'scheduled').length;
  const completedCount = events.filter((e) => e.status === 'completed').length;

  return (
    <div className="flex flex-col h-full bg-surface-base rounded-3xl border-2 border-surface-border shadow-card overflow-hidden">
      {/* Facility Header */}
      <div className="bg-teal-900 text-white p-5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-teal-800">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 border-2 border-teal-700 text-cream-200">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-black text-base sm:text-xl text-white">Garki Primary Healthcare Centre</h2>
              <span className="text-xs font-black bg-emerald-800 text-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-600">
                Facility Code: FCT-04
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-200 font-bold mt-0.5">
              National Health Registry • Matron Fatima Yusuf & Nurse Blessing Aliyu (Senior CHO)
            </p>
          </div>
        </div>

        {/* Real Action Buttons in Facility Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onOpenNewPatientModal}
            className="btn-tactile flex items-center gap-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-teal-950 px-3.5 py-2.5 font-black text-xs sm:text-sm shadow-xs transition-colors"
          >
            <UserPlus className="h-4 w-4 text-teal-950" />
            <span>+ Register Patient</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewAppointmentModal}
            className="btn-tactile flex items-center gap-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white px-3.5 py-2.5 font-black text-xs sm:text-sm border border-teal-600 shadow-xs transition-colors"
          >
            <CalendarPlus className="h-4 w-4" />
            <span>+ Schedule Visit</span>
          </button>

          <button
            type="button"
            onClick={onExportData}
            title="Download full registry as JSON"
            className="btn-tactile flex items-center gap-1.5 rounded-xl bg-teal-950 hover:bg-black text-teal-200 px-3 py-2.5 font-black text-xs border border-teal-800"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Operational Stats Bar */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-white border-b-2 border-surface-border text-xs sm:text-sm">
        <div className="rounded-2xl border-2 border-surface-border p-3.5 bg-surface-base">
          <p className="text-surface-dark/70 text-xs font-bold uppercase tracking-wider">Total Scheduled</p>
          <p className="text-xl sm:text-2xl font-black text-teal-950 mt-0.5">{events.length} Visits</p>
        </div>
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 p-3.5">
          <p className="text-emerald-900 text-xs font-bold uppercase tracking-wider">Confirmed via SMS</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-900 mt-0.5">{confirmedCount} Patients</p>
        </div>
        <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/70 p-3.5">
          <p className="text-teal-900 text-xs font-bold uppercase tracking-wider">Administered / Completed</p>
          <p className="text-xl sm:text-2xl font-black text-teal-950 mt-0.5">{completedCount} Completed</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-3.5 bg-white border-b-2 border-surface-border flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-surface-dark/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, infant card #, or procedure..."
            className="w-full rounded-xl border-2 border-surface-border bg-surface-base pl-10 pr-4 py-2 text-xs sm:text-sm font-semibold text-surface-dark placeholder:text-surface-dark/50 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>
        <span className="text-xs sm:text-sm text-surface-dark/70 font-black">
          NPHCDA 2024 Protocol Active
        </span>
      </div>

      {/* Roster Table */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredEvents.map((ev) => {
          const patient = patients.find((p) => p.id === ev.patientId);
          const isConfirmed = ev.status === 'confirmed';
          const isCompleted = ev.status === 'completed';

          return (
            <div
              key={ev.id}
              className={`p-4 rounded-2xl border-2 transition-all ${
                isCompleted
                  ? 'bg-surface-base border-surface-border opacity-75'
                  : isConfirmed
                  ? 'bg-white border-emerald-400 shadow-xs'
                  : 'bg-white border-surface-border'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => patient && onSelectPatient(patient.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-950 text-xs sm:text-sm font-black cursor-pointer hover:bg-teal-200 transition-colors"
                  >
                    {patient?.avatarInitials || 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm sm:text-base text-teal-950">
                        {patient?.name}
                      </span>
                      <span className="text-xs text-surface-dark/70 font-mono font-bold">
                        {patient?.code}
                      </span>
                      {patient?.relationship === 'child' && (
                        <span className="text-[11px] bg-cream-200 text-teal-950 font-black px-2 py-0.5 rounded border border-teal-900/10">
                          Proxy: {patient.notificationContact.name.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-surface-dark/80 font-bold mt-0.5">
                      {ev.title} • <span className="text-teal-800">{ev.duePeriod}</span>
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      isCompleted
                        ? 'bg-teal-100 text-teal-950 border border-teal-300'
                        : isConfirmed
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {isCompleted
                      ? '✓ Clinical Dose Administered'
                      : isConfirmed
                      ? '● Confirmed Attendance (SMS [1])'
                      : '○ Scheduled (Awaiting Attendance)'}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-border text-xs sm:text-sm font-bold">
                <div className="text-surface-dark/80 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-800" />
                  <span>Session: <strong className="text-teal-950 font-black">{ev.date}</strong> at {ev.time}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => onMarkCompleted(ev.id)}
                      className="btn-tactile rounded-xl bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-1.5 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="h-4 w-4" />
                      <span>Mark Administered / Completed</span>
                    </button>
                  )}

                  {!isConfirmed && !isCompleted && (
                    <button
                      type="button"
                      onClick={() => onConfirm(ev.id)}
                      className="btn-tactile rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Confirm Attendance</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDispatchReminder(ev.id)}
                    className="btn-tactile rounded-xl border border-teal-800/30 bg-cream-100 hover:bg-cream-200 text-teal-950 px-3 py-1.5 text-xs sm:text-sm font-black flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5 text-teal-800" />
                    <span>Send SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReschedule(ev.id, 'Next Thursday, Nov 21')}
                    className="btn-tactile rounded-xl border border-surface-border hover:bg-surface-muted text-surface-dark px-3 py-1.5 text-xs sm:text-sm font-extrabold"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
