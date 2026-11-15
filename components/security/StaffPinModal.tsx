'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, X, Sparkles, Building2 } from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

interface StaffPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StaffPinModal({ isOpen, onClose, onSuccess }: StaffPinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === '1234' || pin === '0000') {
      playChime('confirm');
      setError(false);
      onSuccess();
    } else {
      setError(true);
      playChime('alert');
    }
  };

  const handleQuickUnlock = () => {
    setPin('1234');
    playChime('confirm');
    setError(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-petrol-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-float border-2 border-surface-border text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-surface-dark/50 hover:text-surface-dark rounded-full hover:bg-surface-muted transition-colors"
          title="Close staff gate"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Lock Icon Emblem */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-petrol-900 text-peach-500 mx-auto mb-4 border-2 border-petrol-800 shadow-card">
          <Lock className="h-8 w-8 stroke-[2.2]" />
        </div>

        {/* Title & Governance Note */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-100 text-mint-900 text-xs font-black mb-2 border border-mint-200">
          <ShieldCheck className="h-3.5 w-3.5 text-mint-700" />
          <span>NDPA 2023 Clinical Protection</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-petrol-950 mb-1">
          PHC Healthcare Staff Workspace
        </h3>
        <p className="text-xs sm:text-sm text-surface-dark/70 font-semibold mb-5 leading-relaxed">
          Garki Primary Healthcare Centre (Ward FCT-04). Authorized clinical intake & patient record management.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-petrol-900 mb-2">
              Enter Clinical Staff PIN
            </label>
            <div className="relative max-w-[220px] mx-auto">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="••••"
                autoFocus
                className={`w-full text-center text-2xl tracking-[0.5em] font-mono font-black py-2.5 px-4 rounded-xl border-2 transition-all outline-none ${
                  error
                    ? 'border-red-500 bg-red-50 text-red-900'
                    : 'border-petrol-800/30 bg-surface-base focus:border-petrol-900 focus:bg-white text-petrol-950'
                }`}
              />
            </div>
            {error && (
              <p className="text-xs font-bold text-red-600 mt-2 flex items-center justify-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Invalid PIN. (Demo Staff PIN is 1234)</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-petrol-900 hover:bg-petrol-950 text-white font-black text-sm shadow-card flex items-center justify-center gap-2 transition-colors"
          >
            <KeyRound className="h-4 w-4 text-peach-500" />
            <span>Verify & Enter Clinic Portal</span>
          </button>
        </form>

        {/* Zero-Friction Demo Helper for Competition Judges */}
        <div className="mt-5 pt-4 border-t border-surface-border">
          <div className="bg-petrol-50 rounded-2xl p-3 border border-petrol-200/80 mb-3 text-left">
            <div className="flex items-center justify-between text-xs font-black text-petrol-900 mb-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-petrol-700" />
                <span>Demo Judge Credentials</span>
              </span>
              <span className="font-mono bg-petrol-900 text-peach-500 px-2 py-0.5 rounded text-[11px]">
                PIN: 1234
              </span>
            </div>
            <p className="text-[11px] text-petrol-800/80 font-medium">
              Access the live clinical registry as <strong>Nurse Blessing Aliyu (Senior CHO)</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickUnlock}
            className="w-full py-2.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs sm:text-sm shadow-peach flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>1-Click Unlock Demo as Nurse Blessing</span>
          </button>
        </div>
      </div>
    </div>
  );
}
