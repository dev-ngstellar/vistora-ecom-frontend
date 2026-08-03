'use client';

import React from 'react';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  CONNECTED: {
    label: 'Connected',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  ACTIVE: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  DISCONNECTED: {
    label: 'Disconnected',
    className: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: <XCircle className="w-3 h-3" />,
  },
  INACTIVE: {
    label: 'Inactive',
    className: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: <XCircle className="w-3 h-3" />,
  },
  TESTING: {
    label: 'Testing…',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  ERROR: {
    label: 'Error',
    className: 'bg-red-50 text-red-700 border-red-200',
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = statusConfig[status] ?? statusConfig['DISCONNECTED'];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.className}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};
