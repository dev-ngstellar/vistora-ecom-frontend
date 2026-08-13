'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, Ticket, Image as ImageIcon, UserPlus, ShoppingBag, BarChart3 } from 'lucide-react';

export const DashboardQuickActions: React.FC = () => {
  const actions = [
    { label: 'Add Product', href: '/admin/products', icon: PlusCircle, color: 'text-indigo-600 dark:text-indigo-450 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30' },
    { label: 'Create Coupon', href: '/admin/coupons', icon: Ticket, color: 'text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' },
    { label: 'Create Banner', href: '/admin/banners', icon: ImageIcon, color: 'text-purple-600 dark:text-purple-450 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30' },
    { label: 'Add Staff User', href: '/admin/users', icon: UserPlus, color: 'text-blue-600 dark:text-blue-450 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30' },
    { label: 'Process Orders', href: '/admin/orders', icon: ShoppingBag, color: 'text-amber-600 dark:text-amber-450 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30' },
    { label: 'View Reports', href: '/admin/reports', icon: BarChart3, color: 'text-[#A50025] dark:text-rose-450 bg-[#FFF0F3] dark:bg-rose-950/20 border-[#A50025]/20 dark:border-rose-900/30' },
  ];

  return (
    <div className="bg-white/45 dark:bg-slate-900/30 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
      <h3 className="font-black text-slate-900 dark:text-white text-base mb-4 tracking-tight">Quick Executive Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link
              key={idx}
              href={act.href}
              className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 hover:-translate-y-1 hover:border-[#A50025]/30 dark:hover:border-slate-700/80 transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 group bg-white/30 dark:bg-slate-900/20 hover:bg-white/60 dark:hover:bg-slate-900/40 hover:shadow-lg hover:shadow-[#A50025]/3 dark:hover:shadow-[#A50025]/5"
            >
              <div className={`p-2.5 rounded-xl border transition-transform duration-300 group-hover:scale-110 ${act.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xs text-slate-850 dark:text-slate-200 group-hover:text-[#A50025] dark:group-hover:text-rose-450 transition-colors">
                {act.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

