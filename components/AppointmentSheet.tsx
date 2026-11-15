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
  Trash2,
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
  onDeleteEvent?: (eventId: string) => void;
}

export function AppointmentSheet({
  event,
  patient,
  isOpen,
  onClose,
  onConfirm,
  onReschedule,
  onDispatchReminder,
  onDeleteEvent,
}: AppointmentSheetProps) {
  const dynamicOptions = [3, 7, 10, 14].map((days) => {
    const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  });

  const [showReschedulePicker, setShowReschedulePicker] = useState(false);
  const [selectedRescheduleDate, setSelectedRescheduleDate] = useState(dynamicOptions[1]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    playChime('confirm');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0C2B3A', '#F3A68F', '#2E8B7B', '#FFFFFF']
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
              <span className="text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-mint-100 text-mint-900 border border-mint-300">
                {event.duePeriod}
              </span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  isConfirmed
                    ? 'bg-mint-100 text-mint-900 border border-mint-300'
                    : 'bg-peach-100 text-petrol-950 border border-peach-300'
                }`}
              >
                {isConfirmed ? '● Confirmed Attendance' : '○ Scheduled'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-petrol-950 leading-tight">
              {event.title}
            </h2>
            <p className="text-sm text-surface-dark/80 font-bold mt-1">
              Patient: <strong className="text-petrol-900 font-black">{patient.name}</strong> ({patient.code})
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
            <div className="flex items-center gap-2 text-peach-600 font-extrabold mb-1">
              <Calendar className="h-4 w-4" />
              <span>Date & Time</span>
            </div>
            <p className="font-black text-petrol-950 text-base">{event.date}</p>
            <p className="text-xs font-bold text-surface-dark/70">{event.time}</p>
          </div>

          <div className="rounded-2xl border-2 border-surface-border bg-surface-base p-3.5">
            <div className="flex items-center gap-2 text-peach-600 font-extrabold mb-1">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
            <p className="font-black text-petrol-950 text-base truncate">{event.facilityName}</p>
            <p className="text-xs font-bold text-surface-dark/70 truncate">{event.facilityAddress}</p>
          </div>
        </div>

        {/* Clinician in charge */}
        <div className="flex items-center justify-between text-xs sm:text-sm rounded-2xl bg-peach-50/70 border-2 border-peach-200 p-3.5 mb-5">
          <div className="flex items-center gap-2.5">
            <UserCheck className="h-5 w-5 text-peach-600" />
            <div>
              <p className="font-black text-petrol-950 text-sm sm:text-base">{event.clinicianName}</p>
              <p className="text-xs font-bold text-petrol-800">{event.clinicianRole}</p>
            </div>
          </div>
          <span className="text-xs font-black text-petrol-950 bg-white px-2.5 py-1 rounded-md border border-peach-200">
            NPHCDA Verified
          </span>
        </div>

        {/* Clinical Preparation Checklist */}
        <div className="mb-5">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-petrol-950 mb-2.5">
            What to Bring & Preparation Checklist
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-surface-dark font-semibold">
            {event.instructions.map((ins, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-surface-base p-3 rounded-xl border border-surface-border">
                <CheckCircle2 className="h-4 w-4 text-mint-700 mt-0.5 shrink-0" />
                <span>{ins}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Vaccines / Procedures if applicable */}
        {event.vaccines && event.vaccines.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-petrol-950 mb-2.5">
              Scheduled Antigens (NPHCDA 2024 Protocol)
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.vaccines.map((vax, idx) => (
                <span
                  key={idx}
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-xl bg-mint-50 text-mint-950 font-bold border border-mint-200 flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-mint-700 shrink-0" />
                  <span>{vax}</span>
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
        <div className="rounded-2xl border-2 border-petrol-800 bg-petrol-900 text-white p-4 mb-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-black text-peach-500 text-sm mb-1.5">
            <PhoneForwarded className="h-4 w-4 text-peach-500" />
            <span>Proxy Notification Routing</span>
            <ShieldCheck className="h-4 w-4 text-mint-400 ml-auto" />
          </div>
          <p className="text-white/90 leading-relaxed text-xs sm:text-sm font-medium">
            Patient: <strong className="text-white font-black">{patient.name}</strong> ({patient.phoneOwnedByPatient ? 'Owns phone' : 'No personal phone'}).
            <br />
            Notification Target: <strong className="text-peach-200 font-bold">{patient.notificationContact.name}</strong> ({patient.notificationContact.phone}).
          </p>
          <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-white/80 font-bold">
            <span>Route: Direct MTN Transactional DND</span>
            <span className="text-mint-400 font-black">● Confirmed Delivered</span>
          </div>
        </div>

        {/* Reschedule Picker Modal View */}
        {showReschedulePicker && (
          <div className="rounded-2xl border-2 border-peach-300 bg-peach-50 p-4 mb-5 animate-in fade-in duration-150">
            <h4 className="text-sm font-black text-petrol-950 mb-1.5">Choose New Clinic Date</h4>
            <p className="text-xs font-semibold text-petrol-800 mb-3">
              The Care Continuity Engine will reschedule this session and update SMS notifications.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {dynamicOptions.map((dateOption) => (
                <button
                  key={dateOption}
                  type="button"
                  onClick={() => setSelectedRescheduleDate(dateOption)}
                  className={`text-xs sm:text-sm p-2.5 rounded-xl text-left border-2 font-black transition-all ${
                    selectedRescheduleDate === dateOption
                      ? 'bg-petrol-900 text-white border-petrol-900 shadow-xs'
                      : 'bg-white text-surface-dark border-peach-200 hover:border-peach-400'
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
                className="px-3.5 py-2 text-xs sm:text-sm text-petrol-950 font-bold hover:underline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRescheduleSubmit}
                className="btn-tactile px-4 py-2 bg-peach-500 text-petrol-950 rounded-xl text-xs sm:text-sm font-black shadow-peach hover:bg-peach-600"
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
                className="btn-tactile flex items-center justify-center gap-2 rounded-xl bg-peach-500 py-3.5 px-4 font-black text-sm text-petrol-950 shadow-peach hover:bg-peach-600 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Confirm Attendance</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 rounded-xl bg-mint-700 py-3.5 px-4 font-black text-sm text-white opacity-90 cursor-default"
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
              <Calendar className="h-5 w-5 text-peach-600" />
              <span>Reschedule</span>
            </button>
          </div>

          {/* Outbound SMS Dispatch */}
          <button
            type="button"
            onClick={() => onDispatchReminder(event.id)}
            className="btn-tactile flex items-center justify-center gap-2 rounded-xl border-2 border-surface-border bg-surface-base py-3 px-4 font-extrabold text-xs sm:text-sm text-petrol-950 hover:bg-surface-muted transition-colors"
          >
            <Send className="h-4 w-4 text-peach-600" />
            <span>Dispatch Reminder SMS Now</span>
          </button>

          {/* Delete Visit Record */}
          {onDeleteEvent && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete this clinical record: "${event.title}"?`)) {
                  onDeleteEvent(event.id);
                  onClose();
                }
              }}
              className="btn-tactile flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 py-2.5 px-4 font-bold text-xs sm:text-sm text-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
              <span>Delete Visit Record</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
