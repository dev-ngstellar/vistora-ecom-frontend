'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      {/* Sleek Minimal Progress Line Loader - NO LOGO */}
      <div className="relative w-64 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden shadow-inner">
        <div className="absolute inset-y-0 bg-gradient-to-r from-[#A50025] via-[#E66001] to-[#A50025] w-full rounded-full animate-progress-glow" />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#A50025] animate-ping" />
        <h3 className="text-xs font-black uppercase tracking-widest text-[#A50025]">
          Loading Vistora...
        </h3>
      </div>
    </div>
  );
}
