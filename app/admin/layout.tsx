'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AdminSidebar } from '@/components/navigation/admin-sidebar';
import { AdminHeader } from '@/components/navigation/admin-header';

import { brandConfig } from '@/config';

export default function AdminGlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        {/* Sidebar */}
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Content Wrapper */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            collapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
        >
          {/* Header */}
          <AdminHeader
            onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
            collapsed={collapsed}
          />

          {/* Main Scrollable Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Admin Footer */}
          <footer className="py-4 px-6 border-t border-slate-200 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} {brandConfig.name} Administration Portal</span>
            <span className="text-[11px] font-mono text-slate-400">v1.0.0</span>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
