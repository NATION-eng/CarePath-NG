'use client';

import React, { useState } from 'react';
import { PatientProfile } from '@/lib/types';
import { X, CalendarPlus, Clock, MapPin, UserCheck, Send } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-float z-10 max-h-[90vh] overflow-y-auto border-2 border-surface-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-surface-border pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-cream-200">
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
            <label className="block font-black text-teal-950 mb-1.5">Select Patient *</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id}>
                  {pat.name} ({pat.code}) — {pat.categoryLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Title */}
          <div>
            <label className="block font-black text-teal-950 mb-1.5">Appointment Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 10-Week Immunisation Visit or Antenatal Follow-up"
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Subtitle / Clinical Purpose */}
          <div>
            <label className="block font-black text-teal-950 mb-1.5">Procedures / Specific Antigen</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Penta 2, OPV 2, PCV 2 or Blood Pressure & Fetal Review"
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-teal-950 mb-1.5">Date *</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Next Thursday, Nov 21"
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="block font-black text-teal-950 mb-1.5">Time *</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 09:30 AM"
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Healthcare Facility */}
          <div>
            <label className="block font-black text-teal-950 mb-1.5">Healthcare Centre *</label>
            <input
              type="text"
              required
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              placeholder="e.g. Garki Primary Healthcare Centre"
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Clinician in charge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-teal-950 mb-1.5">Clinical Officer Name</label>
              <input
                type="text"
                value={clinicianName}
                onChange={(e) => setClinicianName(e.target.value)}
                placeholder="e.g. Nurse Blessing Aliyu"
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="block font-black text-teal-950 mb-1.5">Role / Designation</label>
              <input
                type="text"
                value={clinicianRole}
                onChange={(e) => setClinicianRole(e.target.value)}
                placeholder="e.g. Senior CHO"
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block font-black text-teal-950 mb-1.5">Preparation Instructions (comma-separated)</label>
            <input
              type="text"
              value={instructionText}
              onChange={(e) => setInstructionText(e.target.value)}
              placeholder="e.g. Bring yellow card, Arrive by 9am, Wear loose clothes"
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn-tactile w-full py-3.5 rounded-2xl bg-teal-800 text-white font-black text-sm hover:bg-teal-900 shadow-card flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              <span>Confirm Appointment & Queue SMS Reminder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
