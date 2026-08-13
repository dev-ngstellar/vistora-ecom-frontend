'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AdminSidebar } from '@/components/navigation/admin-sidebar';
import { AdminHeader } from '@/components/navigation/admin-header';
import { ConfigProvider, theme } from 'antd';

import { brandConfig } from '@/config';

export default function AdminGlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme') as 'light' | 'dark';
    if (saved) {
      setThemeMode(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    localStorage.setItem('admin-theme', next);
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <ConfigProvider
        theme={{
          algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#A50025',
            borderRadius: 12,
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          components: {
            Table: {
              headerBg: themeMode === 'dark' ? '#1E293B' : '#F8FAFC',
              headerColor: themeMode === 'dark' ? '#F1F5F9' : '#1F2937',
            },
          },
        }}
      >
        <div className={`min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${
          themeMode === 'dark' 
            ? 'dark bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100' 
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100/50 to-slate-200/80 text-slate-900'
        }`}>
          {/* Sidebar */}
          <AdminSidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
            themeMode={themeMode}
          />

          {/* Content Wrapper */}
          <div
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
              collapsed ? 'md:ml-20' : 'md:ml-60'
            }`}
          >
            {/* Header */}
            <AdminHeader
              onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
              collapsed={collapsed}
              themeMode={themeMode}
              onToggleTheme={toggleTheme}
            />

            {/* Main Scrollable Content */}
            <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-[1440px] w-full mx-auto space-y-5">
              {children}
            </main>

            {/* Admin Footer */}
            <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 backdrop-blur-xs">
              <span>© {new Date().getFullYear()} {brandConfig.name} Administration Portal</span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">v1.0.0</span>
            </footer>
          </div>
        </div>
      </ConfigProvider>
    </ProtectedRoute>
  );
}
