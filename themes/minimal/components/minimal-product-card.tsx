'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/platform/types';
import { useWishlistMutations } from '@/platform/hooks';
import { brandConfig } from '@/config';
import { Heart } from 'lucide-react';

interface MinimalProductCardProps {
  product: Product;
}

export const MinimalProductCard: React.FC<MinimalProductCardProps> = ({ product }) => {
  const { addToWishlist } = useWishlistMutations();

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800';

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <div className="group relative bg-white border border-slate-100 rounded-md overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all">
      <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <button
          onClick={() => addToWishlist.mutate({ productId: product.id })}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-slate-700 hover:text-rose-600 transition shadow-xs"
          title="Save to Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {product.category?.name || 'Catalog'}
        </div>

        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-semibold text-slate-900 truncate hover:underline">
            {product.name}
          </h3>
        </Link>

        <div className="text-sm font-bold text-slate-900 pt-1">
          {brandConfig.currency.symbol}{priceNum.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
