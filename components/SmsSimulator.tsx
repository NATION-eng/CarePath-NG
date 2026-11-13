'use client';

import React, { useState } from 'react';
import { SmsMessage } from '@/lib/types';
import { 
  Smartphone, 
  Send, 
  CheckCheck, 
  ShieldAlert, 
  RotateCcw, 
  Info,
  Radio,
  Signal,
  Wifi,
  Battery
} from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

interface SmsSimulatorProps {
  smsLog: SmsMessage[];
  customPhone: string;
  onUpdatePhone: (phone: string) => void;
  onReplySms: (replyText: string) => void;
  onReset: () => void;
}

export function SmsSimulator({
  smsLog,
  customPhone,
  onUpdatePhone,
  onReplySms,
  onReset,
}: SmsSimulatorProps) {
  const [inputText, setInputText] = useState('');
  const [phoneInput, setPhoneInput] = useState(customPhone);
  const [isSavedPhone, setIsSavedPhone] = useState(false);

  const handleSendReply = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    playChime('confirm');
    onReplySms(text.trim());
    setInputText('');
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePhone(phoneInput);
    setIsSavedPhone(true);
    setTimeout(() => setIsSavedPhone(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
      {/* Handset Top Bar */}
      <div className="bg-teal-950 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-teal-900">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-teal-400" />
          <span className="font-bold tracking-wide">SMS Telephony Gateway</span>
        </div>
        <div className="flex items-center gap-2 text-white/70 text-[11px]">
          <span className="flex items-center gap-1">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span>MTN-NG (DND Whitelist)</span>
          </span>
          <div className="flex items-center gap-1 ml-2">
            <Signal className="h-3 w-3" />
            <Battery className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Live Judge Real-Phone Input Bar */}
      <div className="bg-cream-100 border-b border-cream-200 p-3 text-xs">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="font-bold text-teal-950 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-teal-700" />
            <span>Live Pitch Stage Hook</span>
          </span>
          <span className="text-[10px] text-teal-800 font-medium">Real SMS delivery</span>
        </div>
        <form onSubmit={handleSavePhone} className="flex gap-1.5">
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="Enter Judge's Phone e.g. +234..."
            className="flex-1 rounded-lg border border-teal-800/20 bg-white px-2.5 py-1.5 text-xs text-surface-dark placeholder:text-surface-dark/40 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
          <button
            type="submit"
            className="btn-tactile rounded-lg bg-teal-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-900"
          >
            {isSavedPhone ? 'Saved ✓' : 'Set Phone'}
          </button>
        </form>
      </div>

      {/* Simulated Phone Screen Thread */}
      <div className="flex-1 p-3.5 overflow-y-auto bg-surface-base space-y-3">
        {/* Anti-AI Shared Phone Privacy Banner */}
        <div className="flex items-start gap-2 rounded-xl bg-teal-50 border border-teal-200/60 p-2.5 text-[11px] text-teal-900 leading-tight">
          <ShieldAlert className="h-4 w-4 text-teal-700 mt-0.5 shrink-0" />
          <div>
            <strong className="font-semibold">Discreet Template Active:</strong> Medical specifics (antigens, scans) are omitted to protect mothers on shared family phones.
          </div>
        </div>

        {/* Messages */}
        {smsLog.map((sms) => (
          <div key={sms.id} className="flex flex-col items-start max-w-[92%] animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-surface-dark/60">
              <span className="font-bold text-teal-900">{sms.sender}</span>
              <span>•</span>
              <span>{sms.timestamp}</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                <CheckCheck className="h-3 w-3" /> Delivered
              </span>
            </div>

            <div className="rounded-2xl rounded-tl-xs bg-white border border-surface-border p-3 text-xs text-surface-dark shadow-subtle leading-relaxed">
              <p>{sms.messageText}</p>
            </div>

            <div className="px-1.5 mt-1 text-[10px] text-surface-dark/50">
              Recipient: {sms.recipientName} ({sms.recipientPhone})
            </div>
          </div>
        ))}
      </div>

      {/* Quick Interactive Reply Chips */}
      <div className="bg-white border-t border-surface-border p-2.5">
        <div className="text-[11px] font-semibold text-surface-dark/70 mb-1.5">
          Quick Simulated SMS Reply (Click to test live loop):
        </div>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => handleSendReply('1')}
            className="btn-tactile flex-1 rounded-lg border border-emerald-300 bg-emerald-50 py-1.5 px-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 flex items-center justify-center gap-1"
          >
            <span>Reply &ldquo;1&rdquo;</span>
            <span className="text-[10px] font-normal text-emerald-700">(Confirm)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSendReply('2')}
            className="btn-tactile flex-1 rounded-lg border border-amber-300 bg-amber-50 py-1.5 px-2 text-xs font-bold text-amber-900 hover:bg-amber-100 flex items-center justify-center gap-1"
          >
            <span>Reply &ldquo;2&rdquo;</span>
            <span className="text-[10px] font-normal text-amber-700">(Reschedule)</span>
          </button>
        </div>

        {/* Custom Text input */}
        <div className="flex gap-1.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
            placeholder="Type custom SMS reply..."
            className="flex-1 rounded-lg border border-surface-border bg-surface-base px-3 py-1.5 text-xs text-surface-dark placeholder:text-surface-dark/40 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
          <button
            type="button"
            onClick={() => handleSendReply()}
            className="btn-tactile rounded-lg bg-teal-800 p-2 text-white hover:bg-teal-900"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
