'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, Ticket, Image as ImageIcon, UserPlus, ShoppingBag, BarChart3 } from 'lucide-react';

export const DashboardQuickActions: React.FC = () => {
  const actions = [
    { label: 'Add Product', href: '/admin/products', icon: PlusCircle, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Create Coupon', href: '/admin/coupons', icon: Ticket, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Create Banner', href: '/admin/banners', icon: ImageIcon, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { label: 'Add Staff User', href: '/admin/users', icon: UserPlus, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Process Orders', href: '/admin/orders', icon: ShoppingBag, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'View Reports', href: '/admin/reports', icon: BarChart3, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <h3 className="font-black text-slate-900 dark:text-white text-base mb-4">Quick Executive Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link
              key={idx}
              href={act.href}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all text-center flex flex-col items-center justify-center gap-2 group bg-slate-50/50 dark:bg-slate-800/40"
            >
              <div className={`p-2.5 rounded-xl border ${act.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {act.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
