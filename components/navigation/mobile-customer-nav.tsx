'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { customerNavItems } from './customer-nav';
import { brandConfig } from '@/config';
import { SearchBar } from '@/components/layout/search-bar';
import { 
  Menu, 
  X, 
  Sparkles, 
  Shield, 
  LogIn, 
  UserPlus, 
  LogOut,
  ChevronRight,
  Info,
  Phone,
  HelpCircle,
  FileText,
  Lock
} from 'lucide-react';

export const MobileCustomerNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleDrawer = () => setIsOpen(!isOpen);

  const footerLinks = [
    { label: 'About Us', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: Phone },
    { label: 'FAQ', href: '/faq', icon: HelpCircle },
    { label: 'Privacy Policy', href: '/privacy-policy', icon: Lock },
    { label: 'Terms of Service', href: '/terms', icon: FileText },
  ];

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleDrawer}
        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
        aria-label="Toggle Navigation Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[280px] max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <img
              src={brandConfig.logoUrl}
              alt="Vistora Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="font-bold text-sm tracking-wider uppercase text-white">Vistora</span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <SearchBar placeholder="Search fashion..." />
        </div>

        {/* User Card */}
        {isAuthenticated && user ? (
          <div className="p-4 border-b border-slate-100 bg-maroon-light flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-maroon text-white flex items-center justify-center font-bold text-sm">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-maroon font-medium uppercase">{user.role}</p>
              </div>
            </div>

            {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'MANAGER') && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-maroon text-white hover:bg-maroon-dark transition"
                title="Admin Dashboard"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="p-4 border-b border-slate-100 grid grid-cols-2 gap-2">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-maroon text-xs font-semibold text-white hover:bg-maroon-dark transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </Link>
          </div>
        )}

        {/* Primary Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Menu Navigation
          </p>

          {customerNavItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(item.href + '/');

            const IconComponent = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-maroon text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`} />
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 mt-4 space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Information & Support
            </p>
            {footerLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <IconComponent className="w-4 h-4 text-slate-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Logout */}
        {isAuthenticated && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/80">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
