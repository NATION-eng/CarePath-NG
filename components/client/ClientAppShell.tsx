'use client';

import React, { useState } from 'react';
import { CareEvent, PatientProfile, SmsMessage } from '@/lib/types';
import { DigitalYellowCard } from './DigitalYellowCard';
import { FamilyProxyHub } from './FamilyProxyHub';
import { EmergencyHelper } from './EmergencyHelper';
import { AudioVoicePlayer } from '../AudioVoicePlayer';
import { BrandLogo } from '../BrandLogo';
import { playChime } from '@/lib/audioVoice';
import { 
  Heart, 
  Baby, 
  Users, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  Volume2, 
  Lock, 
  UserPlus, 
  CalendarPlus,
  AlertTriangle,
  QrCode,
  FileText,
  HeartHandshake
} from 'lucide-react';

interface ClientAppShellProps {
  patients: PatientProfile[];
  activePatient?: PatientProfile;
  events: CareEvent[];
  smsLog: SmsMessage[];
  onSelectPatient: (patientId: string) => void;
  onConfirmEvent: (eventId: string) => void;
  onOpenEventSheet: (event: CareEvent) => void;
  onOpenNewPatientModal: () => void;
  onOpenNewAppointmentModal: () => void;
  onBackToLanding: () => void;
  onOpenStaffGate: () => void;
}

export function ClientAppShell({
  patients,
  activePatient,
  events,
  smsLog,
  onSelectPatient,
  onConfirmEvent,
  onOpenEventSheet,
  onOpenNewPatientModal,
  onOpenNewAppointmentModal,
  onBackToLanding,
  onOpenStaffGate,
}: ClientAppShellProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'card' | 'family' | 'emergency'>('home');

  // Next active upcoming appointment (Live from database)
  const nextEvent = events.find((e) => e.status === 'scheduled' || e.status === 'confirmed');
  const isConfirmed = nextEvent?.status === 'confirmed';

  // If there are zero registered patients, show the clean Real-Time Readiness screen (ZERO PLACEHOLDERS)
  if (patients.length === 0) {
    return (
      <div className="min-h-screen w-full bg-surface-base text-surface-dark flex flex-col font-sans pb-24 md:pb-12 relative overflow-x-hidden">
        {/* Floating Ambient Radiant Light Orbs */}
        <div className="orb-glow bg-peach-500/15 w-[400px] h-[400px] top-10 -right-20 pointer-events-none fixed" />
        <div className="orb-glow bg-mint-500/15 w-[360px] h-[360px] bottom-20 -left-20 pointer-events-none fixed" />

        {/* 1. CLIENT HEADER */}
        <header className="sticky top-0 z-40 bg-petrol-900/85 backdrop-blur-xl border-b border-white/10 text-white shadow-card pt-safe">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={onBackToLanding}
                className="p-2 rounded-xl bg-petrol-800 text-petrol-200 hover:text-white hover:bg-petrol-750 transition-colors"
                title="Return to Public Website"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <BrandLogo size="sm" subtitle="Personal Care Companion" badge="Family Hub" onClick={onBackToLanding} />
            </div>

            <button
              type="button"
              onClick={onOpenNewPatientModal}
              className="btn-tactile px-3.5 sm:px-4 py-2 rounded-xl bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs shadow-peach flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ Create Account</span>
            </button>
          </div>
        </header>

        {/* Real-Time Database Ready State (Zero Dummy Placeholders) */}
        <main className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="h-16 w-16 rounded-3xl bg-petrol-900 border-2 border-petrol-700 text-peach-500 flex items-center justify-center shadow-card mb-5">
            <HeartHandshake className="h-8 w-8 stroke-[2.3]" />
          </div>

          <span className="text-xs font-black uppercase tracking-wider text-mint-900 bg-mint-100 px-3 py-1 rounded-full border border-mint-300 mb-3">
            Real-Time Clinical Registry Ready
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-petrol-950 tracking-tight mb-3">
            Awaiting Live Patient Registration
          </h2>

          <p className="text-sm sm:text-base text-surface-dark/70 font-semibold max-w-lg mx-auto mb-8 leading-relaxed">
            All placeholder subjects and dummy records have been cleared. Register yourself or a family dependent to begin tracking live maternal ANC milestones, child immunizations, and SMS continuity.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenNewPatientModal}
              className="btn-tactile w-full sm:w-auto px-7 py-3.5 rounded-full bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-sm shadow-peach flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register Patient / Family Account</span>
            </button>

            <button
              type="button"
              onClick={onBackToLanding}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-surface-base text-petrol-900 border-2 border-surface-border font-bold text-sm transition-colors"
            >
              Return to Website
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-surface-base text-surface-dark flex flex-col font-sans pb-28 md:pb-12 relative overflow-x-hidden">
      
      {/* Floating Ambient Radiant Light Orbs for Sophisticated Glass Feel */}
      <div className="orb-glow bg-peach-500/15 w-[400px] h-[400px] top-10 -right-20 pointer-events-none fixed" />
      <div className="orb-glow bg-mint-500/15 w-[360px] h-[360px] bottom-20 -left-20 pointer-events-none fixed" />

      {/* 1. CLIENT HEADER (FROSTED GLASS) */}
      <header className="sticky top-0 z-40 bg-petrol-900/85 backdrop-blur-xl border-b border-white/10 text-white shadow-card pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
          
          {/* Brand & Back Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToLanding}
              className="p-2 rounded-xl bg-petrol-800 text-petrol-200 hover:text-white hover:bg-petrol-750 transition-colors"
              title="Return to Landing Page"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <BrandLogo 
              size="sm" 
              subtitle="Personal Care Companion" 
              badge="Family Hub" 
              onClick={onBackToLanding} 
            />
          </div>

          {/* Center Family Profile Switcher Pill */}
          <div className="hidden lg:flex items-center gap-2 bg-petrol-950/80 px-3 py-1.5 rounded-full border border-petrol-700">
            <span className="text-xs text-petrol-200 font-medium">Active Dependent:</span>
            <select
              value={activePatient?.id || ''}
              onChange={(e) => onSelectPatient(e.target.value)}
              className="bg-transparent text-xs font-black text-peach-500 focus:outline-none cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id} className="bg-petrol-900 text-white">
                  {p.name} ({p.categoryLabel.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenNewPatientModal}
              className="btn-tactile hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-petrol-800 text-petrol-100 hover:text-white text-xs font-bold border border-petrol-700"
            >
              <UserPlus className="h-3.5 w-3.5 text-peach-500" />
              <span>+ Family Member</span>
            </button>

            <button
              type="button"
              onClick={onOpenStaffGate}
              className="btn-tactile px-3.5 py-1.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs shadow-peach flex items-center gap-1.5"
              title="Hospital Staff Workspace (Nurse Blessing Aliyu)"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>PHC Staff Gate</span>
            </button>
          </div>

        </div>

        {/* Desktop Tab Bar */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 border-t border-petrol-800/80 text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'border-peach-500 text-peach-500 bg-petrol-800/40'
                : 'border-transparent text-petrol-200 hover:text-white'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>My Care Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'card'
                ? 'border-peach-500 text-peach-500 bg-petrol-800/40'
                : 'border-transparent text-petrol-200 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Digital Yellow Card / ANC</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'family'
                ? 'border-peach-500 text-peach-500 bg-petrol-800/40'
                : 'border-transparent text-petrol-200 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Family Proxy Hub ({patients.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('emergency')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'emergency'
                ? 'border-peach-500 text-peach-500 bg-petrol-800/40'
                : 'border-transparent text-petrol-200 hover:text-white'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Emergency Red Flags</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN CLIENT CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        
        {/* TAB 1: HOME DASHBOARD */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Welcoming Patient Banner (Frosted Glass with Non-Squishing Avatar) */}
            <div className="glass-card rounded-3xl p-5 sm:p-6 border-2 border-surface-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 min-w-[3.5rem] min-h-[3.5rem] rounded-2xl bg-petrol-900 border-2 border-petrol-700 text-peach-500 font-black text-xl flex items-center justify-center shadow-card shrink-0">
                  {activePatient?.avatarInitials || 'CP'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-petrol-950">
                      Welcome, {activePatient?.name}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-mint-100 text-mint-900 border border-mint-300 shrink-0">
                      <ShieldCheck className="h-3 w-3 text-mint-600" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-petrol-700 font-bold mt-0.5">
                    {activePatient?.categoryLabel} • Stage: <strong>{activePatient?.stageInfo}</strong>
                  </p>
                </div>
              </div>

              {/* Mobile Profile Switcher Pill */}
              <div className="flex lg:hidden items-center gap-2 bg-surface-base p-2 rounded-2xl border border-surface-border w-full sm:w-auto">
                <span className="text-xs text-surface-dark/70 font-semibold">Dependent:</span>
                <select
                  value={activePatient?.id || ''}
                  onChange={(e) => onSelectPatient(e.target.value)}
                  className="bg-transparent text-xs font-black text-petrol-950 focus:outline-none flex-1"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* HERO "NEXT VISIT" APPOINTMENT CARD (SOPHISTICATED DARK GLASS) */}
            {nextEvent ? (
              <div className="glass-surface-dark text-white rounded-3xl p-6 sm:p-8 border-2 border-white/15 shadow-float relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-peach-500 text-petrol-950 shadow-xs">
                        {nextEvent.duePeriod || 'Next Clinical Milestone'}
                      </span>
                      <span className="text-xs text-mint-200 font-bold flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Scheduled: {nextEvent.date} at {nextEvent.time}</span>
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {nextEvent.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-petrol-100 font-medium">
                      Facility: <strong className="text-white font-bold">{nextEvent.facilityName}</strong> ({nextEvent.facilityAddress})
                    </p>

                    {/* Preparation Checklist */}
                    <div className="bg-petrol-950/70 p-3.5 rounded-2xl border border-petrol-800 text-xs space-y-1.5">
                      <p className="text-[11px] font-black uppercase tracking-wider text-peach-500">
                        What to Bring to the Clinic:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-petrol-100 font-semibold">
                        {nextEvent.instructions.map((ins, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-mint-400 shrink-0" />
                            <span>{ins}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Spoken Audio Voice Player */}
                    <div className="pt-1">
                      <AudioVoicePlayer
                        pidginText={nextEvent.pidginAudioText}
                        englishText={nextEvent.englishAudioText}
                        label="Play Spoken Clinic Reminder (Nigerian Pidgin)"
                      />
                    </div>
                  </div>

                  {/* Primary 1-Tap Client Action Buttons */}
                  <div className="flex flex-col gap-3 shrink-0 lg:w-64">
                    {!isConfirmed ? (
                      <button
                        type="button"
                        onClick={() => {
                          playChime('confirm');
                          onConfirmEvent(nextEvent.id);
                        }}
                        className="btn-tactile w-full py-3.5 px-4 rounded-2xl bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-sm shadow-peach flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        <span>I Will Attend</span>
                      </button>
                    ) : (
                      <div className="w-full py-3 px-4 rounded-2xl bg-mint-800 text-white font-black text-xs text-center border border-mint-600 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-mint-200" />
                        <span>Attendance Confirmed</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenEventSheet(nextEvent)}
                      className="w-full py-3 px-4 rounded-2xl bg-petrol-800 hover:bg-petrol-750 text-white font-black text-xs border border-petrol-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Clock className="h-4 w-4 text-peach-500" />
                      <span>Request Date Change</span>
                    </button>

                    <button
                      type="button"
                      onClick={onOpenNewAppointmentModal}
                      className="w-full py-2.5 px-4 rounded-2xl bg-petrol-950 hover:bg-black text-petrol-200 hover:text-white font-bold text-xs border border-petrol-800 transition-colors"
                    >
                      + Book Additional Visit
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border-2 border-surface-border text-center shadow-card">
                <CalendarPlus className="h-12 w-12 text-petrol-700 mx-auto mb-3" />
                <h3 className="text-xl font-black text-petrol-950">No Scheduled Appointments</h3>
                <p className="text-xs sm:text-sm text-surface-dark/70 font-semibold mb-5">
                  Book your next clinic review or child vaccination session at Garki PHC.
                </p>
                <button
                  type="button"
                  onClick={onOpenNewAppointmentModal}
                  className="btn-tactile px-6 py-3 rounded-2xl bg-petrol-900 text-white font-black text-sm"
                >
                  + Book Clinic Session
                </button>
              </div>
            )}

            {/* Quick Navigation Cards (Frosted Glass) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                onClick={() => setActiveTab('card')}
                className="glass-card p-5 rounded-3xl border-2 border-surface-border hover:border-petrol-700 transition-all cursor-pointer shadow-subtle group"
              >
                <div className="h-10 w-10 rounded-xl bg-mint-100 text-mint-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="text-base font-black text-petrol-950">Digital Yellow Card</h4>
                <p className="text-xs text-surface-dark/70 font-semibold mt-1">
                  View full NPHCDA immunisation roadmap and download your offline QR pass.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('family')}
                className="glass-card p-5 rounded-3xl border-2 border-surface-border hover:border-petrol-700 transition-all cursor-pointer shadow-subtle group"
              >
                <div className="h-10 w-10 rounded-xl bg-peach-100 text-peach-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <h4 className="text-base font-black text-petrol-950">Family Proxy Hub</h4>
                <p className="text-xs text-surface-dark/70 font-semibold mt-1">
                  Manage phone-less children and relatives with designated SMS notifications.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('emergency')}
                className="glass-card p-5 rounded-3xl border-2 border-surface-border hover:border-red-400 transition-all cursor-pointer shadow-subtle group"
              >
                <div className="h-10 w-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h4 className="text-base font-black text-petrol-950">Emergency & Red Flags</h4>
                <p className="text-xs text-surface-dark/70 font-semibold mt-1">
                  Clinical danger signs for pregnancy and babies + 1-tap call to Garki PHC.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DIGITAL YELLOW CARD & ANC PASSPORT */}
        {activeTab === 'card' && (
          <div className="animate-in fade-in duration-150">
            <DigitalYellowCard patient={activePatient} events={events} />
          </div>
        )}

        {/* TAB 3: FAMILY & PROXY HUB */}
        {activeTab === 'family' && (
          <div className="animate-in fade-in duration-150">
            <FamilyProxyHub 
              patients={patients}
              activePatient={activePatient}
              onSelectPatient={onSelectPatient}
              onOpenNewPatientModal={onOpenNewPatientModal}
            />
          </div>
        )}

        {/* TAB 4: EMERGENCY HELPLINES */}
        {activeTab === 'emergency' && (
          <div className="animate-in fade-in duration-150">
            <EmergencyHelper />
          </div>
        )}

      </main>

      {/* 3. UNIVERSAL MOBILE BOTTOM THUMB NAVIGATION (CLIENT APP) */}
      {/* 3. UNIVERSAL MOBILE BOTTOM THUMB NAVIGATION (FROSTED GLASS DOCK) */}
      <nav className="fixed md:hidden bottom-0 inset-x-0 bg-petrol-900/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around safe-bottom z-40 shadow-2xl text-white">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-black transition-all ${
            activeTab === 'home' ? 'text-peach-500 bg-white/10 shadow-xs' : 'text-petrol-200 hover:text-white'
          }`}
        >
          <Calendar className={`h-4.5 w-4.5 mb-0.5 ${activeTab === 'home' ? 'text-peach-500 stroke-[2.5]' : 'stroke-2'}`} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('card')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-black transition-all ${
            activeTab === 'card' ? 'text-peach-500 bg-white/10 shadow-xs' : 'text-petrol-200 hover:text-white'
          }`}
        >
          <FileText className={`h-4.5 w-4.5 mb-0.5 ${activeTab === 'card' ? 'text-peach-500 stroke-[2.5]' : 'stroke-2'}`} />
          <span>Card</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('family')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-black transition-all ${
            activeTab === 'family' ? 'text-peach-500 bg-white/10 shadow-xs' : 'text-petrol-200 hover:text-white'
          }`}
        >
          <Users className={`h-4.5 w-4.5 mb-0.5 ${activeTab === 'family' ? 'text-peach-500 stroke-[2.5]' : 'stroke-2'}`} />
          <span>Family ({patients.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emergency')}
          className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-black transition-all ${
            activeTab === 'emergency' ? 'text-red-400 bg-red-950/50 shadow-xs' : 'text-petrol-200 hover:text-white'
          }`}
        >
          <AlertTriangle className={`h-4.5 w-4.5 mb-0.5 ${activeTab === 'emergency' ? 'text-red-400 stroke-[2.5]' : 'stroke-2'}`} />
          <span>Alerts</span>
        </button>

        <button
          type="button"
          onClick={onBackToLanding}
          className="flex flex-col items-center py-1.5 px-2 rounded-xl text-[11px] font-bold text-petrol-200 hover:text-white transition-all"
          title="Return to Public Website"
        >
          <ArrowLeft className="h-4.5 w-4.5 mb-0.5 stroke-2 text-peach-500" />
          <span>Website</span>
        </button>
      </nav>

    </div>
  );
}
