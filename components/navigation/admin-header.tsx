'use client';

import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { DynamicBreadcrumb } from '@/components/navigation/breadcrumb';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import { UserMenu } from '@/components/layout/user-menu';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  collapsed: boolean;
  themeMode?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileSidebar,
  themeMode = 'light',
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs transition-colors duration-300">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile menu hamburger toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition"
          aria-label="Toggle Mobile Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Admin Breadcrumbs */}
        <div className="min-w-0 flex-1 text-slate-700 dark:text-slate-300">
          <DynamicBreadcrumb admin={true} />
        </div>
      </div>

      {/* Right controls: Theme, Notifications & User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition duration-200"
          title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {themeMode === 'dark' ? (
            <Sun className="w-4.5 h-4.5 text-amber-500" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-[#A50025]" />
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <NotificationDropdown />
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
        <UserMenu />
      </div>
    </header>
  );
};
