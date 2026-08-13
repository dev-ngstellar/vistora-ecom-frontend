'use client';

import React from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface DashboardKPIGridProps {
  metrics?: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    completedOrders: number;
    lowStockCount: number;
    pendingReviews: number;
  };
}

export const DashboardKPIGrid: React.FC<DashboardKPIGridProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${(metrics?.totalRevenue ?? 0).toLocaleString('en-IN')}`,
      change: '+14.2%',
      isPositive: true,
      icon: IndianRupee,
      color: 'text-[#A50025] dark:text-rose-400 bg-[#FFF0F3] dark:bg-rose-950/20 border-[#A50025]/20 dark:border-rose-900/30',
      hoverGlow: 'hover:shadow-rose-500/5 dark:hover:shadow-rose-500/10',
    },
    {
      title: 'Total Orders',
      value: (metrics?.totalOrders ?? 0).toLocaleString('en-IN'),
      change: '+8.7%',
      isPositive: true,
      icon: ShoppingBag,
      color: 'text-[#E66001] dark:text-amber-400 bg-[#FFFBEB] dark:bg-amber-950/20 border-[#E66001]/20 dark:border-amber-900/30',
      hoverGlow: 'hover:shadow-amber-500/5 dark:hover:shadow-amber-500/10',
    },
    {
      title: 'Total Customers',
      value: (metrics?.totalCustomers ?? 0).toLocaleString('en-IN'),
      change: '+11.3%',
      isPositive: true,
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30',
      hoverGlow: 'hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10',
    },
    {
      title: 'Total Products',
      value: `${metrics?.totalProducts ?? 0}`,
      change: '+6.0%',
      isPositive: true,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30',
      hoverGlow: 'hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10',
    },
    {
      title: 'Low Stock',
      value: metrics?.lowStockCount ?? 0,
      subtitle: 'Requires attention',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
      hoverGlow: 'hover:shadow-amber-500/5 dark:hover:shadow-amber-500/10',
    },
    {
      title: 'Pending Reviews',
      value: metrics?.pendingReviews ?? 0,
      subtitle: 'Awaiting moderation',
      icon: Star,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30',
      hoverGlow: 'hover:shadow-purple-500/5 dark:hover:shadow-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-205/60 dark:border-slate-800/80 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:border-[#A50025]/30 dark:hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between ${card.hoverGlow}`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${card.color} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </h3>

              <div className="flex items-center justify-between mt-0.5 text-[10px]">
                {card.change ? (
                  <div
                    className={`flex items-center gap-0.5 font-bold ${
                      card.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-450'
                    }`}
                  >
                    {card.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{card.change} vs 7d</span>
                  </div>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 font-medium truncate">{card.subtitle}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
