'use client';

import React, { useState } from 'react';
import { PatientProfile } from '@/lib/types';
import { 
  Users, 
  Smartphone, 
  ShieldCheck, 
  UserPlus, 
  PhoneForwarded, 
  CheckCircle2, 
  Heart,
  Baby,
  Activity,
  ChevronRight
} from 'lucide-react';

interface FamilyProxyHubProps {
  patients: PatientProfile[];
  activePatient?: PatientProfile;
  onSelectPatient: (patientId: string) => void;
  onOpenNewPatientModal: () => void;
}

export function FamilyProxyHub({
  patients,
  activePatient,
  onSelectPatient,
  onOpenNewPatientModal,
}: FamilyProxyHubProps) {
  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner explaining Proxy Architecture */}
      <div className="bg-petrol-900 text-white rounded-3xl p-6 sm:p-7 border-2 border-petrol-800 shadow-float">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-500/20 text-peach-500 text-xs font-black border border-peach-500/30">
              <Users className="h-3.5 w-3.5" />
              <span>Multi-Profile Care Continuity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Family & Proxy Management Hub
            </h2>
            <p className="text-xs sm:text-sm text-petrol-100/90 leading-relaxed font-medium">
              CarePath NG separates the <strong>Account Owner</strong> from the <strong>Care Recipient</strong> and 
              the <strong>SMS Contact</strong>. Manage healthcare for yourself, your children, and elderly relatives 
              who do not own phones from one connected place.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNewPatientModal}
            className="btn-tactile px-5 py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs sm:text-sm shadow-peach flex items-center justify-center gap-2 shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Add Family Dependent</span>
          </button>
        </div>
      </div>

      {/* Family Profiles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-petrol-950">
            Managed Family Members ({patients.length})
          </h3>
          <span className="text-xs font-bold text-petrol-700">
            Click to switch active care timeline
          </span>
        </div>

        {patients.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 border-2 border-surface-border text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-peach-100 text-peach-800 flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-peach-700" />
            </div>
            <h4 className="text-lg font-black text-petrol-950">No Family Dependents Registered Yet</h4>
            <p className="text-xs sm:text-sm text-surface-dark/70 font-semibold max-w-md mx-auto">
              Add your children or relatives without phones. CarePath NG routes appointment SMS directly to your designated guardian phone.
            </p>
            <div>
              <button
                type="button"
                onClick={onOpenNewPatientModal}
                className="btn-tactile px-5 py-2.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-petrol-950 font-black text-xs shadow-peach inline-flex items-center gap-1.5"
              >
                <UserPlus className="h-4 w-4" />
                <span>+ Register First Family Member</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map((pat) => {
              const isActive = pat.id === activePatient?.id;
              const hasOwnPhone = pat.phoneOwnedByPatient;

              return (
                <div
                  key={pat.id}
                  onClick={() => onSelectPatient(pat.id)}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-peach-50/90 border-peach-500 shadow-card ring-2 ring-peach-500/30'
                      : 'bg-white border-surface-border hover:border-petrol-400'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 min-w-[3rem] min-h-[3rem] rounded-2xl bg-petrol-900 border border-petrol-700 text-peach-500 font-black text-base flex items-center justify-center shadow-xs shrink-0">
                          {pat.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base sm:text-lg font-black text-petrol-950">
                              {pat.name}
                            </h4>
                            {isActive && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-peach-500 text-petrol-950 shadow-xs">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-petrol-700 font-bold">
                            {pat.categoryLabel} • <span className="font-mono text-petrol-900">{pat.code}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stage & Details */}
                    <div className="bg-surface-base rounded-2xl p-3 border border-surface-border mb-3 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-surface-dark/70 font-semibold">Stage / Milestone:</span>
                        <strong className="text-petrol-950 font-bold">{pat.stageInfo}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-surface-dark/70 font-semibold">Phone Ownership:</span>
                        <span className={`font-bold ${hasOwnPhone ? 'text-mint-800' : 'text-amber-800'}`}>
                          {hasOwnPhone ? 'Owns Personal Phone' : 'No Phone (Proxy Managed)'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-surface-border/80">
                        <span className="text-surface-dark/70 font-semibold">Reminders Sent To:</span>
                        <span className="font-bold text-petrol-950 flex items-center gap-1">
                          <Smartphone className="h-3 w-3 text-peach-500" />
                          <span>{pat.notificationContact.name} ({pat.notificationContact.relationship})</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-petrol-800 pt-2 border-t border-surface-border/60">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-mint-700" />
                      <span>Permissions: Full Care Access</span>
                    </span>
                    <span className="text-peach-600 font-black flex items-center gap-0.5">
                      {isActive ? 'Currently Viewing' : 'Switch Profile'} <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Permission & Privacy Model Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-surface-border shadow-subtle">
        <h4 className="text-sm sm:text-base font-black text-petrol-950 mb-2 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-mint-700" />
          <span>NDPA 2023 Compliant Guardian Delegation</span>
        </h4>
        <p className="text-xs sm:text-sm text-surface-dark/70 font-medium leading-relaxed mb-4">
          All proxy authorizations are timestamped, encrypted, and can be updated or revoked anytime. Caregivers only receive discreet appointment alerts without exposing confidential clinical details.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-petrol-900 font-bold">
          <div className="p-2.5 rounded-xl bg-surface-base border border-surface-border flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-mint-700 shrink-0" />
            <span>VIEW_APPOINTMENTS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-base border border-surface-border flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-mint-700 shrink-0" />
            <span>RECEIVE_SMS_REMINDERS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-base border border-surface-border flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-mint-700 shrink-0" />
            <span>CONFIRM_OR_RESCHEDULE</span>
          </div>
        </div>
      </div>

    </div>
  );
}
