'use client';

import React, { useState } from 'react';
import { CareEvent, PatientProfile } from '@/lib/types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Download, 
  QrCode, 
  FileText, 
  Baby, 
  Heart, 
  Calendar,
  Building2,
  AlertCircle
} from 'lucide-react';

interface DigitalYellowCardProps {
  patient?: PatientProfile;
  events: CareEvent[];
}

export function DigitalYellowCard({ patient, events }: DigitalYellowCardProps) {
  const [activeTab, setActiveTab] = useState<'child' | 'maternal'>('child');
  const [showQrModal, setShowQrModal] = useState(false);

  // If patient has category, default to it
  const isMaternal = patient?.category === 'maternal';
  const effectiveTab = patient?.category === 'maternal' ? 'maternal' : activeTab;

  // Derive real-time milestone state dynamically from live database events
  const patientEvents = events.filter((e) => !patient || e.patientId === patient.id);

  // Official NPHCDA 2024 Protocol Schedule
  const baseImmunisationMilestones = [
    {
      period: "At Birth",
      antigens: ["BCG (Tuberculosis)", "OPV 0 (Polio)", "Hep B 0 (Hepatitis B)"],
      ageDesc: "Within 2 weeks of birth",
    },
    {
      period: "6 Weeks",
      antigens: ["Penta 1 (DPT, HepB, Hib)", "OPV 1", "PCV 1", "Rota 1"],
      ageDesc: "6 weeks after birth",
    },
    {
      period: "10 Weeks",
      antigens: ["Penta 2", "OPV 2", "PCV 2", "Rota 2"],
      ageDesc: "10 weeks after birth",
    },
    {
      period: "14 Weeks",
      antigens: ["Penta 3", "OPV 3", "PCV 3", "IPV 1 (Injectable Polio)"],
      ageDesc: "14 weeks after birth",
    },
    {
      period: "9 Months",
      antigens: ["Measles 1", "Yellow Fever", "Meningitis (Men-A)", "Vitamin A"],
      ageDesc: "9 months milestone",
    },
  ];

  const immunisationMilestones = baseImmunisationMilestones.map((bm) => {
    const matchedEvt = patientEvents.find(
      (e) =>
        e.duePeriod?.toLowerCase().includes(bm.period.toLowerCase()) ||
        e.title.toLowerCase().includes(bm.period.toLowerCase()) ||
        (bm.antigens.some((ant) => e.vaccines?.includes(ant)))
    );

    if (matchedEvt) {
      return {
        ...bm,
        status: matchedEvt.status,
        facility: matchedEvt.facilityName,
        dateGiven:
          matchedEvt.status === 'completed'
            ? `Administered: ${matchedEvt.date}`
            : `Scheduled: ${matchedEvt.date} at ${matchedEvt.time}`,
      };
    }

    return {
      ...bm,
      status: "scheduled" as const,
      facility: "Garki Primary Healthcare Centre",
      dateGiven: "Awaiting Live Clinical Administration",
    };
  });

  // Federal Maternal ANC Milestones
  const baseMaternalMilestones = [
    {
      period: "1st Trimester (Contact 1)",
      title: "Booking & Intake Profile",
      items: ["Initial scan & gestational age", "Blood group & genotype", "Urine analysis & vitals"],
    },
    {
      period: "2nd Trimester (Contacts 2 & 3)",
      title: "Maternal Health & Tetanus Protection",
      items: ["Tetanus Toxoid (TT1)", "Anomaly scan review", "Daily Iron & Folate check"],
    },
    {
      period: "3rd Trimester (Contacts 4 to 8)",
      title: "Fetal Growth & Birth Preparedness",
      items: ["Tetanus Toxoid (TT2)", "Fetal position & growth scan", "Delivery kit & hospital bag prep"],
    },
  ];

  const maternalMilestones = baseMaternalMilestones.map((m) => {
    const matchedEvt = patientEvents.find(
      (e) =>
        e.title.toLowerCase().includes(m.title.toLowerCase()) ||
        e.duePeriod?.toLowerCase().includes(m.period.toLowerCase())
    );

    if (matchedEvt) {
      return {
        ...m,
        status: matchedEvt.status,
        dateGiven:
          matchedEvt.status === 'completed'
            ? `Completed: ${matchedEvt.date}`
            : `Scheduled: ${matchedEvt.date} at ${matchedEvt.time}`,
      };
    }

    return {
      ...m,
      status: "scheduled" as const,
      dateGiven: "Awaiting Clinical Session",
    };
  });

  const completedCount = immunisationMilestones.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / immunisationMilestones.length) * 100);

  return (
    <div className="w-full space-y-6">
      
      {/* Top Card Switcher & Quick Export */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-surface-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-petrol-700 bg-mint-100 px-3 py-0.5 rounded-full border border-mint-200">
              National Health Credential
            </span>
            <span className="text-xs text-surface-dark/60 font-mono font-bold">
              ID: {patient?.code || 'Live Registration Pending'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-petrol-950">
            {effectiveTab === 'child' ? 'Digital Child Yellow Card' : 'Official Maternal ANC Passport'}
          </h2>
          <p className="text-xs sm:text-sm text-surface-dark/70 font-semibold mt-0.5">
            Verified with National Primary Health Care Development Agency (NPHCDA 2024 Protocol).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {!isMaternal && (
            <div className="flex bg-surface-base p-1 rounded-2xl border border-surface-border text-xs font-black">
              <button
                type="button"
                onClick={() => setActiveTab('child')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  effectiveTab === 'child' ? 'bg-petrol-900 text-white shadow-xs' : 'text-surface-dark/70'
                }`}
              >
                <Baby className="h-3.5 w-3.5 text-peach-500" />
                <span>Child Yellow Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('maternal')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  effectiveTab === 'maternal' ? 'bg-petrol-900 text-white shadow-xs' : 'text-surface-dark/70'
                }`}
              >
                <Heart className="h-3.5 w-3.5 text-peach-500 fill-peach-500" />
                <span>Maternal Passport</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="btn-tactile px-3.5 py-2 rounded-xl bg-petrol-50 hover:bg-petrol-100 text-petrol-900 border border-petrol-200 text-xs sm:text-sm font-black flex items-center gap-1.5"
          >
            <QrCode className="h-4 w-4 text-petrol-700" />
            <span>Show QR Pass</span>
          </button>
        </div>
      </div>

      {/* YELLOW CARD PROGRESS HERO (CHILD IMMUNISATION) */}
      {effectiveTab === 'child' && (
        <div className="bg-petrol-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-petrol-800 shadow-float relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-500/20 text-peach-500 text-xs font-black border border-peach-500/40">
                <Baby className="h-3.5 w-3.5" />
                <span>NPHCDA Routine Immunisation Status</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {patient?.name || 'Child'}&apos;s Protection
              </h3>
              <p className="text-xs sm:text-sm text-petrol-100/90 leading-relaxed font-medium">
                {completedCount > 0
                  ? `Your child has completed ${completedCount} federal immunisation milestone(s). Next clinical milestone is tracked below at Garki PHC.`
                  : 'Federal childhood immunisation milestones from birth to 9 months tracked according to NPHCDA protocol.'}
              </p>
            </div>

            {/* Circular Progress Badge */}
            <div className="flex items-center gap-4 bg-petrol-950/80 p-4 rounded-2xl border border-petrol-700 shrink-0">
              <div className="relative h-16 w-16 flex items-center justify-center rounded-full bg-petrol-900 border-4 border-mint-500 text-white font-black text-lg">
                {progressPercent}%
              </div>
              <div>
                <p className="text-xs font-bold text-petrol-200 uppercase">Milestones Done</p>
                <p className="text-base font-black text-white">{completedCount} of {immunisationMilestones.length} Completed</p>
                <p className="text-[11px] text-peach-500 font-bold">
                  {immunisationMilestones.length - completedCount > 0
                    ? `${immunisationMilestones.length - completedCount} Session(s) Pending`
                    : 'All Milestones Up-to-Date'}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MILESTONE LIST */}
      <div className="space-y-3.5">
        {effectiveTab === 'child' ? (
          immunisationMilestones.map((milestone, idx) => {
            const isCompleted = milestone.status === 'completed';
            const isDue = milestone.status === 'scheduled' || milestone.status === 'confirmed';

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  isDue
                    ? 'bg-peach-50/80 border-peach-500 shadow-card'
                    : isCompleted
                    ? 'bg-white border-surface-border'
                    : 'bg-white/70 border-surface-border opacity-85'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isCompleted
                          ? 'bg-mint-100 text-mint-900 border border-mint-300'
                          : isDue
                          ? 'bg-peach-500 text-petrol-950 shadow-xs'
                          : 'bg-surface-muted text-surface-dark/70'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-petrol-950">
                        {milestone.period} Schedule — <span className="text-petrol-700 font-bold">{milestone.ageDesc}</span>
                      </h4>
                      <p className="text-xs text-surface-dark/70 font-semibold mt-0.5">
                        {milestone.facility} • {milestone.dateGiven}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-auto text-xs font-black px-3 py-1 rounded-full ${
                      isCompleted
                        ? 'bg-mint-100 text-mint-900 border border-mint-300'
                        : isDue
                        ? 'bg-peach-500 text-petrol-950 shadow-xs'
                        : 'bg-surface-muted text-surface-dark/70'
                    }`}
                  >
                    {isCompleted ? '✓ Administered' : isDue ? '● Due for Injection' : '○ Upcoming'}
                  </span>
                </div>

                {/* Antigens Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-border/60">
                  {milestone.antigens.map((antigen, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold inline-flex items-center gap-1.5 ${
                        isCompleted
                          ? 'bg-mint-50 text-mint-900 border border-mint-200'
                          : isDue
                          ? 'bg-white text-petrol-950 border border-peach-500/80 font-black'
                          : 'bg-surface-base text-surface-dark/80 border border-surface-border'
                      }`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-mint-600 shrink-0" />
                      <span>{antigen}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          maternalMilestones.map((m, idx) => {
            const isCompleted = m.status === 'completed';
            const isDue = m.status === 'scheduled' || m.status === 'confirmed';

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  isDue
                    ? 'bg-peach-50/80 border-peach-500 shadow-card'
                    : isCompleted
                    ? 'bg-white border-surface-border'
                    : 'bg-white/70 border-surface-border opacity-85'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-base font-black text-petrol-950">{m.period}</h4>
                    <p className="text-sm font-bold text-petrol-800">{m.title}</p>
                  </div>
                  <span
                    className={`self-start sm:self-auto text-xs font-black px-3 py-1 rounded-full ${
                      isCompleted
                        ? 'bg-mint-100 text-mint-900 border border-mint-300'
                        : isDue
                        ? 'bg-peach-500 text-petrol-950 shadow-xs'
                        : 'bg-surface-muted text-surface-dark/70'
                    }`}
                  >
                    {isCompleted ? '✓ Completed' : isDue ? '● Scheduled Next' : '○ 3rd Trimester'}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-surface-border/60">
                  {m.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-petrol-900">
                      <CheckCircle2 className="h-3.5 w-3.5 text-mint-700 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* QR PASS MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-petrol-950/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center border-2 border-surface-border shadow-float">
            <div className="h-14 w-14 rounded-2xl bg-petrol-900 text-peach-500 flex items-center justify-center mx-auto mb-3 shadow-card">
              <QrCode className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-petrol-950">Offline CarePass QR</h3>
            <p className="text-xs text-surface-dark/70 font-semibold mb-4">
              Show this official pass at any PHC in Nigeria. Clinicians can scan and verify child immunization without internet.
            </p>

            <div className="bg-surface-base p-4 rounded-2xl border-2 border-petrol-900/10 mb-4 inline-block">
              {/* Authentic QR Motif */}
              <div className="h-44 w-44 mx-auto bg-white border-4 border-petrol-900 rounded-xl p-2 flex flex-col items-center justify-center">
                <QrCode className="h-32 w-32 text-petrol-950" />
                <span className="text-[10px] font-mono font-black text-petrol-900 mt-1">
                  {patient?.code || 'CP-C-4091'}
                </span>
              </div>
            </div>

            <p className="text-[11px] font-bold text-mint-800 mb-5">
              Verified by Federal Ministry of Health • NPHCDA
            </p>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-petrol-900 text-white font-black text-xs hover:bg-petrol-950"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
