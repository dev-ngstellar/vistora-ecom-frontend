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
      className={`bg-white rounded-xl border border-[#E5E7EB] shadow-2xs transition-all duration-200 ${className}`}
    >
      {(title || subtitle || action) && (
        <div
          className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            headerBorder ? 'border-b border-[#E5E7EB]' : ''
          }`}
        >
          <div>
            {title && (
              <h3 className="font-extrabold text-sm sm:text-base text-[#111827] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#64748B] font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};
