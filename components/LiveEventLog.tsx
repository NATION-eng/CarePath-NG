'use client';

import React from 'react';
import { AuditEvent } from '@/lib/types';
import { Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LiveEventLogProps {
  logs: AuditEvent[];
}

export function LiveEventLog({ logs }: LiveEventLogProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border-2 border-surface-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-teal-950 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm border-b border-teal-900">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-black tracking-wide">Transactional Outbox & Audit Engine</span>
        </div>
        <span className="text-[11px] text-teal-300 font-mono font-bold">NDPA 2023 Compliant</span>
      </div>

      {/* Description tag */}
      <div className="bg-surface-base px-3.5 py-2 border-b border-surface-border text-xs text-surface-dark/70 flex flex-wrap items-center justify-between gap-2">
        <span>Real-time queue traces, telco handshakes, and state transitions</span>
        <span className="text-emerald-700 font-bold flex items-center gap-1.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Outbox Active
        </span>
      </div>

      {/* Log feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 font-mono text-xs">
        {logs.map((log) => {
          const isSuccess = log.status === 'success';
          const isWarning = log.status === 'warning';

          return (
            <div
              key={log.id}
              className={`p-3 rounded-xl border-2 transition-all ${
                isSuccess
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : isWarning
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : 'bg-surface-base border-surface-border text-surface-dark'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                <span className="font-black text-[10px] sm:text-xs tracking-wide uppercase px-2 py-0.5 rounded bg-white border border-surface-border">
                  {log.action}
                </span>
                <span className="text-[11px] text-surface-dark/60 font-semibold">{log.timestamp}</span>
              </div>
              <p className="text-xs sm:text-sm font-sans text-surface-dark font-bold leading-snug mb-2">
                {log.details}
              </p>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-surface-dark/70 font-sans border-t border-surface-border/50 pt-1.5">
                <span>Actor: <strong className="text-teal-950 font-black">{log.actor}</strong></span>
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Transaction Committed
                </span>
              </div>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="text-center py-12 text-surface-dark/60 text-xs sm:text-sm">
            No audit records yet.
          </div>
        )}
      </div>
    </div>
  );
}
