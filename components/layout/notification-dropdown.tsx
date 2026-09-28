'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  ShoppingBag,
  CreditCard,
  Truck,
  AlertTriangle,
  UserCheck,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { AppNotification } from '@/services/notification.service';

const formatTimeAgo = (dateInput: string | Date | null): string => {
  if (!dateInput) return 'Just now';
  const now = new Date();
  const date = new Date(dateInput);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

export const NotificationDropdown: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (item: AppNotification) => {
    if (item.status === 'UNREAD') {
      markAsRead(item.id);
    }
    if (item.actionUrl) {
      setIsOpen(false);
      router.push(item.actionUrl);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ORDER':
        return (
          <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
        );
      case 'PAYMENT':
        return (
          <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <CreditCard className="w-4 h-4" />
          </div>
        );
      case 'SHIPPING':
        return (
          <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
            <Truck className="w-4 h-4" />
          </div>
        );
      case 'INVENTORY':
        return (
          <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#A50025] dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition focus:outline-none cursor-pointer"
        aria-label="Admin Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A50025] ring-2 ring-white dark:ring-slate-950" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">Store Notifications</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A50025]/10 text-[#A50025] dark:bg-rose-950/40 dark:text-rose-400">
                  {unreadCount} new
                </span>
              ) : null}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                disabled={isMarkingAllRead}
                className="text-[11px] font-bold text-[#A50025] dark:text-rose-400 hover:underline transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isMarkingAllRead ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-84 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50 custom-scrollbar">
            {isLoading ? (
              <div className="py-8 text-center space-y-2">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />
                <p className="text-xs text-slate-400">Loading live notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center space-y-2 px-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Bell className="w-5 h-5 opacity-50" />
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">No Notifications</div>
                <p className="text-[11px] text-slate-400">
                  New customer orders, payments, and store alerts will appear here in real time.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start gap-3 transition cursor-pointer ${
                    item.status === 'UNREAD'
                      ? 'bg-[#A50025]/5 dark:bg-rose-950/20 hover:bg-[#A50025]/10'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-80 hover:opacity-100'
                  }`}
                >
                  {getNotificationIcon(item.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {item.message}
                    </p>
                    {item.actionUrl && (
                      <div className="flex items-center gap-1 text-[10px] text-[#A50025] dark:text-rose-400 font-bold mt-1.5">
                        <span>View Details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Live Order & System Notification Feed
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
