'use client';

import React, { useState } from 'react';
import { 
  Baby, 
  Users, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  Volume2, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  PhoneCall, 
  Lock, 
  Building2, 
  HeartHandshake,
  UserPlus,
  Menu,
  Smartphone,
  X
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { AudioVoicePlayer } from '../AudioVoicePlayer';

interface LandingPageProps {
  onStartPatientApp: () => void;
  onCreateAccount: () => void;
  onBookAppointment: () => void;
  onOpenNursePortal: () => void;
  onOpenSmsSimulator: () => void;
}

export function LandingPage({
  onStartPatientApp,
  onCreateAccount,
  onBookAppointment,
  onOpenNursePortal,
  onOpenSmsSimulator,
}: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const careServices = [
    {
      title: "Primary & Maternal Care",
      subtitle: "Federal Antenatal (ANC) Journey",
      tag: "Maternal Health",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
      description: "WHO 8-contact schedule, ultrasound reminders, tetanus intervals, and birth preparedness guidance.",
    },
    {
      title: "Pediatric Immunisation",
      subtitle: "National Child Yellow Card",
      tag: "NPHCDA 2024",
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80",
      description: "Complete immunization tracking from at-birth BCG/OPV to 9-month Measles and Yellow Fever protection.",
    },
    {
      title: "Postnatal & Newborn Care",
      subtitle: "Maternal & Neonatal Follow-ups",
      tag: "Postnatal",
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
      description: "Vital 6-week infant growth monitoring, maternal recovery tracking, and exclusive breastfeeding support.",
    },
    {
      title: "Family Caregiver Proxy",
      subtitle: "Phone-Less Patient Support",
      tag: "Inclusion",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=600&q=80",
      description: "Allows a trusted daughter or spouse to manage care schedules for family members without smartphones.",
    },
    {
      title: "General & Chronic Health",
      subtitle: "Routine Checkups & Reviews",
      tag: "Continuity",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
      description: "Scheduled clinic reviews for hypertension, diabetes, and preventive consultations at primary health centres.",
    },
  ];

  const faqs = [
    {
      q: "Can a mother use CarePath NG if she does not own a smartphone?",
      a: "Yes! CarePath was specifically engineered around Nigeria's phone-less reality. An authorized family proxy (such as a daughter or spouse) can register the patient, and the platform delivers vital appointment reminders via discreet SMS directly to the caregiver's basic phone.",
    },
    {
      q: "Are the immunization schedules officially verified?",
      a: "Yes. All pediatric vaccination schedules follow the current Federal Ministry of Health and National Primary Health Care Development Agency (NPHCDA 2024) protocol, curated and approved by qualified clinicians.",
    },
    {
      q: "Does CarePath NG replace hospital consultations or diagnose illness?",
      a: "No. CarePath is strictly a healthcare continuity and coordination companion. It does not diagnose, prescribe medication, or replace medical personnel. It empowers patients and Primary Healthcare Centres to ensure no scheduled care milestone is missed.",
    },
    {
      q: "How does CarePath protect patient confidentiality under NDPA 2023?",
      a: "CarePath strictly complies with the Nigeria Data Protection Act 2023. Staff workspaces are role-protected with verified credentials, patient data is encrypted, and SMS reminders use discreet templates to safeguard privacy on shared household phones.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-surface-base text-surface-dark flex flex-col font-sans selection:bg-peach-200 selection:text-petrol-950 overflow-x-hidden">
      
      {/* 1. TOP HEADER / NAVBAR (FROSTED GLASS REFERENCE DESIGN) */}
      <header className="sticky top-0 z-40 bg-petrol-900/85 backdrop-blur-xl border-b border-white/10 text-white shadow-card transition-all pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          
          {/* Brand Logo with Two Hands Shaking Heart Emblem */}
          <BrandLogo 
            onClick={() => window.scrollTo(0, 0)} 
          />

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs lg:text-sm font-bold text-petrol-100">
            <a href="#about" className="hover:text-peach-500 transition-colors">About</a>
            <a href="#services" className="hover:text-peach-500 transition-colors">How We Help</a>
            <a href="#providers" className="hover:text-peach-500 transition-colors">Clinicians</a>
            <a href="#interactive-demo" className="hover:text-peach-500 transition-colors">Live Audio Demo</a>
            <a href="#faqs" className="hover:text-peach-500 transition-colors">FAQs</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onCreateAccount}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-peach-500/40 bg-peach-500/10 text-peach-300 hover:bg-peach-500/20 text-xs font-black transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5 text-peach-500" />
              <span>Create Account</span>
            </button>

            <button
              type="button"
              onClick={onOpenNursePortal}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-petrol-200 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Lock className="h-3.5 w-3.5 text-peach-500" />
              <span>PHC Staff Portal</span>
            </button>

            <button
              type="button"
              onClick={onBookAppointment}
              className="hidden md:flex btn-tactile px-5 lg:px-6 py-2.5 rounded-full bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs sm:text-sm shadow-peach transition-all transform hover:-translate-y-0.5 items-center gap-1.5 whitespace-nowrap"
            >
              <span>Book Appointment</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-petrol-800 text-peach-500 hover:text-white md:hidden border border-petrol-700 transition-colors shrink-0 shadow-sm flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-petrol-950/95 backdrop-blur-2xl border-b border-petrol-800 px-4 py-5 space-y-4 animate-in slide-in-from-top-3">
            <div className="grid grid-cols-2 gap-2.5 text-xs font-black">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onStartPatientApp();
                }}
                className="btn-tactile p-3.5 rounded-2xl bg-petrol-900 border border-petrol-750 text-peach-500 flex flex-col items-start gap-1.5 shadow-sm text-left"
              >
                <HeartHandshake className="h-5 w-5 text-peach-500" />
                <span className="text-white">Care Hub / Card</span>
                <span className="text-[10px] text-petrol-200 font-medium">Child Yellow Card & ANC</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenNursePortal();
                }}
                className="btn-tactile p-3.5 rounded-2xl bg-petrol-900 border border-petrol-750 text-white flex flex-col items-start gap-1.5 shadow-sm text-left"
              >
                <Lock className="h-5 w-5 text-peach-500" />
                <span className="text-white">PHC Staff Portal</span>
                <span className="text-[10px] text-petrol-200 font-medium">Hospital Nurse Login</span>
              </button>
            </div>

            <div className="space-y-1 pt-2 border-t border-petrol-800/80 text-xs font-bold text-petrol-200">
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl hover:bg-petrol-900 text-white transition-colors"
              >
                About Platform
              </a>
              <a
                href="#services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl hover:bg-petrol-900 text-white transition-colors"
              >
                Services (ANC & Pediatric Milestones)
              </a>
              <a
                href="#providers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl hover:bg-petrol-900 text-white transition-colors"
              >
                Clinicians & Garki PHC Staff
              </a>
              <a
                href="#interactive-demo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl hover:bg-petrol-900 text-white transition-colors"
              >
                Live Spoken Pidgin Audio Demo
              </a>
              <a
                href="#faqs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl hover:bg-petrol-900 text-white transition-colors"
              >
                Frequently Asked Questions
              </a>
            </div>

            <div className="pt-2 border-t border-petrol-800/80 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onBookAppointment();
                }}
                className="btn-tactile w-full py-3 rounded-xl bg-peach-500 text-petrol-950 font-black text-xs shadow-peach flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Clinic Appointment</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onCreateAccount();
                }}
                className="w-full py-3 rounded-xl bg-petrol-800 hover:bg-petrol-750 text-white font-bold text-xs border border-petrol-700 flex items-center justify-center gap-2 transition-colors"
              >
                <UserPlus className="h-4 w-4 text-peach-500" />
                <span>Create Family Account</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (EXACT REFERENCE: "Modern Care, Local Heart.") */}
      <section className="relative bg-petrol-900 text-white overflow-hidden py-12 sm:py-24 lg:py-32 border-b-2 border-petrol-800">
        
        {/* Floating Radiant Glass Orbs */}
        <div className="orb-glow bg-mint-500 w-[260px] sm:w-[420px] h-[260px] sm:h-[420px] -top-16 sm:-top-24 -left-16 sm:-left-20" />
        <div className="orb-glow bg-peach-500 w-[240px] sm:w-[380px] h-[240px] sm:h-[380px] top-1/2 -right-16 sm:-right-24" />

        {/* Subtle Decorative Clinical Motif Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <path d="M0,70 Q35,40 70,70 T100,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center z-10">
          
          {/* Eyebrow Pill with Custom Healthcare Emblem (NO STAR EMOJI) */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full glass-pill text-mint-200 text-[11px] sm:text-xs font-black mb-4 sm:mb-6 shadow-sm max-w-full">
            <HeartHandshake className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-peach-500 stroke-[2.5] shrink-0" />
            <span className="truncate">Family-Centred Healthcare Continuity for Nigeria</span>
          </div>

          {/* Main Headline (Exact words from reference) */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] mb-3 sm:mb-4">
            Modern Care, <br className="hidden sm:inline" />
            <span className="text-white">Local Heart.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-mint-200/90 tracking-wide max-w-2xl mx-auto mb-4 sm:mb-6">
            Your Wellness, Redefined.
          </p>

          <p className="text-xs sm:text-base text-petrol-100/90 font-medium max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            One connected place for pregnant mothers, newborns, and families to track clinical appointments, 
            vaccines, and spoken Pidgin reminders across Nigerian Primary Healthcare Centres.
          </p>

          {/* Center Peach Pill Button & Create Account CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto">
            <button
              type="button"
              onClick={onBookAppointment}
              className="btn-tactile w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs sm:text-sm tracking-wide shadow-peach transition-all transform hover:-translate-y-0.5 uppercase flex items-center justify-center gap-2"
            >
              <span>Book An Appointment</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              type="button"
              onClick={onCreateAccount}
              className="btn-tactile w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-petrol-800/90 hover:bg-petrol-750 text-white font-bold text-xs sm:text-sm border border-petrol-700/80 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <UserPlus className="h-4 w-4 text-peach-500" />
              <span>Create Family Account</span>
            </button>
          </div>

          {/* Proof Badges */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-petrol-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-bold text-petrol-200/90">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-mint-400 shrink-0" />
              <span>NPHCDA 2024 Protocol</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-peach-500 shrink-0" />
              <span>Spoken Pidgin Audio</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-mint-400 shrink-0" />
              <span>Phone-Less Proxy SMS</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-peach-500 shrink-0" />
              <span>100% Offline PWA Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: "WELCOME TO..." (EXACT REFERENCE DESIGN) */}
      <section id="about" className="relative py-20 lg:py-28 bg-surface-base border-b border-surface-border overflow-hidden">
        
        {/* Soft Ambient Light in Background */}
        <div className="orb-glow bg-mint-500/10 w-[350px] h-[350px] top-10 right-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-petrol-700 bg-mint-100 px-3 py-1 rounded-full border border-mint-200">
                  Welcome to
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-petrol-950 tracking-tight leading-tight mt-3">
                  CarePath NG
                </h2>
              </div>

              <p className="text-base sm:text-lg text-surface-dark/80 font-medium leading-relaxed">
                Empowering your family’s health through compassionate, continuous care — where clinical excellence 
                meets local access. We bridge primary health centres with mothers, caregivers, and families across 
                Nigeria with both in-person clinic follow-ups and resilient multi-channel reminders.
              </p>

              {/* Frosted Glass Reassurance Cards */}
              <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 min-w-[2rem] rounded-xl bg-mint-100 text-mint-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-petrol-950">Bridging the 2024 NDHS Vaccine Gap</h4>
                    <p className="text-xs text-surface-dark/70 font-semibold mt-0.5">
                      National data shows only 20% of children are fully vaccinated. CarePath keeps every milestone visible.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 min-w-[2rem] rounded-xl bg-peach-100 text-peach-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-petrol-950">Caregiver & Proxy-First Architecture</h4>
                    <p className="text-xs text-surface-dark/70 font-semibold mt-0.5">
                      Patients without phones receive timely reminders through designated family guardians and proxies.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onBookAppointment}
                  className="btn-tactile px-7 py-3.5 rounded-xl bg-petrol-900 hover:bg-petrol-950 text-white font-black text-sm shadow-card flex items-center gap-2"
                >
                  <span>Book An Appointment</span>
                  <ChevronRight className="h-4 w-4 text-peach-500" />
                </button>
              </div>
            </div>

            {/* Right Image Column (Doctors with chart from reference) */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-float border-4 border-white bg-petrol-900 glass-card">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80"
                  alt="Primary Healthcare Centre Clinicians"
                  className="w-full h-[400px] sm:h-[480px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 glass-panel rounded-2xl p-4 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-petrol-700 uppercase tracking-wider">Primary Facility Partner</p>
                      <h4 className="text-sm sm:text-base font-black text-petrol-950">Garki Primary Healthcare Centre</h4>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-mint-100 text-mint-900 border border-mint-300">
                      FCT-04 Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECTION 3: "HOW WE HELP" (5 FROSTED GLASS CARDS FROM REFERENCE) */}
      <section id="services" className="py-20 lg:py-28 bg-white border-b border-surface-border relative overflow-hidden">
        
        <div className="orb-glow bg-peach-500/10 w-[400px] h-[400px] bottom-10 left-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-petrol-950 tracking-tight mb-4">
            How We Help
          </h2>
          <p className="text-sm sm:text-base text-surface-dark/70 font-semibold max-w-2xl mx-auto mb-14">
            Structured, clinician-reviewed care continuity designed for Nigerian mothers, newborns, and family members.
          </p>

          {/* 5-Column Responsive Glass Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 text-left mb-12">
            {careServices.map((service, idx) => (
              <div 
                key={idx}
                className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-petrol-900">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-petrol-950/80 text-peach-500 backdrop-blur-xs border border-white/20">
                        {service.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-black text-petrol-950 group-hover:text-petrol-700 transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs font-bold text-mint-700 mt-0.5 mb-2">
                      {service.subtitle}
                    </p>
                    <p className="text-xs text-surface-dark/70 font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={onStartPatientApp}
                    className="w-full py-2.5 rounded-xl bg-surface-base hover:bg-petrol-900 hover:text-white border border-surface-border text-xs font-black text-petrol-900 transition-all flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Manage Journey</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onStartPatientApp}
            className="btn-tactile px-8 py-3.5 rounded-full bg-petrol-900 hover:bg-petrol-950 text-white font-black text-sm shadow-card inline-flex items-center gap-2"
          >
            <span>View All Care Pathways</span>
            <ArrowRight className="h-4 w-4 text-peach-500" />
          </button>
        </div>
      </section>

      {/* 5. SECTION 4: "MEET YOUR PROVIDERS" (FIXED: FEMALE CLINICIAN FOR NURSE BLESSING) */}
      <section id="providers" className="relative py-20 lg:py-28 bg-petrol-900 text-white border-b-2 border-petrol-800 overflow-hidden">
        
        {/* Ambient Glow Orbs */}
        <div className="orb-glow bg-peach-500/20 w-[450px] h-[450px] top-10 left-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Doctor Photo: FEMALE CLINICIAN FOR NURSE BLESSING ALIYU */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-float border-4 border-white/20 bg-petrol-950 glass-card">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"
                  alt="Nurse Blessing Aliyu - Senior Community Health Officer"
                  className="w-full h-[420px] sm:h-[480px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 glass-dark rounded-2xl p-4 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 min-w-[2.5rem] rounded-xl bg-peach-500 text-petrol-950 font-black flex items-center justify-center shrink-0">
                      CHO
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white">Nurse Blessing Aliyu (Senior CHO)</h4>
                      <p className="text-xs text-petrol-200">Garki Primary Health Centre • FCT Abuja</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Text Column (Why Choose Us) */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-peach-500 bg-petrol-800/80 px-3 py-1 rounded-full border border-petrol-700">
                  Garki PHC & National Clinics
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mt-3">
                  Meet Your Providers
                </h2>
              </div>

              <p className="text-base text-petrol-100 font-medium leading-relaxed">
                Our platform brings clinical continuity across primary healthcare centres, antenatal wards, 
                and pediatric clinics. We are here to listen, support, and walk with Nigerian families every 
                step of the way — ensuring every immunization dose and ANC milestone is safely administered.
              </p>

              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-peach-500 mb-3">
                  Why Choose CarePath NG?
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-petrol-100 font-semibold">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-peach-500 shrink-0" />
                    <span>Same-day clinical appointments & follow-up coordination</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-peach-500 shrink-0" />
                    <span>Spoken reminders in Nigerian Pidgin & English for low-literacy inclusion</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-peach-500 shrink-0" />
                    <span>Proxy notification routing for phone-less mothers and elderly dependents</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-peach-500 shrink-0" />
                    <span>Trusted, NPHCDA 2024 and FMOH verified care schedules</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onOpenNursePortal}
                  className="btn-tactile px-8 py-3.5 rounded-full bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-sm shadow-peach uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE COMPETITION DEMO (AUDIO & SMS PLAYGROUND) */}
      <section id="interactive-demo" className="py-20 bg-surface-base border-b border-surface-border relative overflow-hidden">
        
        <div className="orb-glow bg-mint-500/10 w-[380px] h-[380px] top-1/2 left-1/2 -translate-x-1/2" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 z-10">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-petrol-700 bg-mint-100 px-3 py-1 rounded-full border border-mint-200">
              Interactive Competition Demo
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-petrol-950 tracking-tight mt-2">
              Experience the Continuity Engine
            </h2>
            <p className="text-xs sm:text-sm text-surface-dark/70 font-semibold mt-1">
              Test the voice reminder and discreet SMS technology built for low-literacy and shared phone inclusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Spoken Voice Note Demo Card */}
            <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-petrol-900 font-black text-sm mb-2">
                  <Volume2 className="h-5 w-5 text-peach-500" />
                  <span>Spoken Voice Reminder (Nigerian Pidgin)</span>
                </div>
                <p className="text-xs text-surface-dark/70 font-medium mb-4">
                  Delivered for mothers who cannot comfortably read long text. Tap play to test:
                </p>
                <AudioVoicePlayer
                  pidginText="Good day! Na reminder say your baby 6-week immunization dey come up this Thursday for Garki PHC by 9 in the morning. Carry your yellow card come. If you go fit come, reply 1. Thank you!"
                  englishText="Good day. This is a reminder for your baby's 6-week immunisation session at Garki Primary Healthcare Centre scheduled for Thursday at 09:00 AM. Please bring your yellow card."
                  label="Play Clinic Audio Reminder"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs font-bold text-petrol-700">
                <span>Language: Nigerian Pidgin / English</span>
                <span className="text-mint-700 font-black flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Offline Cached</span>
                </span>
              </div>
            </div>

            {/* Discreet SMS Demo Card */}
            <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-petrol-900 font-black text-sm mb-2">
                  <MessageSquare className="h-5 w-5 text-peach-500" />
                  <span>Discreet SMS for Shared Household Phones</span>
                </div>
                <p className="text-xs text-surface-dark/70 font-medium mb-3">
                  Protects patient privacy on shared devices by omitting sensitive diagnoses:
                </p>

                <div className="bg-petrol-950 text-white rounded-2xl p-4 font-mono text-xs space-y-2 border border-petrol-800 shadow-card">
                  <div className="flex justify-between text-[11px] text-peach-500 font-bold border-b border-petrol-800 pb-1">
                    <span>CAREPATH-NG</span>
                    <span>MTN DND Whitelisted</span>
                  </div>
                  <p className="leading-relaxed text-petrol-100">
                    &quot;CarePath: Clinic milestone visit scheduled at Garki PHC. Reply 1 to Confirm Attendance or 2 to Reschedule.&quot;
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={onOpenSmsSimulator}
                  className="w-full py-2.5 rounded-xl bg-petrol-50 hover:bg-petrol-100 text-petrol-900 font-black text-xs border border-petrol-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-petrol-700" />
                  <span>Open Full SMS Telephony Simulator</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FAQS SECTION */}
      <section id="faqs" className="py-20 bg-white border-b border-surface-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-petrol-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-surface-dark/70 font-semibold mt-1">
              Everything you need to know about the CarePath NG continuity platform.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="glass-card rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-black text-sm sm:text-base text-petrol-950 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronRight 
                    className={`h-5 w-5 text-peach-500 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-surface-dark/80 font-medium leading-relaxed border-t border-surface-border/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-petrol-950 text-white py-12 pb-28 md:pb-12 border-t-2 border-petrol-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-petrol-900">
            
            <BrandLogo subtitle="Nigerian Maternal, Child & Family Healthcare Continuity" />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onStartPatientApp}
                className="btn-tactile px-5 py-2.5 rounded-full bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs shadow-peach"
              >
                Launch Patient App
              </button>

              <button
                type="button"
                onClick={onOpenNursePortal}
                className="px-5 py-2.5 rounded-full bg-petrol-900 hover:bg-petrol-850 text-white font-black text-xs border border-petrol-800"
              >
                PHC Staff Login
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-petrol-200 font-medium">
            <p>© 2026 CarePath NG. Compliant with Nigeria Data Protection Act (NDPA 2023).</p>
            <div className="flex gap-4">
              <span>National Health Registry</span>
              <span>•</span>
              <span>Primary Healthcare Continuity</span>
              <span>•</span>
              <span>Garki PHC (FCT-04)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. MOBILE BOTTOM THUMB DOCK (SLEEK NATIVE PWA TAB BAR) */}
      <nav 
        className="fixed md:hidden bottom-0 inset-x-0 z-40 bg-petrol-950/90 backdrop-blur-2xl border-t border-white/10 px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl grid grid-cols-3 gap-2"
        aria-label="Mobile Navigation"
      >
        <button
          type="button"
          onClick={onBookAppointment}
          className="btn-tactile flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-peach-500 text-petrol-950 font-black text-[11px] shadow-peach transition-all"
        >
          <Calendar className="h-4.5 w-4.5 mb-0.5 shrink-0" />
          <span>Book Visit</span>
        </button>

        <button
          type="button"
          onClick={onStartPatientApp}
          className="btn-tactile flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-petrol-900/90 hover:bg-petrol-850 text-white font-bold text-[11px] border border-white/10 transition-all"
        >
          <HeartHandshake className="h-4.5 w-4.5 mb-0.5 text-peach-500 shrink-0" />
          <span>Care Hub</span>
        </button>

        <button
          type="button"
          onClick={onOpenNursePortal}
          className="btn-tactile flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-petrol-900/90 hover:bg-petrol-850 text-petrol-200 hover:text-white font-bold text-[11px] border border-white/10 transition-all"
          title="Hospital Staff Gate"
        >
          <Lock className="h-4.5 w-4.5 mb-0.5 text-peach-500 shrink-0" />
          <span>Staff Gate</span>
        </button>
      </nav>

    </div>
  );
}
