'use client';

import React from 'react';
import Link from 'next/link';
import { brandConfig, navigationConfig } from '@/config';
import { SearchBar } from '@/components/layout/search-bar';
import { UserMenu } from '@/components/layout/user-menu';
import { Heart, ShoppingBag } from 'lucide-react';

export const MinimalHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 tracking-tight">
            <span className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center font-mono text-base">
              {brandConfig.logoLetter}
            </span>
            <span>{brandConfig.shortName}</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-600">
            {navigationConfig.mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-900 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs">
            <SearchBar />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <Link href="/wishlist" className="p-2 text-slate-700 hover:text-slate-900 transition" title="Wishlist">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="p-2 text-slate-700 hover:text-slate-900 transition" title="Cart">
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
