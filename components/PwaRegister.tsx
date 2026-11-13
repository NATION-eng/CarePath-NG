'use client';

import React, { useEffect, useState } from 'react';
import { Download, WifiOff, Check } from 'lucide-react';
import { playChime } from '@/lib/audioVoice';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('CarePath ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('CarePath ServiceWorker registration failed:', err);
        });
    }

    // 2. Track Online/Offline Status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    // 3. Listen for PWA Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    playChime('confirm');
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Alert Strip (Crucial for rural clinics) */}
      {isOffline && (
        <div className="bg-amber-800 text-cream-100 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2 border-b border-amber-900 animate-in fade-in">
          <WifiOff className="h-4 w-4" />
          <span>Working Offline: Local Cache & Queued Actions Active</span>
        </div>
      )}

      {/* Floating PWA Install Banner (When installable) */}
      {isInstallable && !isInstalled && (
        <div className="fixed bottom-20 md:bottom-6 left-3 right-3 sm:left-auto sm:right-4 z-50 bg-teal-950 text-white p-3 sm:p-4 rounded-2xl shadow-float border-2 border-teal-700/80 flex items-center gap-3 animate-in slide-in-from-bottom duration-200 max-w-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-cream-200 shrink-0 font-black text-sm">
            CP
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-black text-white leading-tight">Install CarePath App</p>
            <p className="text-[11px] text-teal-200/90 font-medium">Add to phone home screen for fast offline access</p>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="btn-tactile rounded-xl bg-cream-200 hover:bg-cream-300 text-teal-950 px-3.5 py-2 font-black text-xs shadow-xs shrink-0"
          >
            Install
          </button>
        </div>
      )}
    </>
  );
}
