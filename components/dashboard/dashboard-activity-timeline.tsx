import React from 'react';
import { ShoppingBag, Package, UserCheck, Star, Clock } from 'lucide-react';
import dayjs from 'dayjs';

export const DashboardActivityTimeline: React.FC = () => {
  const activities = [
    {
      id: 'act-1',
      title: 'New Luxury Order #ORD-2026-1001',
      description: 'Customer Aisha Sharma purchased Haute Couture Evening Gown (₹27,138.82)',
      time: '10 mins ago',
      icon: ShoppingBag,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      id: 'act-2',
      title: 'New Customer Registered',
      description: 'Rohan Mehta created a verified buyer account',
      time: '45 mins ago',
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      id: 'act-3',
      title: 'Product Review Submitted',
      description: '5-Star rating received for Velvet Silk Blazer',
      time: '2 hours ago',
      icon: Star,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      id: 'act-4',
      title: 'Restock Alert Triggered',
      description: 'Cashmere Tailored Coat inventory dropped below minimum threshold (3 units remaining)',
      time: '4 hours ago',
      icon: Package,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <h3 className="font-black text-slate-900 dark:text-white text-base mb-4">Live Activity Stream</h3>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 text-xs">
        {activities.map((act) => {
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
