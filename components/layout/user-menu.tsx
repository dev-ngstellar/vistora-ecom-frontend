'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { 
  User as UserIcon, 
  LogOut, 
  Package, 
  Heart, 
  Shield, 
  UserCheck, 
  LogIn, 
  UserPlus, 
  ChevronDown 
} from 'lucide-react';

export const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdminOrManager =
    user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={() => openAuthModal('login')}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black text-white bg-[#B5123B] hover:bg-[#8E0E2E] rounded-[14px] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
        title="Sign In or Register Account"
      >
        <LogIn className="w-4 h-4 text-amber-300" />
        <span>Sign In</span>
      </button>
    );
  }

  const userInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-[14px] hover:bg-slate-100/80 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-[10px] bg-[#B5123B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
          {userInitial}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-extrabold text-[#111111] leading-tight">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">
            {user.role}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#B5123B]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-[20px] bg-white shadow-2xl border border-[#ECECEC] py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
          <div className="px-4 py-3 border-b border-[#ECECEC]">
            <p className="text-xs font-bold text-[#111111] truncate">
              {user.fullName || `${user.firstName} ${user.lastName}`}
            </p>
            <p className="text-[11px] text-[#6B7280] truncate mt-0.5">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FDF2F5] hover:text-[#B5123B] transition-colors"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FDF2F5] hover:text-[#B5123B] transition-colors"
            >
              <Package className="w-4 h-4 text-slate-400" />
              <span>My Orders</span>
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FDF2F5] hover:text-[#B5123B] transition-colors"
            >
              <Heart className="w-4 h-4 text-slate-400" />
              <span>Wishlist</span>
            </Link>

            {isAdminOrManager && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#B5123B] hover:bg-[#FDF2F5] transition-colors"
              >
                <Shield className="w-4 h-4 text-[#B5123B]" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          <div className="border-t border-[#ECECEC] pt-1 mt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition font-bold text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
