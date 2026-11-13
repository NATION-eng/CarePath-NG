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
      <div className="bg-teal-950 text-white px-4 sm:px-5 py-3 flex items-center justify-between text-xs sm:text-sm border-b-2 border-teal-900">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-teal-400 shrink-0" />
          <span className="font-black tracking-wide text-sm sm:text-base">SMS Gateway</span>
        </div>
        <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span className="hidden sm:inline">MTN-NG (Whitelisted DND)</span>
            <span className="sm:hidden">MTN DND</span>
          </span>
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <Signal className="h-4 w-4" />
            <Battery className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Live Phone Test Integration Bar */}
      <div className="bg-cream-100 border-b-2 border-cream-200 p-3 sm:p-3.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-black text-teal-950 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-teal-800 shrink-0" />
            <span>SMS Notification Routing:</span>
          </span>
          <span className="text-[11px] text-teal-900 font-extrabold hidden sm:inline">Telco SMS Delivery</span>
        </div>
        <form onSubmit={handleSavePhone} className="flex flex-col sm:flex-row gap-2">
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="Recipient Mobile Phone (+234 803...)"
            className="flex-1 rounded-xl border-2 border-teal-800/30 bg-white px-3.5 py-2 text-base sm:text-sm font-bold text-surface-dark placeholder:text-surface-dark/50 focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
          <button
            type="submit"
            className="btn-tactile rounded-xl bg-teal-800 px-4 py-2 text-xs sm:text-sm font-black text-white hover:bg-teal-900 shadow-xs shrink-0"
          >
            {isSavedPhone ? 'Saved ✓' : 'Save Number'}
          </button>
        </form>
      </div>

      {/* Simulated Phone Screen Thread */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-surface-base space-y-3.5">
        {/* Anti-AI Shared Phone Privacy Banner */}
        <div className="flex items-start gap-2.5 rounded-2xl bg-teal-50 border-2 border-teal-200 p-3 text-xs sm:text-sm text-teal-950 leading-relaxed font-semibold">
          <ShieldAlert className="h-5 w-5 text-teal-800 mt-0.5 shrink-0" />
          <p>
            <strong className="font-black">Shared Handset Privacy Protection:</strong> Messages omit clinical diagnostics to safeguard patient confidentiality on shared family SIMs.
          </p>
        </div>

        {/* Message Thread */}
        {smsLog.map((msg) => (
          <div key={msg.id} className="flex flex-col space-y-1">
            <div className="self-start max-w-[92%] sm:max-w-[82%] rounded-2xl rounded-tl-xs bg-white border-2 border-surface-border p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-[11px] text-surface-dark/60 font-bold mb-1 gap-2">
                <span className="font-black text-teal-950">{msg.sender}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="text-xs sm:text-sm text-surface-dark font-bold leading-relaxed whitespace-pre-wrap">
                {msg.messageText}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-teal-800 border-t border-surface-border pt-1 font-extrabold">
                <span>Ref: {msg.referenceCode}</span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCheck className="h-3.5 w-3.5" /> Delivered
                </span>
              </div>
            </div>
          </div>
        ))}

        {smsLog.length === 0 && (
          <div className="text-center py-12 px-4 text-surface-dark/60 italic text-xs sm:text-sm">
            No SMS messages dispatched yet.
          </div>
        )}
      </div>

      {/* Quick Action Interactive Reply Bar */}
      <div className="p-3 bg-white border-t-2 border-surface-border space-y-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSendReply('1')}
            className="btn-tactile flex-1 rounded-xl border-2 border-emerald-400 bg-emerald-50 py-2.5 px-2 text-xs sm:text-sm font-black text-emerald-950 hover:bg-emerald-100 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Reply &ldquo;1&rdquo;</span>
            <span className="text-[11px] font-bold text-emerald-800">(Confirm)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSendReply('2')}
            className="btn-tactile flex-1 rounded-xl border-2 border-amber-400 bg-amber-50 py-2.5 px-2 text-xs sm:text-sm font-black text-amber-950 hover:bg-amber-100 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Reply &ldquo;2&rdquo;</span>
            <span className="text-[11px] font-bold text-amber-800">(Reschedule)</span>
          </button>
        </div>

        {/* Manual Reply Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendReply();
              }
            }}
            placeholder="Type SMS reply (e.g. 1)..."
            className="flex-1 rounded-xl border-2 border-surface-border bg-surface-base px-3.5 py-2 text-base sm:text-sm font-bold text-surface-dark focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
          <button
            type="button"
            onClick={() => handleSendReply()}
            className="btn-tactile rounded-xl bg-teal-800 px-4 py-2 font-black text-white hover:bg-teal-900 shadow-xs flex items-center justify-center shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
