'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WishlistItemResponse } from '@/types/shopping.types';
import { ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistCardProps {
  item: WishlistItemResponse;
  onMoveToCart: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  disabled?: boolean;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  item,
  onMoveToCart,
  onRemoveItem,
  disabled = false,
}) => {
  const fallbackImage =
    item.imageUrl ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400';

  return (
    <div className="group relative rounded-3xl bg-white p-4 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-100 mb-3">
        <Image
          src={fallbackImage}
          alt={item.productName}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        <button
          type="button"
          onClick={() => onRemoveItem(item.id)}
          disabled={disabled}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-500 hover:text-red-600 hover:bg-white shadow-xs transition z-10"
          title="Remove from Wishlist"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/product/${item.productSlug}`}
            className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1"
          >
            {item.productName}
          </Link>

          {(item.variantColor || item.variantSize) && (
            <span className="text-xs text-slate-400 block mt-0.5">
              {item.variantColor} {item.variantSize && `(Size ${item.variantSize})`}
            </span>
          )}

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-extrabold text-slate-900">
              ${item.price.toFixed(2)}
            </span>
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <span className="text-xs font-semibold text-slate-400 line-through">
                ${item.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onMoveToCart(item.id)}
          disabled={disabled}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Move to Cart</span>
        </button>
      </div>
    </div>
  );
};
