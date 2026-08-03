'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { DynamicBreadcrumb } from '@/components/navigation/breadcrumb';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import { UserMenu } from '@/components/layout/user-menu';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  collapsed: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile menu hamburger toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-label="Toggle Mobile Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Admin Breadcrumbs */}
        <div className="min-w-0 flex-1">
          <DynamicBreadcrumb admin={true} />
        </div>
      </div>

      {/* Right controls: Notifications & User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <NotificationDropdown />
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />
        <UserMenu />
      </div>
    </header>
  );
};
