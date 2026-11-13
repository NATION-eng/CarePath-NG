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
    <div className="rounded-xl border border-teal-800/15 bg-cream-100 p-4 transition-all shadow-subtle">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 font-black text-teal-950 text-sm sm:text-base">
          <Volume2 className="h-5 w-5 text-teal-800 animate-pulse" />
          <span>{label}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-cream-200 text-teal-900 border border-teal-800/10">
            {selectedLanguage === 'pidgin' ? 'Nigerian Pidgin' : 'English'}
          </span>
        </div>

        {/* Language Pill Selector */}
        <div className="flex items-center rounded-xl bg-surface-card p-1 border border-surface-border shadow-xs">
          <button
            type="button"
            onClick={() => handleLanguageChange('pidgin')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
              selectedLanguage === 'pidgin'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-surface-dark/70 hover:text-teal-950'
            }`}
          >
            Pidgin
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('english')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
              selectedLanguage === 'english'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-surface-dark/70 hover:text-teal-950'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Spoken transcript quote */}
      <p className="text-teal-950 font-semibold leading-relaxed text-xs sm:text-sm bg-white/90 p-3.5 rounded-xl border border-teal-900/10 mb-3.5 shadow-xs">
        &ldquo;{currentText}&rdquo;
      </p>

      {/* Audio controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePlayToggle}
          className={`btn-tactile flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs sm:text-sm shadow-card transition-all ${
            isPlaying
              ? 'bg-red-700 text-white hover:bg-red-800'
              : 'bg-teal-800 text-white hover:bg-teal-900'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="h-4 w-4 fill-current" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
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
