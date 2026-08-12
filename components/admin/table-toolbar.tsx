'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  onReset?: () => void;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  actions,
  onReset,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 flex-1 flex-wrap">
        {onSearchChange && (
          <div className="relative min-w-[200px] sm:w-64">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] text-xs font-medium text-[#111827] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#A50025] focus:bg-white transition-all"
            />
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        )}

        {filters}

        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#A50025] font-bold px-2 py-1 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
