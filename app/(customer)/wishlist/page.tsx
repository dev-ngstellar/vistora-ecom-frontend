'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { useWishlist, useWishlistMutations } from '@/hooks/use-shopping';
import { WishlistCard } from '@/components/shopping/wishlist-card';
import { EmptyWishlist } from '@/components/shopping/empty-states';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { data: wishlistSummary, isLoading } = useWishlist();
  const { removeFromWishlist, moveToCart } = useWishlistMutations();

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const items = wishlistSummary?.items || [];

  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16 pt-3">
        {/* Wishlist Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-[#A50025] text-xs font-bold uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 fill-[#A50025] text-[#A50025]" />
              <span>Saved Favorites</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
              My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h1>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs font-extrabold text-[#111827] hover:text-[#A50025] hover:bg-[#FFF0F3] hover:border-[#A50025]/30 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore More Products</span>
          </Link>
        </div>

        {/* Wishlist Items Uniform Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {items.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onMoveToCart={(itemId) => moveToCart.mutate(itemId)}
              onRemoveItem={(itemId) => removeFromWishlist.mutate(itemId)}
              disabled={moveToCart.isPending || removeFromWishlist.isPending}
            />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
