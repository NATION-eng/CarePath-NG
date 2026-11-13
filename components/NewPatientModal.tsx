'use client';

import React, { useState } from 'react';
import { CareCategory } from '@/lib/types';
import { X, UserPlus, Heart, Baby, Shield, Users, Phone } from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterPatient: (patientData: {
    name: string;
    category: CareCategory;
    relationship: 'self' | 'child' | 'mother' | 'dependent';
    stageInfo: string;
    phone?: string;
    proxyName?: string;
    proxyPhone?: string;
    proxyRelationship?: string;
  }) => void;
}

export function NewPatientModal({ isOpen, onClose, onRegisterPatient }: NewPatientModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CareCategory>('immunisation');
  const [relationship, setRelationship] = useState<'self' | 'child' | 'mother' | 'dependent'>('child');
  const [stageInfo, setStageInfo] = useState('');
  const [hasPersonalPhone, setHasPersonalPhone] = useState(false);
  const [phone, setPhone] = useState('');
  const [proxyName, setProxyName] = useState('');
  const [proxyPhone, setProxyPhone] = useState('');
  const [proxyRelationship, setProxyRelationship] = useState('Mother (Guardian)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playChime('confirm');
    onRegisterPatient({
      name: name.trim(),
      category,
      relationship,
      stageInfo: stageInfo.trim() || (category === 'maternal' ? 'First Trimester' : category === 'immunisation' ? 'Newborn (0 Wks)' : 'Active Care'),
      phone: hasPersonalPhone ? phone.trim() : undefined,
      proxyName: !hasPersonalPhone ? proxyName.trim() : undefined,
      proxyPhone: !hasPersonalPhone ? proxyPhone.trim() : undefined,
      proxyRelationship: !hasPersonalPhone ? proxyRelationship.trim() : undefined,
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
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-teal-950">Register New Patient</h2>
              <p className="text-xs text-surface-dark/70 font-semibold">CarePath Healthcare Continuity Registry</p>
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
          {/* Patient Full Name */}
          <div>
            <label className="block font-black text-teal-950 mb-1">Patient Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fatima Bello or Baby Kemi"
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Care Category (1-col on tiny mobile, 2-col on sm+) */}
          <div>
            <label className="block font-black text-teal-950 mb-1">Care Category *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('immunisation');
                  setRelationship('child');
                  setHasPersonalPhone(false);
                }}
                className={`p-3 rounded-xl border-2 text-left font-black flex items-center gap-2.5 transition-all ${
                  category === 'immunisation'
                    ? 'border-teal-800 bg-teal-50 text-teal-950 shadow-xs'
                    : 'border-surface-border bg-surface-base text-surface-dark/80 hover:bg-surface-muted'
                }`}
              >
                <Baby className="h-5 w-5 text-teal-800 shrink-0" />
                <div>
                  <div className="text-xs sm:text-sm">Child Immunisation</div>
                  <div className="text-[10px] text-surface-dark/60 font-semibold">NPHCDA Yellow Card Schedule</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('maternal');
                  setRelationship('mother');
                  setHasPersonalPhone(true);
                }}
                className={`p-3 rounded-xl border-2 text-left font-black flex items-center gap-2.5 transition-all ${
                  category === 'maternal'
                    ? 'border-teal-800 bg-teal-50 text-teal-950 shadow-xs'
                    : 'border-surface-border bg-surface-base text-surface-dark/80 hover:bg-surface-muted'
                }`}
              >
                <Heart className="h-5 w-5 text-rose-600 shrink-0" />
                <div>
                  <div className="text-xs sm:text-sm">Maternal ANC Care</div>
                  <div className="text-[10px] text-surface-dark/60 font-semibold">Antenatal Federal Pathway</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('postnatal');
                  setRelationship('mother');
                }}
                className={`p-3 rounded-xl border-2 text-left font-black flex items-center gap-2.5 transition-all ${
                  category === 'postnatal'
                    ? 'border-teal-800 bg-teal-50 text-teal-950 shadow-xs'
                    : 'border-surface-border bg-surface-base text-surface-dark/80 hover:bg-surface-muted'
                }`}
              >
                <Users className="h-5 w-5 text-teal-800 shrink-0" />
                <div>
                  <div className="text-xs sm:text-sm">Postnatal & Neonatal</div>
                  <div className="text-[10px] text-surface-dark/60 font-semibold">6-Week Post-Delivery Care</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('general');
                  setRelationship('self');
                }}
                className={`p-3 rounded-xl border-2 text-left font-black flex items-center gap-2.5 transition-all ${
                  category === 'general'
                    ? 'border-teal-800 bg-teal-50 text-teal-950 shadow-xs'
                    : 'border-surface-border bg-surface-base text-surface-dark/80 hover:bg-surface-muted'
                }`}
              >
                <Shield className="h-5 w-5 text-emerald-700 shrink-0" />
                <div>
                  <div className="text-xs sm:text-sm">General & Chronic</div>
                  <div className="text-[10px] text-surface-dark/60 font-semibold">Hypertension, Diabetes, Wellness</div>
                </div>
              </button>
            </div>
          </div>

          {/* Stage / Milestone Description */}
          <div>
            <label className="block font-black text-teal-950 mb-1">Current Milestone / Stage Info</label>
            <input
              type="text"
              value={stageInfo}
              onChange={(e) => setStageInfo(e.target.value)}
              placeholder={category === 'immunisation' ? 'e.g. Newborn (0 Weeks)' : 'e.g. 28 Weeks Gestation'}
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Phone Ownership Toggle */}
          <div className="bg-surface-base rounded-2xl p-3 sm:p-4 border-2 border-surface-border space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="font-black text-teal-950 text-xs sm:text-sm block">Does patient have a personal phone?</span>
                <span className="text-[11px] text-surface-dark/70 font-semibold">
                  {hasPersonalPhone ? 'SMS sent directly to patient' : 'Patient uses a Proxy Caregiver / Guardian'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={hasPersonalPhone}
                onChange={(e) => setHasPersonalPhone(e.target.checked)}
                className="h-5 w-5 rounded border-2 border-teal-800 text-teal-800 focus:ring-teal-700 shrink-0"
              />
            </div>

            {hasPersonalPhone ? (
              <div>
                <label className="block font-black text-teal-950 mb-1">Patient Mobile Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-surface-dark/50" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full rounded-xl border-2 border-surface-border bg-white pl-10 pr-4 py-2.5 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1 border-t border-surface-border">
                <div>
                  <label className="block font-black text-teal-950 mb-1">Proxy Caregiver / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={proxyName}
                    onChange={(e) => setProxyName(e.target.value)}
                    placeholder="e.g. Amina Danjuma (Mother)"
                    className="w-full rounded-xl border-2 border-surface-border bg-white px-3.5 py-2 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-teal-950 mb-1">Proxy Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={proxyPhone}
                      onChange={(e) => setProxyPhone(e.target.value)}
                      placeholder="+234 802 987 6543"
                      className="w-full rounded-xl border-2 border-surface-border bg-white px-3.5 py-2 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                  <div>
                    <label className="block font-black text-teal-950 mb-1">Relationship to Patient</label>
                    <input
                      type="text"
                      value={proxyRelationship}
                      onChange={(e) => setProxyRelationship(e.target.value)}
                      placeholder="e.g. Mother, Father, Aunt"
                      className="w-full rounded-xl border-2 border-surface-border bg-white px-3.5 py-2 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                </div>
              </div>
            )}
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
              Register & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
