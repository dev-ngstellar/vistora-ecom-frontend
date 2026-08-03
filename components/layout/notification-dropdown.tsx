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
        className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition focus:outline-none"
        aria-label="Admin Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition ${
                  !item.read ? 'bg-indigo-50/30' : ''
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    item.type === 'order'
                      ? 'bg-emerald-100 text-emerald-600'
                      : item.type === 'inventory'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-indigo-100 text-indigo-600'
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
                    <h5 className="text-xs font-semibold text-slate-800 truncate">{item.title}</h5>
                    <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{item.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-slate-100 text-center">
            <span className="text-[11px] font-semibold text-slate-400">
              System Notifications Live Feed
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
