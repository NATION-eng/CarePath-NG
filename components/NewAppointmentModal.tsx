'use client';

import React, { useState, useEffect } from 'react';
import { PatientProfile } from '@/lib/types';
import { X, CalendarPlus, Clock, MapPin, UserCheck, UserPlus, AlertCircle } from 'lucide-react';
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
  onOpenNewPatientModal?: () => void;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  patients,
  activePatientId,
  onScheduleAppointment,
  onOpenNewPatientModal,
}: NewAppointmentModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState(
    activePatientId || (patients.length > 0 ? patients[0].id : '')
  );
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [date, setDate] = useState('Tomorrow');
  const [time, setTime] = useState('09:00 AM');
  const [facilityName, setFacilityName] = useState('Garki Primary Healthcare Centre');
  const [clinicianName, setClinicianName] = useState('Nurse Blessing Aliyu');
  const [clinicianRole, setClinicianRole] = useState('Senior Community Health Officer (CHO)');
  const [instructionText, setInstructionText] = useState('Bring hospital yellow card and recent clinic records');

  useEffect(() => {
    if (activePatientId) {
      setSelectedPatientId(activePatientId);
    } else if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [activePatientId, patients, selectedPatientId]);

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

      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-float z-10 max-h-[92vh] sm:max-h-[85vh] overflow-y-auto border-2 border-surface-border safe-bottom">
        {/* Mobile drag handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-surface-border sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-surface-border pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-petrol-900 border border-petrol-750 text-peach-500 shrink-0">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-petrol-950">Schedule Clinic Appointment</h2>
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

        {/* If no patients exist yet, prompt to create one */}
        {patients.length === 0 ? (
          <div className="py-8 px-4 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-peach-50 border border-peach-200 text-peach-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-petrol-950">No Patient Profile Registered Yet</h3>
              <p className="text-xs sm:text-sm text-surface-dark/70 font-semibold max-w-sm mx-auto mt-1">
                Before you can schedule a clinical milestone or immunization session, please create your patient or dependent account.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenNewPatientModal) onOpenNewPatientModal();
                }}
                className="btn-tactile px-6 py-3 rounded-xl bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs sm:text-sm shadow-peach flex items-center justify-center gap-1.5"
              >
                <UserPlus className="h-4 w-4" />
                <span>+ Create Patient Account</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-surface-border text-surface-dark font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {/* Patient Selection */}
            <div>
              <label className="block font-black text-petrol-950 mb-1">Select Patient *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-peach-500"
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
              <label className="block font-black text-petrol-950 mb-1">Appointment / Milestone Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10-Week Penta 2 & Rota 2 Dose or ANC 2nd Trimester Checkup"
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-peach-500"
              />
            </div>

            {/* Subtitle / Clinical Note */}
            <div>
              <label className="block font-black text-petrol-950 mb-1">Clinical Note / Description</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Routine Immunisation Dose or Ultrasound & Blood Pressure Review"
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-peach-500"
              />
            </div>

            {/* Date & Time (Stacked on mobile, 2-col on sm+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-black text-petrol-950 mb-1">Date *</label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Thursday, Dec 04"
                  className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-peach-500"
                />
              </div>
              <div>
                <label className="block font-black text-petrol-950 mb-1">Time *</label>
                <input
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 09:00 AM"
                  className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-peach-500"
                />
              </div>
            </div>

            {/* Primary Healthcare Centre */}
            <div>
              <label className="block font-black text-petrol-950 mb-1">Primary Healthcare Facility *</label>
              <input
                type="text"
                required
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-peach-500"
              />
            </div>

            {/* Clinician in Charge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-black text-petrol-950 mb-1">Clinician Name</label>
                <input
                  type="text"
                  value={clinicianName}
                  onChange={(e) => setClinicianName(e.target.value)}
                  className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-peach-500"
                />
              </div>
              <div>
                <label className="block font-black text-petrol-950 mb-1">Clinician Role</label>
                <input
                  type="text"
                  value={clinicianRole}
                  onChange={(e) => setClinicianRole(e.target.value)}
                  className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-peach-500"
                />
              </div>
            </div>

            {/* Instructions to Patient */}
            <div>
              <label className="block font-black text-petrol-950 mb-1">Patient Instructions (comma separated)</label>
              <input
                type="text"
                value={instructionText}
                onChange={(e) => setInstructionText(e.target.value)}
                placeholder="e.g. Bring Yellow Card, Come with baby shawl"
                className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-peach-500"
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
                className="btn-tactile flex-1 py-3 rounded-xl bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs sm:text-sm shadow-peach"
              >
                Schedule Visit & Notify
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
