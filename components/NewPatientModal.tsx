'use client';

import React, { useState } from 'react';
import { CareCategory } from '@/lib/types';
import { X, UserPlus, Heart, Baby, Shield, Users, Phone, MapPin } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-float z-10 max-h-[90vh] overflow-y-auto border-2 border-surface-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-surface-border pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-cream-200">
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
            <label className="block font-black text-teal-950 mb-1.5">Patient Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fatima Bello or Baby Kemi"
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Care Category */}
          <div>
            <label className="block font-black text-teal-950 mb-1.5">Care Category *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('immunisation');
                  setRelationship('child');
                  setStageInfo('Newborn (0 Wks)');
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === 'immunisation'
                    ? 'border-teal-800 bg-teal-50 text-teal-950 font-black shadow-xs'
                    : 'border-surface-border bg-surface-base text-surface-dark/80 font-bold'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Baby className="h-4 w-4 text-teal-800" />
                  <span>Infant Immunisation</span>
                </div>
                <p className="text-[11px] font-normal text-surface-dark/70">NPHCDA 2024 Schedule</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('maternal');
                  setRelationship('self');
                  setStageInfo('28 Weeks Gestation');
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === 'maternal'
                    ? 'border-teal-800 bg-teal-50 text-teal-950 font-black shadow-xs'
                    : 'border-surface-border bg-surface-base text-surface-dark/80 font-bold'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-teal-800" />
                  <span>Maternal ANC</span>
                </div>
                <p className="text-[11px] font-normal text-surface-dark/70">Antenatal Consultations</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('postnatal');
                  setRelationship('self');
                  setStageInfo('6 Weeks Postnatal');
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === 'postnatal'
                    ? 'border-teal-800 bg-teal-50 text-teal-950 font-black shadow-xs'
                    : 'border-surface-border bg-surface-base text-surface-dark/80 font-bold'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-teal-800" />
                  <span>Postnatal Care</span>
                </div>
                <p className="text-[11px] font-normal text-surface-dark/70">Mother & Newborn Review</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('general');
                  setRelationship('mother');
                  setStageInfo('Routine Review');
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === 'general'
                    ? 'border-teal-800 bg-teal-50 text-teal-950 font-black shadow-xs'
                    : 'border-surface-border bg-surface-base text-surface-dark/80 font-bold'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-teal-800" />
                  <span>Chronic / General</span>
                </div>
                <p className="text-[11px] font-normal text-surface-dark/70">Blood pressure, Diabetes, etc.</p>
              </button>
            </div>
          </div>

          {/* Current Clinical Stage */}
          <div>
            <label className="block font-black text-teal-950 mb-1.5">Current Health Stage</label>
            <input
              type="text"
              value={stageInfo}
              onChange={(e) => setStageInfo(e.target.value)}
              placeholder="e.g. 6 Weeks Postnatal, 32 Weeks Gestation, or Routine Check"
              className="w-full rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Phone Ownership & Proxy Management */}
          <div className="bg-surface-base p-4 rounded-2xl border-2 border-surface-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-teal-950">Does patient own a personal mobile phone?</span>
              <button
                type="button"
                onClick={() => setHasPersonalPhone(!hasPersonalPhone)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                  hasPersonalPhone
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-cream-200 text-teal-950 border border-teal-800/20'
                }`}
              >
                {hasPersonalPhone ? 'Yes (Personal Phone)' : 'No (Caregiver Proxy)'}
              </button>
            </div>

            {hasPersonalPhone ? (
              <div>
                <label className="block font-bold text-surface-dark mb-1">Patient Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 803 123 4567"
                  className="w-full rounded-xl border-2 border-surface-border bg-white px-3.5 py-2.5 font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
            ) : (
              <div className="space-y-3 pt-1 border-t border-surface-border">
                <p className="text-xs text-surface-dark/70 font-semibold">
                  Reminders will be routed to the authorized proxy caregiver:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-surface-dark mb-1">Caregiver Name *</label>
                    <input
                      type="text"
                      required
                      value={proxyName}
                      onChange={(e) => setProxyName(e.target.value)}
                      placeholder="e.g. Mrs. Amina Bello"
                      className="w-full rounded-xl border-2 border-surface-border bg-white px-3.5 py-2 font-bold text-surface-dark"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-surface-dark mb-1">Caregiver Phone *</label>
                    <input
                      type="tel"
                      required
                      value={proxyPhone}
                      onChange={(e) => setProxyPhone(e.target.value)}
                      placeholder="e.g. +234 802 987 6543"
                      className="w-full rounded-xl border-2 border-surface-border bg-white px-3.5 py-2 font-bold text-surface-dark"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn-tactile w-full py-3.5 rounded-2xl bg-teal-800 text-white font-black text-sm hover:bg-teal-900 shadow-card flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Register Patient & Generate Care Pathway</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
