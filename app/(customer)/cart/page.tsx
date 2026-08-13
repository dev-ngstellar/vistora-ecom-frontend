'use client';

import React from 'react';
import { useCart, useCartMutations } from '@/hooks/use-shopping';
import { CartItemCard } from '@/components/shopping/cart-item-card';
import { CartSummaryCard } from '@/components/shopping/cart-summary-card';
import { EmptyCart } from '@/components/shopping/empty-states';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';

export default function CartPage() {
  const { data: cartSummary, isLoading } = useCart();
  const { updateCartItem, removeCartItem, clearCart } = useCartMutations();

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-4 animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto" />
        <div className="h-6 bg-slate-200 rounded-full w-48 mx-auto" />
        <div className="h-4 bg-slate-200 rounded-full w-64 mx-auto" />
      </div>
    );
  }

  const items = cartSummary?.items || [];

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-maroon text-xs font-bold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4 text-orange" />
            <span>Shopping Bag</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your Cart ({cartSummary?.itemCount || 0} items)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="text-xs font-bold text-slate-600 hover:text-maroon flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          <button
            onClick={() => clearCart.mutate()}
            disabled={clearCart.isPending}
            className="px-4 py-2 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>
        </div>
      </div>

      {/* Cart Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={(itemId, qty) =>
                updateCartItem.mutate({ itemId, quantity: qty })
              }
              onRemoveItem={(itemId) => removeCartItem.mutate(itemId)}
              disabled={updateCartItem.isPending || removeCartItem.isPending}
            />
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          {cartSummary && <CartSummaryCard summary={cartSummary} />}
        </div>
      </div>
    </div>
  );
}
