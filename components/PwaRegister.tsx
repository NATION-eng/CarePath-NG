'use client';

import React, { useEffect, useState } from 'react';
import { Download, WifiOff, Check, HeartHandshake, X, Share2 } from 'lucide-react';
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
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

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

      // Check if running in standalone mode (downloaded PWA)
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      
      if (isStandalone) {
        setIsInstalled(true);
      }

      // Check if iOS Safari
      const isIosDevice = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
      setIsIos(isIosDevice);
    }

    // 3. Listen for PWA Install Prompt (Chrome/Edge/Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

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
      {/* Offline Alert Strip (Crucial for rural clinics and downloaded PWA) */}
      {isOffline && (
        <div className="bg-amber-800 text-amber-50 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 border-b border-amber-900 safe-top sticky top-0 z-50 animate-in fade-in shadow-md">
          <WifiOff className="h-4 w-4 shrink-0 text-amber-200" />
          <span>CarePath Offline Mode: Device cache active. All records and cards are safely accessible.</span>
        </div>
      )}

      {/* Floating PWA Install Banner (Android / Chrome / Edge) */}
      {isInstallable && !isInstalled && !isBannerDismissed && (
        <div className="fixed bottom-20 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 bg-petrol-900/95 backdrop-blur-xl text-white p-3.5 sm:p-4 rounded-3xl shadow-float border-2 border-white/15 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 max-w-md">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-petrol-800 border border-petrol-700 text-peach-500 shrink-0 shadow-sm">
            <HeartHandshake className="h-6 w-6 stroke-[2.3]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-black text-white leading-tight">Install CarePath NG App</p>
            <p className="text-[11px] text-petrol-200 font-medium mt-0.5">Download to phone for 1-tap offline clinical records</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="btn-tactile rounded-xl bg-peach-500 hover:bg-peach-600 text-petrol-950 px-3.5 py-2 font-black text-xs shadow-peach"
            >
              Install App
            </button>
            <button
              type="button"
              onClick={() => setIsBannerDismissed(true)}
              className="p-1.5 text-petrol-400 hover:text-white rounded-lg"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Install Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center border-2 border-surface-border shadow-float safe-bottom">
            <div className="h-12 w-12 rounded-2xl bg-petrol-900 text-peach-500 flex items-center justify-center mx-auto mb-3">
              <Share2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-petrol-950 mb-1">Install on iPhone / iPad</h3>
            <p className="text-xs text-surface-dark/70 font-semibold mb-4 leading-relaxed">
              To download CarePath NG to your home screen for offline access:
            </p>
            <div className="bg-surface-base p-4 rounded-2xl border border-surface-border text-left space-y-2 text-xs font-bold text-petrol-950 mb-5">
              <p className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-peach-500 text-petrol-950 flex items-center justify-center font-black text-[11px] shrink-0">1</span>
                <span>Tap the <strong>Share button</strong> in Safari at the bottom of your screen.</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-peach-500 text-petrol-950 flex items-center justify-center font-black text-[11px] shrink-0">2</span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-peach-500 text-petrol-950 flex items-center justify-center font-black text-[11px] shrink-0">3</span>
                <span>Tap <strong>Add</strong> in top-right to launch standalone app.</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-petrol-900 text-white font-black text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
