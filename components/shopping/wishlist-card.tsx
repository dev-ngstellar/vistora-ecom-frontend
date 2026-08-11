'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WishlistItemResponse } from '@/types/shopping.types';
import { ShoppingBag, Trash2, Sparkles } from 'lucide-react';
import { brandConfig } from '@/config';

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

  const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price);
  const compareNum = item.compareAtPrice
    ? typeof item.compareAtPrice === 'number'
      ? item.compareAtPrice
      : parseFloat(item.compareAtPrice)
    : null;

  const discountPercent =
    compareNum && compareNum > priceNum
      ? Math.round(((compareNum - priceNum) / compareNum) * 100)
      : null;

  return (
    <div className="group relative rounded-2xl bg-white p-3.5 border border-[#E5E7EB] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
      
      {/* Product Image Frame (Uniform Contain Container) */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#F7F8FA] mb-3 flex items-center justify-center border border-[#E5E7EB]/60">
        <Image
          src={fallbackImage}
          alt={item.productName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-[#E66001] text-white shadow-xs">
              -{discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Remove Trash Icon Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemoveItem(item.id);
          }}
          disabled={disabled}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-md text-[#64748B] hover:text-[#A50025] hover:bg-white shadow-xs transition-all hover:scale-110 z-10"
          title="Remove from Wishlist"
          aria-label="Remove from Wishlist"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Details & Actions */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/product/${item.productSlug}`}
            className="font-extrabold text-xs text-[#111827] hover:text-[#A50025] transition-colors line-clamp-2 leading-snug block mb-1"
          >
            {item.productName}
          </Link>

          {(item.variantColor || item.variantSize) && (
            <span className="text-[11px] font-medium text-[#64748B] block mb-1.5">
              {item.variantColor} {item.variantSize && `• ${item.variantSize}`}
            </span>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-black text-[#111827]">
              {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </span>
            {compareNum && compareNum > priceNum && (
              <span className="text-[11px] font-semibold text-[#64748B] line-through">
                {brandConfig.currency.symbol}{compareNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>
            )}
          </div>
        </div>

        {/* Move to Cart Action Button */}
        <button
          type="button"
          onClick={() => onMoveToCart(item.id)}
          disabled={disabled}
          className="w-full h-11 rounded-xl bg-[#111827] hover:bg-[#A50025] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#E66001] group-hover/btn:rotate-12 transition-transform duration-200" />
          <span>Move to Cart</span>
        </button>
      </div>
    </div>
  );
};
