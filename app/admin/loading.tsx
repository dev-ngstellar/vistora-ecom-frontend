import React from 'react';
import { Loader2, Shield } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 animate-pulse">
        <Shield className="w-8 h-8" />
      </div>
      <div className="w-10 h-10 rounded-full border-3 border-indigo-200 border-t-indigo-600 animate-spin" />
      <p className="mt-4 text-xs font-semibold text-slate-700">Loading Admin Portal Data...</p>
    </div>
  );
}
