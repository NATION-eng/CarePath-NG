'use client';

import React from 'react';
import { AuditEvent } from '@/lib/types';
import { Activity, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface LiveEventLogProps {
  logs: AuditEvent[];
}

export function LiveEventLog({ logs }: LiveEventLogProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-teal-950 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-teal-900">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <span className="font-bold tracking-wide">Transactional Outbox & Audit Engine</span>
        </div>
        <span className="text-[10px] text-teal-300 font-mono">NDPA 2023 Compliant</span>
      </div>

      {/* Description tag */}
      <div className="bg-surface-base px-3 py-2 border-b border-surface-border text-[11px] text-surface-dark/70 flex items-center justify-between">
        <span>Real-time queue traces, telco handshakes, and state transitions</span>
        <span className="text-emerald-700 font-bold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          BullMQ Active
        </span>
      </div>

      {/* Log feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[11px]">
        {logs.map((log) => {
          const isSuccess = log.status === 'success';
          const isWarning = log.status === 'warning';

          return (
            <div
              key={log.id}
              className={`p-2.5 rounded-xl border transition-all ${
                isSuccess
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : isWarning
                  ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                  : 'bg-surface-base border-surface-border text-surface-dark'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-[10px] tracking-wide uppercase px-1.5 py-0.2 rounded bg-white border border-surface-border">
                  {log.action}
                </span>
                <span className="text-[10px] text-surface-dark/50">{log.timestamp}</span>
              </div>
              <p className="text-xs font-sans text-surface-dark/90 leading-tight mb-1">
                {log.details}
              </p>
              <div className="flex items-center justify-between text-[10px] text-surface-dark/60 font-sans">
                <span>Actor: <strong>{log.actor}</strong></span>
                <span className="text-emerald-700 font-medium">✓ Transaction committed</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
