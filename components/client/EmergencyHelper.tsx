'use client';

import React from 'react';
import { 
  AlertTriangle, 
  PhoneCall, 
  Building2, 
  ShieldAlert, 
  HeartHandshake, 
  CheckCircle2, 
  Baby, 
  Heart,
  ChevronRight
} from 'lucide-react';

export function EmergencyHelper() {
  const pregnancyRedFlags = [
    "Vaginal bleeding or fluid leaking before labor",
    "Severe headache with blurred or dim vision",
    "Sudden extreme swelling of face, hands, or feet",
    "High fever, chills, or persistent vomiting",
    "Noticeable decrease or absence of baby movements",
  ];

  const infantRedFlags = [
    "High body fever (> 38°C) or baby feeling unusually cold",
    "Refusal to feed, breastfeed, or vomiting everything",
    "Fast breathing (> 60 breaths/min) or chest drawing in",
    "Convulsions, fits, or extreme lethargy / unconsciousness",
    "Yellow skin/eyes (jaundice) or foul-smelling umbilical cord",
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Hero Warning Card */}
      <div className="bg-red-950 text-white rounded-3xl p-6 sm:p-7 border-2 border-red-800 shadow-float">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/80 text-peach-200 text-xs font-black border border-red-700">
              <ShieldAlert className="h-3.5 w-3.5 text-peach-500" />
              <span>Immediate Clinical Action Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Emergency Helplines & Danger Signs
            </h2>
            <p className="text-xs sm:text-sm text-red-200/90 leading-relaxed font-medium">
              CarePath NG is a care continuity platform, not an emergency response service. If you or your 
              child experience any of the danger signs below, seek immediate care at Garki PHC or call the emergency numbers below.
            </p>
          </div>

          {/* Quick Dial Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <a
              href="tel:112"
              className="btn-tactile px-5 py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs sm:text-sm shadow-peach flex items-center justify-center gap-2"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call Emergency (112)</span>
            </a>

            <a
              href="tel:+2348030000000"
              className="px-5 py-3 rounded-2xl bg-petrol-900 hover:bg-petrol-850 text-white font-black text-xs sm:text-sm border-2 border-petrol-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Building2 className="h-4 w-4 text-peach-500" />
              <span>Garki PHC Triage Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Danger Signs Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pregnancy Red Flags */}
        <div className="bg-white rounded-3xl p-6 border-2 border-surface-border shadow-card">
          <div className="flex items-center gap-2.5 mb-4 text-petrol-950">
            <div className="h-10 w-10 rounded-xl bg-peach-100 text-peach-700 flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black">Pregnancy & ANC Danger Signs</h3>
              <p className="text-xs text-surface-dark/70 font-semibold">Immediate hospital visit required if present</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-surface-dark font-semibold">
            {pregnancyRedFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-base border border-surface-border">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Infant Red Flags */}
        <div className="bg-white rounded-3xl p-6 border-2 border-surface-border shadow-card">
          <div className="flex items-center gap-2.5 mb-4 text-petrol-950">
            <div className="h-10 w-10 rounded-xl bg-mint-100 text-mint-900 flex items-center justify-center shrink-0">
              <Baby className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black">Newborn & Infant Danger Signs</h3>
              <p className="text-xs text-surface-dark/70 font-semibold">National integrated childhood illness alerts</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-surface-dark font-semibold">
            {infantRedFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-base border border-surface-border">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Facility Location Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-surface-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-petrol-700 bg-mint-100 px-2.5 py-0.5 rounded-full border border-mint-200">
            Nearest Primary Centre
          </span>
          <h4 className="text-base sm:text-lg font-black text-petrol-950 mt-1">Garki Primary Healthcare Centre</h4>
          <p className="text-xs sm:text-sm text-surface-dark/70 font-semibold">Area 10, Garki, Abuja FCT • 24/7 Maternity & Emergency Ward</p>
        </div>

        <a
          href="https://maps.google.com/?q=Garki+Primary+Healthcare+Centre+Abuja"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-tactile px-5 py-2.5 rounded-xl bg-petrol-900 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <span>Get Directions</span>
          <ChevronRight className="h-4 w-4 text-peach-500" />
        </a>
      </div>

    </div>
  );
}
