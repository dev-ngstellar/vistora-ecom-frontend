import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <Sparkles className="w-6 h-6 text-indigo-600 absolute animate-pulse" />
      </div>
      <h3 className="mt-6 text-base font-semibold text-slate-800">Loading Vistora Commerce...</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-xs">
        Preparing curated luxury catalog & experience
      </p>
    </div>
  );
}
