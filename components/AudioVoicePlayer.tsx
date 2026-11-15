'use client';

import React, { useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { speakText, stopSpeaking } from '@/lib/audioVoice';

interface AudioVoicePlayerProps {
  pidginText: string;
  englishText: string;
  label?: string;
  compact?: boolean;
}

export function AudioVoicePlayer({
  pidginText,
  englishText,
  label = 'Spoken Reminder',
  compact = false,
}: AudioVoicePlayerProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'pidgin' | 'english'>('pidgin');
  const [isPlaying, setIsPlaying] = useState(false);

  const currentText = selectedLanguage === 'pidgin' ? pidginText : englishText;

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(
        currentText,
        selectedLanguage,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  const handleLanguageChange = (lang: 'pidgin' | 'english') => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    }
    setSelectedLanguage(lang);
  };

  return (
    <div className="rounded-2xl border border-petrol-200 bg-petrol-50/70 p-3.5 sm:p-4 transition-all shadow-subtle">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 font-black text-petrol-950 text-xs sm:text-sm flex-wrap">
          <Volume2 className="h-4.5 w-4.5 text-peach-600 animate-pulse shrink-0" />
          <span>{label}</span>
          <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded bg-peach-100 text-petrol-950 border border-peach-200">
            {selectedLanguage === 'pidgin' ? 'Pidgin' : 'English'}
          </span>
        </div>

        {/* Language Pill Selector */}
        <div className="flex items-center rounded-xl bg-white p-0.5 border border-petrol-200 shadow-xs">
          <button
            type="button"
            onClick={() => handleLanguageChange('pidgin')}
            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
              selectedLanguage === 'pidgin'
                ? 'bg-petrol-900 text-white shadow-xs'
                : 'text-surface-dark/70 hover:text-petrol-950'
            }`}
          >
            Pidgin
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('english')}
            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
              selectedLanguage === 'english'
                ? 'bg-petrol-900 text-white shadow-xs'
                : 'text-surface-dark/70 hover:text-petrol-950'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Spoken transcript quote */}
      <p className="text-petrol-950 font-medium leading-relaxed text-xs sm:text-sm bg-white p-3 rounded-xl border border-petrol-200/80 mb-3 shadow-xs">
        &ldquo;{currentText}&rdquo;
      </p>

      {/* Audio controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handlePlayToggle}
          className={`btn-tactile flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs sm:text-sm shadow-card transition-all ${
            isPlaying
              ? 'bg-rose-700 text-white hover:bg-rose-800'
              : 'bg-peach-500 hover:bg-peach-600 text-petrol-950 shadow-peach'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="h-4 w-4 fill-current" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-petrol-950" />
              <span>Listen in {selectedLanguage === 'pidgin' ? 'Pidgin' : 'English'}</span>
            </>
          )}
        </button>

        {/* Audio waveform visualization */}
        {isPlaying ? (
          <div className="flex items-center gap-1 h-5">
            <span className="w-1.5 bg-teal-600 rounded-full animate-bounce h-4" />
            <span className="w-1.5 bg-teal-700 rounded-full animate-bounce h-5 delay-75" />
            <span className="w-1.5 bg-teal-500 rounded-full animate-bounce h-3 delay-150" />
            <span className="w-1.5 bg-teal-800 rounded-full animate-bounce h-5 delay-100" />
            <span className="w-1.5 bg-teal-600 rounded-full animate-bounce h-3.5 delay-200" />
          </div>
        ) : (
          <span className="text-xs text-teal-900 font-bold">Clear human voice</span>
        )}
      </div>
    </div>
  );
}
