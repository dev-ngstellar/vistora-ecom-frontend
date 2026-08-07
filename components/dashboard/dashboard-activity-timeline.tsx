'use client';

import React from 'react';
import { ShoppingBag, Package, UserCheck, Star, Activity } from 'lucide-react';
import dayjs from 'dayjs';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: any;
  color: string;
}

interface DashboardActivityTimelineProps {
  analytics?: any;
}

export const DashboardActivityTimeline: React.FC<DashboardActivityTimelineProps> = ({ analytics }) => {
  const dynamicActivities: ActivityItem[] = [];

  // Recent Orders
  if (analytics?.orders?.recentOrders?.length > 0) {
    analytics.orders.recentOrders.slice(0, 2).forEach((o: any) => {
      dynamicActivities.push({
        id: `ord-${o.id}`,
        title: `New Store Order #${o.id}`,
        description: `Customer ${o.customer} placed an order of ₹${Number(o.amount).toLocaleString('en-IN')}`,
        time: (dayjs(o.date) as any).fromNow ? (dayjs(o.date) as any).fromNow() : dayjs(o.date).format('MMM D, HH:mm'),
        icon: ShoppingBag,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      });
    });
  }

  // Top Customers / New Registrations
  if (analytics?.customers?.topCustomers?.length > 0) {
    const cust = analytics.customers.topCustomers[0];
    dynamicActivities.push({
      id: `cust-${cust.id}`,
      title: 'Top VIP Customer Activity',
      description: `${cust.name} (${cust.email}) accumulated ₹${Number(cust.totalSpent).toLocaleString('en-IN')} across ${cust.ordersCount} orders`,
      time: 'Recently',
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    });
  }

  // Low Stock Alert
  if (analytics?.products?.lowStockProducts?.length > 0) {
    const p = analytics.products.lowStockProducts[0];
    dynamicActivities.push({
      id: `stock-${p.id}`,
      title: 'Restock Alert Triggered',
      description: `${p.name} (SKU: ${p.sku}) inventory at ${p.stock} units remaining`,
      time: 'Attention Required',
      icon: Package,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    });
  }

  // Fallback if no activity yet
  if (dynamicActivities.length === 0) {
    dynamicActivities.push({
      id: 'system-ready',
      title: 'System Operational Stream Active',
      description: 'Listening for live order placements, customer registrations, and catalog inventory movements...',
      time: 'Live',
      icon: Activity,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-slate-900 dark:text-white text-base">Live Activity Stream</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
          Live Database Feed
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 text-xs">
        {dynamicActivities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="relative flex items-start gap-3">
              <div className="absolute -left-6 top-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-full border border-slate-200 dark:border-slate-800">
                <Icon className="w-3.5 h-3.5 text-indigo-600" />
              </div>

              <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white">{act.title}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">{act.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
