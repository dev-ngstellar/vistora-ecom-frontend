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
      { label: 'Brands', href: '/admin/brands', icon: Award },
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
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}) => {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
            {brandConfig.logoLetter}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm tracking-tight text-white truncate">
                {brandConfig.shortName} ADMIN
              </span>
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest leading-none">
                Enterprise Portal
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle button on desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
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
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <IconComponent
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />

                  {!collapsed && <span className="truncate">{item.label}</span>}

                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
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
      <div className="p-3 border-t border-slate-800 shrink-0">
        <Link
          href="/"
          className={`flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition text-xs font-semibold ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Back to Customer Store"
        >
          <Store className="w-4 h-4 text-amber-400 shrink-0" />
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
          collapsed ? 'w-20' : 'w-64'
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
        className={`md:hidden fixed top-0 bottom-0 left-0 w-64 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
