'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Module Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-10 text-center">
      <div className="p-4 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 mb-4">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <h2 className="text-xl font-bold text-slate-900">Admin Module Error</h2>
      <p className="mt-1 text-xs text-slate-600 max-w-sm">
        An issue occurred while loading this administrative section.
      </p>

      {error.message && (
        <div className="mt-3 p-3 rounded-xl bg-slate-100 font-mono text-[11px] text-slate-700 max-w-md">
          {error.message}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Module</span>
        </button>

        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
