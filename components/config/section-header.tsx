'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Save } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  label: string;
  title: string;
  description?: string;
  onSave?: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  label,
  title,
  description,
  onSave,
  isSaving = false,
  saveLabel = 'Save Changes',
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-sm text-slate-500 max-w-lg">{description}</p>}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {children}
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving…' : saveLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};
