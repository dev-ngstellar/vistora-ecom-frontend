'use client';

import React from 'react';
import Link from 'next/link';
import { CustomerNav } from '@/components/navigation/customer-nav';
import { MobileCustomerNav } from '@/components/navigation/mobile-customer-nav';
import { SearchBar } from '@/components/layout/search-bar';
import { UserMenu } from '@/components/layout/user-menu';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';

import { brandConfig } from '@/config';

export const CustomerHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-200">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Discover New Season Collections — Enjoy Free Express Shipping on Orders Over {brandConfig.currency.symbol}150</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-6">
          {/* Mobile menu drawer trigger & Logo */}
          <div className="flex items-center gap-3">
            <MobileCustomerNav />
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-lg tracking-wider shadow-md group-hover:scale-105 transition-transform duration-200">
                {brandConfig.logoLetter}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">
                  {brandConfig.shortName}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none mt-0.5">
                  COMMERCE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation links */}
          <CustomerNav />

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-2">
            <SearchBar />
          </div>

          {/* Action Icons & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist quick link */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart quick link */}
            <Link
              href="/cart"
              className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            </Link>

            {/* User Profile Dropdown */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
