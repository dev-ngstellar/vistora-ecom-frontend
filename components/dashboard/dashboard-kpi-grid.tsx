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
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
    },
    {
      title: 'Total Orders',
      value: (metrics?.totalOrders ?? 0).toLocaleString('en-IN'),
      change: '+8.7%',
      isPositive: true,
      icon: ShoppingBag,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
    },
    {
      title: 'Total Customers',
      value: (metrics?.totalCustomers ?? 0).toLocaleString('en-IN'),
      change: '+11.3%',
      isPositive: true,
      icon: Users,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50',
    },
    {
      title: 'Total Products',
      value: `${metrics?.totalProducts ?? 0} SKUs`,
      change: '+5.0%',
      isPositive: true,
      icon: Package,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50',
    },
    {
      title: 'Pending Fulfillment',
      value: metrics?.pendingOrders ?? 0,
      subtitle: 'Requires dispatch action',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50',
    },
    {
      title: 'Completed Orders',
      value: metrics?.completedOrders ?? 0,
      subtitle: 'Successfully delivered',
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
    },
    {
      title: 'Low Stock Products',
      value: `${metrics?.lowStockCount ?? 0} SKUs`,
      subtitle: 'Restock required soon',
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50',
    },
    {
      title: 'Pending Reviews',
      value: metrics?.pendingReviews ?? 0,
      subtitle: 'Awaiting moderation',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 border-yellow-100 dark:border-yellow-900/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-2xl border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </h3>

              <div className="flex items-center justify-between mt-1 text-[11px]">
                {card.change ? (
                  <div
                    className={`flex items-center gap-1 font-extrabold ${
                      card.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                    }`}
                  >
                    {card.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{card.change} vs last period</span>
                  </div>
                ) : (
                  <span className="text-slate-500 font-medium">{card.subtitle}</span>
                )}
                <span className="text-slate-400 text-[10px]">Live</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
