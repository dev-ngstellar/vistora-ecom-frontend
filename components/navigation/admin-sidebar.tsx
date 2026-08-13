'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Award, 
  Layers, 
  Boxes, 
  ShoppingBag, 
  Users, 
  Ticket, 
  Star, 
  Image as ImageIcon, 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Store,
  Sparkles
} from 'lucide-react';

import { brandConfig } from '@/config';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export interface AdminNavGroup {
  groupTitle: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    groupTitle: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }],
  },
  {
    groupTitle: 'Catalog & Inventory',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Retailers', href: '/admin/brands', icon: Award },
      { label: 'Collections', href: '/admin/collections', icon: Layers },
      { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    ],
  },
  {
    groupTitle: 'Sales & Customers',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
      { label: 'Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    groupTitle: 'Content & Media',
    items: [
      { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
      { label: 'CMS Pages', href: '/admin/cms', icon: FileText },
    ],
  },
  {
    groupTitle: 'Administration',
    items: [
      { label: 'Users', href: '/admin/users', icon: UserCheck },
      { label: 'Roles', href: '/admin/roles', icon: ShieldCheck },
      { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  themeMode?: 'light' | 'dark';
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  themeMode = 'light',
}) => {
  const pathname = usePathname();

  const isDark = themeMode === 'dark';

  const sidebarContent = (
    <div className={`admin-sidebar flex flex-col h-full transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-950/90 text-slate-300 border-r border-slate-900/80' 
        : 'bg-white/90 text-slate-700 border-r border-slate-200/80'
    } backdrop-blur-md`}>
      {/* Brand Header */}
      <div className={`h-16 px-4 flex items-center justify-between border-b shrink-0 ${
        isDark ? 'border-slate-900/80' : 'border-slate-100'
      }`}>
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <img
            src={brandConfig.logoUrl}
            alt="Vistora Logo"
            className="h-9 w-auto object-contain shrink-0"
          />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className={`font-black text-sm tracking-tight truncate ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}>
                {brandConfig.shortName} ADMIN
              </span>
              <span className="text-[9px] font-bold text-orange uppercase tracking-widest leading-none">
                Enterprise Portal
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle button on desktop */}
        <button
          onClick={onToggleCollapse}
          className={`hidden md:flex p-1.5 rounded-xl transition ${
            isDark 
              ? 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800' 
              : 'bg-slate-50 text-slate-500 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {adminNavGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <p className={`px-3 text-[10px] font-bold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {group.groupTitle}
              </p>
            )}

            {group.items.map((item) => {
              const isActive =
                item.href === '/admin/dashboard'
                  ? pathname === '/admin/dashboard' || pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative ${
                    isActive
                      ? 'sidebar-link-active bg-gradient-to-r from-[#A50025] to-[#7D001C] !text-white shadow-md shadow-[#A50025]/30'
                      : isDark
                        ? '!text-slate-400 hover:!text-slate-100 hover:bg-slate-900/60'
                        : '!text-slate-650 hover:!text-slate-950 hover:bg-slate-50'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <IconComponent
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive 
                        ? '!text-white' 
                        : isDark 
                          ? '!text-slate-400 group-hover:!text-slate-200' 
                          : '!text-slate-500 group-hover:!text-slate-850'
                    }`}
                  />

                  {!collapsed && <span className="truncate">{item.label}</span>}

                  {collapsed && (
                    <div className={`absolute left-full ml-3 px-2.5 py-1.5 text-xs font-medium rounded-lg shadow-xl border opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap ${
                      isDark 
                        ? 'bg-slate-900 text-white border-slate-800' 
                        : 'bg-white text-slate-900 border-slate-200'
                    }`}>
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Store Switcher */}
      <div className={`p-3 border-t shrink-0 ${
        isDark ? 'border-slate-900/80' : 'border-slate-100'
      }`}>
        <Link
          href="/"
          className={`sidebar-link flex items-center gap-3 p-2.5 rounded-xl transition text-xs font-semibold ${
            collapsed ? 'justify-center' : ''
          } ${
            isDark 
              ? 'bg-slate-900/50 hover:bg-slate-900 !text-slate-350 hover:!text-white' 
              : 'bg-slate-50 hover:bg-slate-100 !text-slate-600 hover:!text-slate-950'
          }`}
          title="Back to Customer Store"
        >
          <Store className="w-4 h-4 text-amber-500 shrink-0" />
          {!collapsed && <span>View Customer Store</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="md:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 w-60 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
