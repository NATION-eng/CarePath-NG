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
  Filter, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

interface FacilityPortalProps {
  events: CareEvent[];
  patients: PatientProfile[];
  onConfirm: (eventId: string) => void;
  onReschedule: (eventId: string, newDate: string) => void;
  onDispatchReminder: (eventId: string) => void;
  onRegisterChild: (childName: string, motherName: string, phone: string, birthDate: string) => void;
  onSelectPatient: (patientId: string) => void;
}

export function FacilityPortal({
  events,
  patients,
  onConfirm,
  onReschedule,
  onDispatchReminder,
  onRegisterChild,
  onSelectPatient,
}: FacilityPortalProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [childName, setChildName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim() || !motherName.trim()) return;
    playChime('confirm');
    onRegisterChild(childName, motherName, motherPhone, new Date().toISOString());
    setChildName('');
    setMotherName('');
    setMotherPhone('');
    setShowRegisterModal(false);
  };

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
    <div className="flex flex-col h-full bg-surface-base rounded-2xl border border-surface-border shadow-card overflow-hidden">
      {/* Facility Header */}
      <div className="bg-teal-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-teal-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 border border-teal-700 text-teal-200">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white">Garki Primary Healthcare Centre</h2>
              <span className="text-[10px] font-semibold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full">
                Active Ward FCT-04
              </span>
            </div>
            <p className="text-xs text-teal-200/80">
              Staff: Matron Fatima Yusuf & Nurse Blessing Aliyu (Senior CHO)
            </p>
          </div>
        </div>

        {/* 20-Second Rapid Registration Button */}
        <button
          type="button"
          onClick={() => setShowRegisterModal(true)}
          className="btn-tactile flex items-center gap-1.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-teal-950 px-3.5 py-2 font-bold text-xs shadow-xs transition-colors"
        >
          <UserPlus className="h-4 w-4 text-teal-900" />
          <span>Rapid Newborn Intake (&lt;25s)</span>
        </button>
      </div>

      {/* Operational Stats Bar */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-white border-b border-surface-border text-xs">
        <div className="rounded-xl border border-surface-border p-2.5 bg-surface-base">
          <p className="text-surface-dark/60 text-[11px] font-medium">Expected Attendance</p>
          <p className="text-lg font-bold text-teal-950">{events.length} Visits</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-2.5">
          <p className="text-emerald-800 text-[11px] font-medium">Confirmed via SMS Reply</p>
          <p className="text-lg font-bold text-emerald-900">{confirmedCount} Patients</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-2.5">
          <p className="text-amber-800 text-[11px] font-medium">Pending Response</p>
          <p className="text-lg font-bold text-amber-900">{scheduledCount} Scheduled</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-3 bg-white border-b border-surface-border flex items-center justify-between gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-surface-dark/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, infant name, or card #..."
            className="w-full rounded-lg border border-surface-border bg-surface-base pl-8 pr-3 py-1.5 text-xs text-surface-dark placeholder:text-surface-dark/40 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
        </div>
        <span className="text-[11px] text-surface-dark/60 font-medium">
          NPHCDA 2024 Schedule DAG
        </span>
      </div>

      {/* Rapid Intake Modal */}
      {showRegisterModal && (
        <div className="p-4 bg-teal-50 border-b border-teal-200 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-teal-950 uppercase tracking-wider">
              20-Second Rapid Infant Registration (Field PHC Optimized)
            </h3>
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="text-xs text-teal-800 hover:underline font-semibold"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-teal-900/80 mb-3">
            Enter essential details only. System automatically attaches NPHCDA immunisation schedule and sends transactional SMS to mother.
          </p>
          <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              required
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Child's Full Name (e.g. Baby Kemi)"
              className="rounded-lg border border-teal-300 bg-white px-3 py-2 text-xs text-surface-dark focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
            <input
              type="text"
              required
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="Mother / Guardian Name"
              className="rounded-lg border border-teal-300 bg-white px-3 py-2 text-xs text-surface-dark focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
            <div className="flex gap-1.5">
              <input
                type="tel"
                value={motherPhone}
                onChange={(e) => setMotherPhone(e.target.value)}
                placeholder="Mother's Phone Number"
                className="flex-1 rounded-lg border border-teal-300 bg-white px-3 py-2 text-xs text-surface-dark focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
              <button
                type="submit"
                className="btn-tactile rounded-lg bg-teal-800 text-white px-3 py-2 text-xs font-bold hover:bg-teal-900 whitespace-nowrap"
              >
                Register & Queue SMS
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roster Table */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredEvents.map((ev) => {
          const patient = patients.find((p) => p.id === ev.patientId);
          const isConfirmed = ev.status === 'confirmed';
          const isCompleted = ev.status === 'completed';

          return (
            <div
              key={ev.id}
              className={`p-3 rounded-xl border transition-all ${
                isConfirmed
                  ? 'bg-white border-emerald-300 shadow-xs'
                  : isCompleted
                  ? 'bg-surface-base border-surface-border opacity-70'
                  : 'bg-white border-surface-border'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => patient && onSelectPatient(patient.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-900 text-xs font-bold cursor-pointer hover:bg-teal-200 transition-colors"
                  >
                    {patient?.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-teal-950">
                        {patient?.name}
                      </span>
                      <span className="text-[10px] text-surface-dark/60 font-mono">
                        {patient?.code}
                      </span>
                      {patient?.relationship === 'child' && (
                        <span className="text-[10px] bg-cream-200 text-teal-900 font-medium px-1.5 py-0.2 rounded">
                          Child (Proxy: {patient.notificationContact.name.split(' ')[0]})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-surface-dark/70 font-medium">
                      {ev.title} • {ev.duePeriod}
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      isConfirmed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isCompleted
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {isConfirmed
                      ? '● Confirmed Attendance (SMS [1])'
                      : isCompleted
                      ? '✓ Vaccinated & Completed'
                      : '○ Scheduled (Awaiting Reply)'}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surface-border/70 text-xs">
                <div className="text-[11px] text-surface-dark/70 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-teal-800" />
                  <span>Scheduled: <strong>{ev.date}</strong> at {ev.time}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {!isConfirmed && !isCompleted && (
                    <button
                      type="button"
                      onClick={() => onConfirm(ev.id)}
                      className="btn-tactile rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Confirm Attendance</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDispatchReminder(ev.id)}
                    className="btn-tactile rounded-lg border border-teal-800/20 bg-cream-100 hover:bg-cream-200 text-teal-950 px-2 py-1 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Send className="h-3 w-3 text-teal-700" />
                    <span>Resend SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReschedule(ev.id, 'Next Thursday, Nov 21')}
                    className="btn-tactile rounded-lg border border-surface-border hover:bg-surface-muted text-surface-dark px-2 py-1 text-[11px] font-medium"
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
