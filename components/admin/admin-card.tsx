'use client';

import React from 'react';

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  headerBorder?: boolean;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  headerBorder = true,
}) => {
  return (
    <div
      className={`bg-white/85 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-250/60 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300 ${className}`}
    >
      {(title || subtitle || action) && (
        <div
          className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            headerBorder ? 'border-b border-slate-100 dark:border-slate-800/80' : ''
          }`}
        >
          <div>
            {title && (
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};
