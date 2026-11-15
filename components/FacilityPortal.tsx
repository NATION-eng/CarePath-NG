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
  Check,
  Trash2,
} from 'lucide-react';

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
  onDeleteEvent?: (eventId: string) => void;
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
  onDeleteEvent,
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
  const completedCount = events.filter((e) => e.status === 'completed').length;

  return (
    <div className="flex flex-col h-full bg-surface-base rounded-3xl border-2 border-surface-border shadow-card overflow-hidden">
      {/* Facility Header */}
      <div className="bg-petrol-900 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b-2 border-petrol-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-petrol-800 border-2 border-petrol-700 text-peach-500 shrink-0 shadow-xs">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-black text-base sm:text-xl text-white truncate">Garki Primary Healthcare Centre</h2>
              <span className="text-[11px] font-black bg-mint-900 text-mint-200 px-2.5 py-0.5 rounded-full border border-mint-700/60 shrink-0">
                FCT-04
              </span>
            </div>
            <p className="text-xs sm:text-sm text-petrol-200 font-bold mt-0.5 truncate">
              National Health Registry • Nurse Blessing Aliyu (Senior CHO)
            </p>
          </div>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenNewPatientModal}
            className="btn-tactile flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-petrol-950 px-3.5 py-2 font-black text-xs sm:text-sm shadow-peach transition-colors"
          >
            <UserPlus className="h-4 w-4 text-petrol-950" />
            <span>+ Patient</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewAppointmentModal}
            className="btn-tactile flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-petrol-800 hover:bg-petrol-750 text-white px-3.5 py-2 font-black text-xs sm:text-sm border border-petrol-700 shadow-xs transition-colors"
          >
            <CalendarPlus className="h-4 w-4 text-peach-500" />
            <span>+ Schedule</span>
          </button>

          <button
            type="button"
            onClick={onExportData}
            title="Download full registry as JSON"
            className="btn-tactile flex items-center justify-center gap-1.5 rounded-xl bg-petrol-950 hover:bg-black text-petrol-200 px-3 py-2 font-black text-xs border border-petrol-800"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Operational Stats Bar (3-column responsive layout across all mobile & desktop screens) */}
      <div className="grid grid-cols-3 gap-2 p-2.5 sm:p-4 bg-white border-b-2 border-surface-border text-xs sm:text-sm">
        <div className="rounded-xl sm:rounded-2xl border-2 border-surface-border p-2 sm:p-3 bg-surface-base">
          <p className="text-surface-dark/70 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Total Visits</p>
          <p className="text-sm sm:text-2xl font-black text-petrol-950 mt-0.5">{events.length}</p>
        </div>
        <div className="rounded-xl sm:rounded-2xl border-2 border-mint-200 bg-mint-50/70 p-2 sm:p-3">
          <p className="text-mint-900 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider truncate">SMS Confirmed</p>
          <p className="text-sm sm:text-2xl font-black text-mint-900 mt-0.5">{confirmedCount}</p>
        </div>
        <div className="rounded-xl sm:rounded-2xl border-2 border-peach-200 bg-peach-50/70 p-2 sm:p-3">
          <p className="text-petrol-950 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Completed</p>
          <p className="text-sm sm:text-2xl font-black text-petrol-950 mt-0.5">{completedCount}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-3 sm:p-3.5 bg-white border-b-2 border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-surface-dark/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, infant code, or procedure..."
            className="w-full rounded-xl border-2 border-surface-border bg-surface-base pl-10 pr-4 py-2 text-base sm:text-sm font-semibold text-surface-dark placeholder:text-surface-dark/50 focus:outline-none focus:ring-2 focus:ring-peach-500"
          />
        </div>
        <span className="text-xs text-petrol-800 font-black self-end sm:self-auto bg-peach-50 px-3 py-1 rounded-full border border-peach-200">
          NPHCDA 2024 Protocol Active
        </span>
      </div>

      {/* Roster Feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {filteredEvents.map((ev) => {
          const patient = patients.find((p) => p.id === ev.patientId);
          const isConfirmed = ev.status === 'confirmed';
          const isCompleted = ev.status === 'completed';

          return (
            <div
              key={ev.id}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                isCompleted
                  ? 'bg-surface-base border-surface-border opacity-75'
                  : isConfirmed
                  ? 'bg-white border-mint-500 shadow-xs ring-1 ring-mint-500/20'
                  : 'bg-white border-surface-border'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div
                    onClick={() => patient && onSelectPatient(patient.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-petrol-900 border border-petrol-750 text-peach-500 text-xs sm:text-sm font-black cursor-pointer hover:bg-petrol-800 transition-colors shrink-0 shadow-xs"
                  >
                    {patient?.avatarInitials || 'CP'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm sm:text-base text-petrol-950 truncate">
                        {patient?.name}
                      </span>
                      <span className="text-xs text-surface-dark/70 font-mono font-bold">
                        {patient?.code}
                      </span>
                      {patient?.relationship === 'child' && (
                        <span className="text-[10px] bg-peach-100 text-petrol-950 font-black px-1.5 py-0.5 rounded border border-peach-300">
                          Proxy: {patient.notificationContact.name.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-surface-dark/80 font-bold mt-0.5 truncate">
                      {ev.title} • <span className="text-petrol-800 font-black">{ev.duePeriod}</span>
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="self-start sm:self-auto">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      isCompleted
                        ? 'bg-mint-100 text-mint-900 border border-mint-300'
                        : isConfirmed
                        ? 'bg-mint-100 text-mint-900 border border-mint-400'
                        : 'bg-peach-100 text-petrol-950 border border-peach-300'
                    }`}
                  >
                    {isCompleted
                      ? '✓ Dose Administered'
                      : isConfirmed
                      ? '● Confirmed Attendance (SMS)'
                      : '○ Scheduled'}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-surface-border text-xs sm:text-sm font-bold">
                <div className="text-surface-dark/80 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-peach-500 shrink-0" />
                  <span>Session: <strong className="text-petrol-950 font-black">{ev.date}</strong> at {ev.time}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => onMarkCompleted(ev.id)}
                      className="btn-tactile rounded-xl bg-petrol-900 hover:bg-petrol-850 text-white px-3 py-1.5 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="h-4 w-4 text-peach-500" />
                      <span>Mark Completed</span>
                    </button>
                  )}

                  {!isConfirmed && !isCompleted && (
                    <button
                      type="button"
                      onClick={() => onConfirm(ev.id)}
                      className="btn-tactile rounded-xl bg-mint-700 hover:bg-mint-800 text-white px-3 py-1.5 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Confirm Attendance</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDispatchReminder(ev.id)}
                    className="btn-tactile rounded-xl border border-peach-200 bg-peach-50 hover:bg-peach-100 text-petrol-950 px-3 py-1.5 text-xs sm:text-sm font-black flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5 text-peach-600" />
                    <span>Send SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const nextDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      });
                      onReschedule(ev.id, nextDate);
                    }}
                    className="btn-tactile rounded-xl border border-surface-border hover:bg-surface-muted text-surface-dark px-3 py-1.5 text-xs sm:text-sm font-extrabold"
                  >
                    Reschedule
                  </button>

                  {onDeleteEvent && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete this clinical record: "${ev.title}"?`)) {
                          onDeleteEvent(ev.id);
                        }
                      }}
                      title="Delete this visit record"
                      className="btn-tactile rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1.5 text-xs sm:text-sm font-bold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-surface-border">
            <p className="text-sm text-surface-dark/70 font-bold mb-3">No matching clinical records found in live registry.</p>
            <button
              type="button"
              onClick={onOpenNewAppointmentModal}
              className="btn-tactile px-5 py-2.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-petrol-950 text-xs font-black shadow-peach"
            >
              + Schedule Clinical Visit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
