'use client';

import React from 'react';
import { HeartHandshake } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
}

export function BrandLogo({
  size = 'md',
  showText = true,
  subtitle = 'Maternal, Child & Family Continuity',
  badge = 'National Health',
  onClick,
}: BrandLogoProps) {
  const iconContainerDimensions =
    size === 'sm' ? 'h-9 w-9 min-w-[2.25rem] rounded-xl' : size === 'lg' ? 'h-14 w-14 min-w-[3.5rem] rounded-2xl' : 'h-11 w-11 min-w-[2.75rem] rounded-2xl';

  const iconSize =
    size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-7 w-7' : 'h-6 w-6';

  const titleSize =
    size === 'sm' ? 'text-base sm:text-lg' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl';

  return (
    <div 
      className={`flex items-center gap-2.5 sm:gap-3 ${onClick ? 'cursor-pointer select-none' : ''}`}
      onClick={onClick}
    >
      {/* Emblem: Two hands shaking to form a heart */}
      <div 
        className={`${iconContainerDimensions} bg-petrol-800/90 border-2 border-mint-500/40 text-peach-500 flex items-center justify-center shadow-md backdrop-blur-md shrink-0 transition-transform duration-200 hover:scale-105`}
      >
        <HeartHandshake className={`${iconSize} stroke-[2.3] text-peach-500`} />
      </div>

      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`${titleSize} font-black tracking-tight text-white leading-none truncate`}>
              CarePath NG
            </span>
            {badge && (
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-mint-900 text-mint-200 border border-mint-700/60 hidden sm:inline-block tracking-wider shrink-0">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] font-bold text-petrol-200 tracking-wide leading-none mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
