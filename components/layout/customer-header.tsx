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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all duration-300 shadow-xs">
      {/* 1. TOP OFFER BAR (28-32px height, #A50025 Maroon bg, #E66001 Orange badge) */}
      <div className="bg-[#A50025] text-white text-[11px] h-7 sm:h-8 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-[#E66001] fill-[#E66001] shrink-0" />
        <span>Enjoy <strong>Free Express Delivery</strong> on Orders Over ₹1500</span>
        <span className="hidden sm:inline-block text-white/30">•</span>
        <span className="hidden sm:inline-flex items-center gap-1 bg-[#E66001] text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
          CODE: VISTORA1500
        </span>
      </div>

      {/* 2. STICKY MARKETPLACE HEADER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-6">
          {/* Logo & Mobile Menu Drawer */}
          <div className="flex items-center gap-3 shrink-0">
            <MobileCustomerNav />
            <Link href="/" className="flex items-center group py-1">
              <img
                src={brandConfig.logoUrl}
                alt={brandConfig.name}
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Simple Desktop Nav Links */}
          <CustomerNav />

          {/* Centered Wide Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2">
            <SearchBar placeholder="Search products, brands & categories..." />
          </div>

          {/* Action Buttons: Wishlist, Cart, User Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Wishlist Button */}
            <button
              onClick={() => requireCustomerAuth(() => router.push('/wishlist'))}
              className="relative p-2.5 rounded-xl text-[#111827] hover:text-[#A50025] hover:bg-[#FFF0F3] transition-all group"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#A50025] text-white text-[10px] font-black flex items-center justify-center border border-white shadow-xs">
                  {wishCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[#111827] text-white hover:bg-[#A50025] transition-all duration-200 shadow-xs font-extrabold text-xs group"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#E66001] group-hover:rotate-12 transition-transform duration-200" />
              <span className="hidden sm:inline">Bag</span>
              {cartItemCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#E66001] text-white text-[10px] font-black flex items-center justify-center border border-white/20">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile Menu */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-3">
          <SearchBar placeholder="Search products & categories..." />
        </div>
      </div>
    </header>
  );
};
