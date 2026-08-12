'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  toolbar,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-5 shadow-2xs space-y-3 mb-5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#64748B] font-medium mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
      </div>

      {toolbar && <div className="pt-2 border-t border-[#E5E7EB]">{toolbar}</div>}
    </div>
  );
};
