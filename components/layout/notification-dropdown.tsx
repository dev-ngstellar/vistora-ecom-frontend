'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, ShoppingBag, UserCheck, AlertTriangle } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'inventory' | 'customer';
  read: boolean;
}

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'New High Value Order',
      message: 'Order #ORD-2026-8911 placed by Super Admin ($1,290.00)',
      time: '10m ago',
      type: 'order',
      read: false,
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'Product "Silk Evening Gown" inventory reached low threshold (3 left)',
      time: '1h ago',
      type: 'inventory',
      read: false,
    },
    {
      id: '3',
      title: 'New Customer Registered',
      message: 'Customer Jane Doe verified email account',
      time: '3h ago',
      type: 'customer',
      read: true,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition focus:outline-none"
        aria-label="Admin Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-850/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-450">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-indigo-650 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50 custom-scrollbar">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 flex items-start gap-3 hover:bg-slate-5 transition ${
                  !item.read 
                    ? 'bg-indigo-50/30 dark:bg-indigo-950/10' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    item.type === 'order'
                      ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450'
                      : item.type === 'inventory'
                      ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450'
                      : 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-450'
                  }`}
                >
                  {item.type === 'order' ? (
                    <ShoppingBag className="w-4 h-4" />
                  ) : item.type === 'inventory' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-semibold text-slate-850 dark:text-slate-200 truncate">{item.title}</h5>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-400 mt-0.5 line-clamp-2">{item.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-[11px] font-semibold text-slate-405 dark:text-slate-500">
              System Notifications Live Feed
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
