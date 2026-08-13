'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AdminSidebar } from '@/components/navigation/admin-sidebar';
import { AdminHeader } from '@/components/navigation/admin-header';
import { ConfigProvider, theme, App } from 'antd';
import AntdStaticSetter from '@/lib/antd';

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
        <App>
          <AntdStaticSetter />
          <div className={`min-h-screen flex flex-col antialiased selection:bg-[#A50025] selection:text-white transition-colors duration-300 relative overflow-hidden ${
            themeMode === 'dark' 
              ? 'dark bg-slate-950 text-slate-100' 
              : 'bg-slate-50 text-slate-900'
          }`}>
            {/* Soft Glowing Ambient Lights */}
            <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-gradient-to-br from-[#A50025]/8 dark:from-[#A50025]/5 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse duration-[10000ms]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-indigo-500/8 dark:from-indigo-500/4 to-transparent blur-[130px] pointer-events-none -z-10" />
            <div className="absolute top-[25%] left-[20%] w-[35%] h-[35%] rounded-full bg-gradient-to-br from-amber-500/3 dark:from-amber-500/1 to-transparent blur-[110px] pointer-events-none -z-10" />

            {/* Dot Grid Layer */}
            <div className="absolute inset-0 dot-grid pointer-events-none -z-20 opacity-80" />

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
              <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-[1440px] w-full mx-auto space-y-5 relative z-10">
                {children}
              </main>

              {/* Admin Footer */}
              <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 backdrop-blur-xs relative z-10">
                <span>© {new Date().getFullYear()} {brandConfig.name} Administration Portal</span>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">v1.0.0</span>
              </footer>
            </div>
          </div>
        </App>
      </ConfigProvider>
    </ProtectedRoute>
  );
}

