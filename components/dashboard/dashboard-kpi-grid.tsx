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
      color: 'text-[#A50025] bg-[#FFF0F3] border-[#A50025]/20',
    },
    {
      title: 'Total Orders',
      value: (metrics?.totalOrders ?? 0).toLocaleString('en-IN'),
      change: '+8.7%',
      isPositive: true,
      icon: ShoppingBag,
      color: 'text-[#E66001] bg-[#FFFBEB] border-[#E66001]/20',
    },
    {
      title: 'Total Customers',
      value: (metrics?.totalCustomers ?? 0).toLocaleString('en-IN'),
      change: '+11.3%',
      isPositive: true,
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Total Products',
      value: `${metrics?.totalProducts ?? 0}`,
      change: '+6.0%',
      isPositive: true,
      icon: Package,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Low Stock',
      value: metrics?.lowStockCount ?? 0,
      subtitle: 'Requires attention',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Pending Reviews',
      value: metrics?.pendingReviews ?? 0,
      subtitle: 'Awaiting moderation',
      icon: Star,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#A50025]/30 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${card.color} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2">
              <h3 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
                {card.value}
              </h3>

              <div className="flex items-center justify-between mt-0.5 text-[10px]">
                {card.change ? (
                  <div
                    className={`flex items-center gap-0.5 font-bold ${
                      card.isPositive ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {card.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{card.change} vs 7d</span>
                  </div>
                ) : (
                  <span className="text-[#64748B] font-medium truncate">{card.subtitle}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
