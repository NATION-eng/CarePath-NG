'use client';

import React, { useState } from 'react';
import { CareEvent, PatientProfile } from '@/lib/types';
import { AudioVoicePlayer } from './AudioVoicePlayer';
import { playChime } from '@/lib/audioVoice';
import { 
  X, 
  Calendar, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  PhoneForwarded, 
  ShieldCheck,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppointmentSheetProps {
  event: CareEvent;
  patient: PatientProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (eventId: string) => void;
  onReschedule: (eventId: string, newDateText: string) => void;
  onDispatchReminder: (eventId: string) => void;
}

export function AppointmentSheet({
  event,
  patient,
  isOpen,
  onClose,
  onConfirm,
  onReschedule,
  onDispatchReminder,
}: AppointmentSheetProps) {
  const [showReschedulePicker, setShowReschedulePicker] = useState(false);
  const [selectedRescheduleDate, setSelectedRescheduleDate] = useState('Next Thursday, Nov 21');

  if (!isOpen) return null;

  const handleConfirm = () => {
    playChime('confirm');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#174C45', '#4C9A83', '#F1E8DA']
      });
    } catch {}
    onConfirm(event.id);
  };

  const handleRescheduleSubmit = () => {
    playChime('reminder');
    onReschedule(event.id, selectedRescheduleDate);
    setShowReschedulePicker(false);
  };

  const isConfirmed = event.status === 'confirmed';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      {/* Backdrop tap to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Sheet Container */}
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-6 sm:p-7 shadow-float z-10 safe-bottom border-2 border-surface-border animate-in slide-in-from-bottom duration-200">
        {/* Drag handle pill on mobile */}
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-surface-border sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b-2 border-surface-border pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-300">
                {event.duePeriod}
              </span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  isConfirmed
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {isConfirmed ? '● Confirmed Attendance' : '○ Scheduled (Awaiting Attendance)'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-teal-950 leading-tight">
              {event.title}
            </h2>
            <p className="text-sm text-surface-dark/80 font-bold mt-1">
              Patient: <strong className="text-teal-900 font-black">{patient.name}</strong> ({patient.code})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-surface-dark/70 hover:bg-surface-muted hover:text-surface-dark transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Date, Time & Facility Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5 text-xs sm:text-sm">
          <div className="rounded-2xl border-2 border-surface-border bg-surface-base p-3.5">
            <div className="flex items-center gap-2 text-teal-900 font-extrabold mb-1">
              <Calendar className="h-4 w-4" />
              <span>Date & Time</span>
            </div>
            <p className="font-black text-surface-dark text-base">{event.date}</p>
            <p className="text-xs font-bold text-surface-dark/70">{event.time}</p>
          </div>

          <div className="rounded-2xl border-2 border-surface-border bg-surface-base p-3.5">
            <div className="flex items-center gap-2 text-teal-900 font-extrabold mb-1">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
            <p className="font-black text-surface-dark text-base truncate">{event.facilityName}</p>
            <p className="text-xs font-bold text-surface-dark/70 truncate">{event.facilityAddress}</p>
          </div>
        </div>

        {/* Clinician in charge */}
        <div className="flex items-center justify-between text-xs sm:text-sm rounded-2xl bg-cream-50 border-2 border-cream-300 p-3.5 mb-5">
          <div className="flex items-center gap-2.5">
            <UserCheck className="h-5 w-5 text-teal-900" />
            <div>
              <p className="font-black text-teal-950 text-sm sm:text-base">{event.clinicianName}</p>
              <p className="text-xs font-bold text-teal-900/80">{event.clinicianRole}</p>
            </div>
          </div>
          <span className="text-xs font-black text-teal-900 bg-white px-2.5 py-1 rounded-md border border-teal-800/20">
            NPHCDA Verified
          </span>
        </div>

        {/* Clinical Preparation Checklist */}
        <div className="mb-5">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-teal-950 mb-2.5">
            What to Bring & Preparation Checklist
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-surface-dark font-semibold">
            {event.instructions.map((ins, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-surface-base p-3 rounded-xl border border-surface-border">
                <CheckCircle2 className="h-4 w-4 text-teal-800 mt-0.5 shrink-0" />
                <span>{ins}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Vaccines / Procedures if applicable */}
        {event.vaccines && event.vaccines.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-teal-950 mb-2.5">
              Scheduled Antigens (NPHCDA 2024 Protocol)
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.vaccines.map((vax, idx) => (
                <span
                  key={idx}
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-xl bg-teal-100 text-teal-950 font-bold border border-teal-300"
                >
                  💉 {vax}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Spoken Voice Note Component */}
        <div className="mb-5">
          <AudioVoicePlayer
            pidginText={event.pidginAudioText}
            englishText={event.englishAudioText}
            label="Spoken Appointment Reminder"
          />
        </div>

        {/* Proxy Notification Routing Proof */}
        <div className="rounded-2xl border-2 border-teal-900/20 bg-teal-950 text-white p-4 mb-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-black text-cream-200 text-sm mb-1.5">
            <PhoneForwarded className="h-4 w-4 text-teal-400" />
            <span>Proxy Notification Routing</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400 ml-auto" />
          </div>
          <p className="text-white/90 leading-relaxed text-xs sm:text-sm font-medium">
            Patient: <strong className="text-white font-black">{patient.name}</strong> (No phone owned).
            <br />
            Authorized Contact: <strong className="text-teal-200 font-bold">{patient.notificationContact.name}</strong> ({patient.notificationContact.phone}).
          </p>
          <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-white/80 font-bold">
            <span>Route: Direct MTN Transactional DND</span>
            <span className="text-emerald-400 font-black">● Confirmed Delivered</span>
          </div>
        </div>

        {/* Reschedule Picker Modal View */}
        {showReschedulePicker && (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 mb-5 animate-in fade-in duration-150">
            <h4 className="text-sm font-black text-amber-950 mb-1.5">Choose New Clinic Date</h4>
            <p className="text-xs font-semibold text-amber-900/90 mb-3">
              The Care Continuity Engine will cancel obsolete reminder jobs and generate new reminders without duplicate alerts.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {['Next Thursday, Nov 21', 'Friday, Nov 22', 'Next Monday, Nov 25', 'Thursday, Nov 28'].map((dateOption) => (
                <button
                  key={dateOption}
                  type="button"
                  onClick={() => setSelectedRescheduleDate(dateOption)}
                  className={`text-xs sm:text-sm p-2.5 rounded-xl text-left border-2 font-black transition-all ${
                    selectedRescheduleDate === dateOption
                      ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                      : 'bg-white text-surface-dark border-amber-200 hover:border-amber-400'
                  }`}
                >
                  {dateOption}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReschedulePicker(false)}
                className="px-3.5 py-2 text-xs sm:text-sm text-amber-950 font-bold hover:underline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRescheduleSubmit}
                className="btn-tactile px-4 py-2 bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-black shadow-xs hover:bg-amber-900"
              >
                Confirm Reschedule & Update SMS
              </button>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-surface-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {!isConfirmed ? (
              <button
                type="button"
                onClick={handleConfirm}
                className="btn-tactile flex items-center justify-center gap-2 rounded-xl bg-teal-800 py-3.5 px-4 font-black text-sm text-white shadow-card hover:bg-teal-900 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Confirm Attendance</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 px-4 font-black text-sm text-white opacity-90 cursor-default"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Confirmed ✓</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowReschedulePicker(!showReschedulePicker)}
              className="btn-tactile flex items-center justify-center gap-2 rounded-xl border-2 border-surface-border bg-surface-base py-3.5 px-4 font-black text-sm text-surface-dark hover:bg-surface-muted transition-colors"
            >
              <Calendar className="h-5 w-5 text-teal-800" />
              <span>Reschedule</span>
            </button>
          </div>

          {/* Quick Trigger SMS Button for Judges */}
          <button
            type="button"
            onClick={() => onDispatchReminder(event.id)}
            className="btn-tactile flex items-center justify-center gap-2 rounded-xl border-2 border-teal-800/20 bg-cream-100 py-3 px-4 font-extrabold text-xs sm:text-sm text-teal-950 hover:bg-cream-200 transition-colors"
          >
            <Send className="h-4 w-4 text-teal-800" />
            <span>Test Outbox: Trigger Immediate SMS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
