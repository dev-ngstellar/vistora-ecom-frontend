'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, ArrowRight } from 'lucide-react';

export const EmptyCart: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto space-y-4 my-8">
      <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        <ShoppingBag className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Shopping Cart is Empty</h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        Explore our curated luxury collections, haute couture outerwear, and artisanal accessories to find your next wardrobe statement.
      </p>
      <div className="pt-2">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition shadow-xl"
        >
          <span>Explore Shop Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export const EmptyWishlist: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto space-y-4 my-8">
      <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mx-auto">
        <Heart className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Wishlist is Empty</h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        Save your favorite runway pieces and high-priority items so you can revisit or move them straight to your shopping cart whenever you wish.
      </p>
      <div className="pt-2">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition shadow-xl"
        >
          <span>Discover Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
