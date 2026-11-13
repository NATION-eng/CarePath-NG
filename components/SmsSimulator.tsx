'use client';

import React, { useState } from 'react';
import { SmsMessage } from '@/lib/types';
import { 
  Smartphone, 
  Send, 
  CheckCheck, 
  ShieldAlert, 
  Info,
  Radio,
  Signal,
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
    <div className="flex flex-col h-full bg-white rounded-3xl border-2 border-surface-border shadow-card overflow-hidden">
      {/* Handset Top Bar */}
      <div className="bg-teal-950 text-white px-5 py-3 flex items-center justify-between text-xs sm:text-sm border-b-2 border-teal-900">
        <div className="flex items-center gap-2.5">
          <Smartphone className="h-5 w-5 text-teal-400" />
          <span className="font-black tracking-wide text-sm sm:text-base">SMS Telephony Gateway</span>
        </div>
        <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>MTN-NG (DND Whitelisted)</span>
          </span>
          <div className="flex items-center gap-1 ml-2">
            <Signal className="h-4 w-4" />
            <Battery className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Live Judge Real-Phone Input Bar */}
      <div className="bg-cream-100 border-b-2 border-cream-200 p-3.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-black text-teal-950 flex items-center gap-2">
            <Info className="h-4 w-4 text-teal-800" />
            <span>Live Pitch Stage Integration:</span>
          </span>
          <span className="text-xs text-teal-900 font-extrabold">Instant Real Handset Delivery</span>
        </div>
        <form onSubmit={handleSavePhone} className="flex gap-2">
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="Enter Judge's Phone Number (e.g. +234 803...)"
            className="flex-1 rounded-xl border-2 border-teal-800/30 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-surface-dark placeholder:text-surface-dark/50 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
          <button
            type="submit"
            className="btn-tactile rounded-xl bg-teal-800 px-4 py-2 text-xs sm:text-sm font-black text-white hover:bg-teal-900 shadow-xs"
          >
            {isSavedPhone ? 'Saved ✓' : 'Set Phone'}
          </button>
        </form>
      </div>

      {/* Simulated Phone Screen Thread */}
      <div className="flex-1 p-4 overflow-y-auto bg-surface-base space-y-3.5">
        {/* Anti-AI Shared Phone Privacy Banner */}
        <div className="flex items-start gap-2.5 rounded-2xl bg-teal-50 border-2 border-teal-200 p-3 text-xs sm:text-sm text-teal-950 leading-relaxed font-semibold">
          <ShieldAlert className="h-5 w-5 text-teal-800 mt-0.5 shrink-0" />
          <div>
            <strong className="font-black">Discreet Notification Policy:</strong> Specific medical conditions are omitted to protect mothers on shared family phones.
          </div>
        </div>

        {/* Messages */}
        {smsLog.map((sms) => (
          <div key={sms.id} className="flex flex-col items-start max-w-[95%] animate-in fade-in duration-150">
            <div className="flex items-center gap-2 mb-1 px-1.5 text-xs text-surface-dark/70 font-bold">
              <span className="font-black text-teal-950">{sms.sender}</span>
              <span>•</span>
              <span>{sms.timestamp}</span>
              <span>•</span>
              <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                <CheckCheck className="h-3.5 w-3.5" /> Delivered
              </span>
            </div>

            <div className="rounded-3xl rounded-tl-sm bg-white border-2 border-surface-border p-4 text-xs sm:text-sm text-surface-dark font-semibold shadow-subtle leading-relaxed">
              <p>{sms.messageText}</p>
            </div>

            <div className="px-2 mt-1 text-[11px] text-surface-dark/60 font-bold">
              Recipient: {sms.recipientName} ({sms.recipientPhone})
            </div>
          </div>
        ))}
      </div>

      {/* Quick Interactive Reply Chips */}
      <div className="bg-white border-t-2 border-surface-border p-3.5">
        <div className="text-xs font-black text-surface-dark/70 uppercase tracking-wider mb-2">
          Click To Send Simulated SMS Reply:
        </div>
        <div className="flex gap-2.5 mb-2.5">
          <button
            type="button"
            onClick={() => handleSendReply('1')}
            className="btn-tactile flex-1 rounded-xl border-2 border-emerald-400 bg-emerald-50 py-2.5 px-3 text-xs sm:text-sm font-black text-emerald-950 hover:bg-emerald-100 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Reply &ldquo;1&rdquo;</span>
            <span className="text-xs font-bold text-emerald-800">(Confirm)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSendReply('2')}
            className="btn-tactile flex-1 rounded-xl border-2 border-amber-400 bg-amber-50 py-2.5 px-3 text-xs sm:text-sm font-black text-amber-950 hover:bg-amber-100 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Reply &ldquo;2&rdquo;</span>
            <span className="text-xs font-bold text-amber-800">(Reschedule)</span>
          </button>
        </div>

        {/* Custom Text input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
            placeholder="Type custom SMS reply..."
            className="flex-1 rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2 text-xs sm:text-sm font-bold text-surface-dark placeholder:text-surface-dark/50 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
          <button
            type="button"
            onClick={() => handleSendReply()}
            className="btn-tactile rounded-xl bg-teal-800 p-2.5 text-white hover:bg-teal-900 shadow-xs"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
