'use client';

import React, { useState } from 'react';
import { PatientProfile } from '@/lib/types';
import { X, CalendarPlus, Clock, MapPin, UserCheck } from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: PatientProfile[];
  activePatientId: string;
  onScheduleAppointment: (appointmentData: {
    patientId: string;
    title: string;
    subtitle: string;
    date: string;
    time: string;
    facilityName: string;
    facilityAddress: string;
    clinicianName: string;
    clinicianRole: string;
    instructions: string[];
    vaccines?: string[];
  }) => void;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  patients,
  activePatientId,
  onScheduleAppointment,
}: NewAppointmentModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState(activePatientId);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [date, setDate] = useState('Tomorrow');
  const [time, setTime] = useState('09:00 AM');
  const [facilityName, setFacilityName] = useState('Garki Primary Healthcare Centre');
  const [clinicianName, setClinicianName] = useState('Nurse Blessing Aliyu');
  const [clinicianRole, setClinicianRole] = useState('Senior Community Health Officer (CHO)');
  const [instructionText, setInstructionText] = useState('Bring hospital card and recent test results');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedPatientId) return;

    playChime('confirm');
    onScheduleAppointment({
      patientId: selectedPatientId,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Scheduled Healthcare Follow-up',
      date: date.trim(),
      time: time.trim(),
      facilityName: facilityName.trim(),
      facilityAddress: 'Area 10, Garki, Abuja FCT',
      clinicianName: clinicianName.trim(),
      clinicianRole: clinicianRole.trim(),
      instructions: instructionText.split(',').map((s) => s.trim()).filter(Boolean),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-float z-10 max-h-[92vh] sm:max-h-[85vh] overflow-y-auto border-2 border-surface-border">
        {/* Mobile drag handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-surface-border sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-surface-border pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-cream-200 shrink-0">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-teal-950">Schedule Clinic Appointment</h2>
              <p className="text-xs text-surface-dark/70 font-semibold">CarePath Care Continuity Scheduler</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-surface-dark/60 hover:bg-surface-muted hover:text-surface-dark"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Patient Selection */}
          <div>
            <label className="block font-black text-teal-950 mb-1">Select Patient *</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code}) — {p.categoryLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Title */}
          <div>
            <label className="block font-black text-teal-950 mb-1">Appointment / Milestone Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 10-Week Penta 2 & Rota 2 Dose or ANC 2nd Trimester Checkup"
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Subtitle / Clinical Note */}
          <div>
            <label className="block font-black text-teal-950 mb-1">Clinical Note / Description</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Routine Immunisation Dose or Ultrasound & Blood Pressure Review"
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Date & Time (Stacked on mobile, 2-col on sm+) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-black text-teal-950 mb-1">Date *</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Thursday, Dec 04"
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="block font-black text-teal-950 mb-1">Time *</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 09:00 AM"
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Primary Healthcare Centre */}
          <div>
            <label className="block font-black text-teal-950 mb-1">Primary Healthcare Facility *</label>
            <input
              type="text"
              required
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Clinician in Charge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-black text-teal-950 mb-1">Clinician Name</label>
              <input
                type="text"
                value={clinicianName}
                onChange={(e) => setClinicianName(e.target.value)}
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="block font-black text-teal-950 mb-1">Clinician Role</label>
              <input
                type="text"
                value={clinicianRole}
                onChange={(e) => setClinicianRole(e.target.value)}
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Instructions to Patient */}
          <div>
            <label className="block font-black text-teal-950 mb-1">Patient Instructions (comma separated)</label>
            <input
              type="text"
              value={instructionText}
              onChange={(e) => setInstructionText(e.target.value)}
              placeholder="e.g. Bring Yellow Card, Come with baby shawl"
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-tactile flex-1 py-3 rounded-xl border-2 border-surface-border text-surface-dark font-black text-xs sm:text-sm hover:bg-surface-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-tactile flex-1 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-black text-xs sm:text-sm shadow-card"
            >
              Schedule Visit & Notify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
