'use client';

import React from 'react';
import Link from 'next/link';
import { CustomerNav } from '@/components/navigation/customer-nav';
import { MobileCustomerNav } from '@/components/navigation/mobile-customer-nav';
import { SearchBar } from '@/components/layout/search-bar';
import { UserMenu } from '@/components/layout/user-menu';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart, useWishlistCount } from '@/hooks/use-shopping';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { brandConfig } from '@/config';

export const CustomerHeader: React.FC = () => {
  const { data: cartSummary } = useCart();
  const { data: wishlistCount } = useWishlistCount();
  const { requireCustomerAuth } = useAuth();
  const router = useRouter();

  const cartItemCount = cartSummary?.itemCount || 0;
  const wishCount = wishlistCount || 0;

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-300">
      {/* Top Notice Bar */}
      <div className="bg-[#B5123B] text-white text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
        <span>Complimentary Worldwide Express Shipping on Orders Over <strong>{brandConfig.currency.symbol}150</strong></span>
        <span className="hidden sm:inline-block text-white/30">•</span>
        <span className="hidden sm:inline-flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-200 border border-white/20">
          Code: VISTORA20
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
          {/* Mobile drawer & Brand Logo */}
          <div className="flex items-center gap-3">
            <MobileCustomerNav />
            <Link href="/" className="flex items-center group py-1">
              <img
                src={brandConfig.logoUrl}
                alt={brandConfig.name}
                className="h-12 sm:h-14 w-auto min-w-[120px] max-w-[200px] object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <CustomerNav />

          {/* Desktop Expandable Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <SearchBar />
          </div>

          {/* Action Icons & User Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Wishlist Quick Link */}
            <button
              onClick={() => requireCustomerAuth(() => router.push('/wishlist'))}
              className="relative p-2.5 rounded-[14px] text-[#111111] hover:text-[#B5123B] hover:bg-[#FDF2F5] transition-all border border-transparent hover:border-[#B5123B]/20 group"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#B5123B] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in duration-200">
                  {wishCount}
                </span>
              )}
            </button>

            {/* Cart Quick Link */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-[14px] bg-[#111827] text-white hover:bg-[#B5123B] transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] font-extrabold text-xs group"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline">Bag</span>
              {cartItemCount > 0 && (
                <span className="min-w-[20px] h-[20px] px-1 rounded-full bg-[#F59E0B] text-white text-[10px] font-black flex items-center justify-center border border-white/20 animate-in zoom-in duration-200">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile Dropdown / Sign In Trigger */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};
