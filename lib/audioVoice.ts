'use client';

// Shared singleton AudioContext to prevent repeated expensive hardware initialization
let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    } else if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

// Sound effect generator for medical app tactile audio chime (Deferred Non-Blocking)
export function playChime(type: 'reminder' | 'confirm' | 'alert') {
  if (typeof window === 'undefined') return;

  // Run in a macro-task so event handlers return in 0ms without blocking UI updates or layout
  setTimeout(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (type === 'reminder') {
        // Pleasant hospital reminder chime (Two harmonic tones)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25); // D6

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
      } else if (type === 'confirm') {
        // Success confirmation chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Gracefully ignore audio autoplay restrictions
    }
  }, 0);
}

// Spoken voice engine using Web Speech Synthesis API (Deferred Non-Blocking)
export function speakText(
  text: string,
  language: 'pidgin' | 'english',
  onStart?: () => void,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  // Defer speech engine initialization to keep UI handlers silky smooth
  setTimeout(() => {
    try {
      window.speechSynthesis.cancel();
      playChime('reminder');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = language === 'pidgin' ? 0.95 : 0.92;
      utterance.pitch = 1.05;

      // Look for Nigerian/British/African voice if present in system
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang.includes('en-NG') || v.lang.includes('en-ZA') || v.lang.includes('en-GB') || v.name.includes('Nigeria')) ||
        voices.find((v) => v.lang.includes('en')) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      if (onStart) utterance.onstart = onStart;
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }, 60);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}
