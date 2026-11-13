'use client';

import React, { useState } from 'react';
import { Volume2, Square, Globe, Sparkles } from 'lucide-react';
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
    <div className={`rounded-xl border border-teal-800/10 bg-cream-100 p-3.5 transition-all ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 font-semibold text-teal-900">
          <Volume2 className="h-4 w-4 text-teal-700 animate-pulse" />
          <span>{label}</span>
          <span className="text-[11px] font-normal px-1.5 py-0.5 rounded bg-cream-200 text-teal-800">
            {selectedLanguage === 'pidgin' ? 'Nigerian Pidgin' : 'English'}
          </span>
        </div>

        {/* Language Pill Selector */}
        <div className="flex items-center rounded-lg bg-surface-card p-0.5 border border-surface-border">
          <button
            type="button"
            onClick={() => handleLanguageChange('pidgin')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              selectedLanguage === 'pidgin'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-surface-dark/70 hover:text-teal-900'
            }`}
          >
            Pidgin
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('english')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              selectedLanguage === 'english'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-surface-dark/70 hover:text-teal-900'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Spoken transcript quote */}
      <p className="text-surface-dark/85 italic leading-relaxed text-xs bg-white/70 p-2.5 rounded-lg border border-teal-900/5 mb-3">
        &ldquo;{currentText}&rdquo;
      </p>

      {/* Audio controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePlayToggle}
          className={`btn-tactile flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium text-xs shadow-xs transition-colors ${
            isPlaying
              ? 'bg-red-700 text-white hover:bg-red-800'
              : 'bg-teal-800 text-white hover:bg-teal-900'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="h-3.5 w-3.5 fill-current" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="h-3.5 w-3.5" />
              <span>Listen in {selectedLanguage === 'pidgin' ? 'Pidgin' : 'English'}</span>
            </>
          )}
        </button>

        {/* Audio waveform visualization */}
        {isPlaying ? (
          <div className="flex items-center gap-0.5 h-4">
            <span className="w-1 bg-teal-600 rounded-full animate-bounce h-3" />
            <span className="w-1 bg-teal-700 rounded-full animate-bounce h-4 delay-75" />
            <span className="w-1 bg-teal-500 rounded-full animate-bounce h-2 delay-150" />
            <span className="w-1 bg-teal-800 rounded-full animate-bounce h-4 delay-100" />
            <span className="w-1 bg-teal-600 rounded-full animate-bounce h-2.5 delay-200" />
          </div>
        ) : (
          <span className="text-[11px] text-teal-800/70 font-medium">Clear spoken audio</span>
        )}
      </div>
    </div>
  );
}
