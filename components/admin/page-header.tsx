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
      className={`bg-white/85 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-205/60 dark:border-slate-800/80 p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] space-y-3 mb-5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
      </div>

      {toolbar && <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">{toolbar}</div>}
    </div>
  );
};
