'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { useWishlist, useWishlistMutations } from '@/hooks/use-shopping';
import { WishlistCard } from '@/components/shopping/wishlist-card';
import { EmptyWishlist } from '@/components/shopping/empty-states';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { data: wishlistSummary, isLoading } = useWishlist();
  const { removeFromWishlist, moveToCart } = useWishlistMutations();

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-4 animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto" />
        <div className="h-6 bg-slate-200 rounded-full w-48 mx-auto" />
        <div className="h-4 bg-slate-200 rounded-full w-64 mx-auto" />
      </div>
    );
  }

  const items = wishlistSummary?.items || [];

  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="space-y-8 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-pink-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 fill-pink-600" />
              <span>Saved Favorites</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Wishlist ({items.length} items)
            </h1>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore More Products</span>
          </Link>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
