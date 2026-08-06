'use client';

import React from 'react';
import Link from 'next/link';
import { CustomerNav } from '@/components/navigation/customer-nav';
import { MobileCustomerNav } from '@/components/navigation/mobile-customer-nav';
import { SearchBar } from '@/components/layout/search-bar';
import { UserMenu } from '@/components/layout/user-menu';
import { Heart, ShoppingBag, Sparkles, Package } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-200">
      {/* Top Notice Bar */}
      <div className="bg-maroon text-white text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
        <span>Enjoy Free Express Delivery on Orders Over {brandConfig.currency.symbol}150 • Use Code: VISTORA20</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Mobile drawer & Logo */}
          <div className="flex items-center gap-3">
            <MobileCustomerNav />
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src={brandConfig.logoUrl}
                alt="Vistora Logo"
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-maroon leading-none">
                  {brandConfig.shortName}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-orange leading-none mt-0.5">
                  STOREFRONT
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <CustomerNav />

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <SearchBar />
          </div>

          {/* Action Icons & User Menu */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Orders Quick Link */}
            <button
              onClick={() => requireCustomerAuth(() => router.push('/orders'))}
              className="hidden sm:flex p-2 rounded-xl text-slate-700 hover:text-maroon hover:bg-maroon-light transition"
              title="My Orders"
            >
              <Package className="w-5 h-5" />
            </button>

            {/* Wishlist Quick Link */}
            <button
              onClick={() => requireCustomerAuth(() => router.push('/wishlist'))}
              className="relative p-2 rounded-xl text-slate-700 hover:text-maroon hover:bg-maroon-light transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-orange text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                  {wishCount}
                </span>
              )}
            </button>

            {/* Cart Quick Link */}
            <Link
              href="/cart"
              className="relative p-2 rounded-xl text-slate-700 hover:text-maroon hover:bg-maroon-light transition"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-orange text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile Dropdown */}
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
