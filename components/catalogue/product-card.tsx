'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/catalogue.types';
import { QuickViewModal } from './quick-view-modal';
import { Heart, Eye, Sparkles, Star } from 'lucide-react';
import { useWishlistMutations } from '@/hooks/use-shopping';

import { brandConfig } from '@/config';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist } = useWishlistMutations();

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800';

  const secondaryImage =
    product.images?.find((img) => !img.isPrimary)?.imageUrl || primaryImage;

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const compareAtPriceNum = product.compareAtPrice
    ? typeof product.compareAtPrice === 'string'
      ? parseFloat(product.compareAtPrice)
      : product.compareAtPrice
    : null;

  const discountPercent =
    compareAtPriceNum && compareAtPriceNum > priceNum
      ? Math.round(((compareAtPriceNum - priceNum) / compareAtPriceNum) * 100)
      : null;

  // Color Swatches
  const colorVariants = Array.from(
    new Map(
      product.variants
        ?.filter((v) => v.color)
        .map((v) => [v.color, { color: v.color!, hex: v.colorHex || '#1A1A1A' }])
    ).values()
  );

  // Available Sizes
  const availableSizes = Array.from(
    new Set(product.variants?.filter((v) => v.size).map((v) => v.size!))
  );

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative rounded-3xl bg-white dark:bg-slate-900 p-3 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
      >
        {/* Image Frame with Smooth Hover Transition */}
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                Featured
              </span>
            )}
            {discountPercent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-xs">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Top Right Quick Actions */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            <button
              onClick={() => addToWishlist.mutate({ productId: product.id })}
              className="p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-600 hover:bg-white shadow-xs transition"
              aria-label="Add to Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-indigo-600 hover:bg-white shadow-xs transition opacity-0 group-hover:opacity-100"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Meta */}
        <div className="px-1 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1 text-[11px]">
              <span className="font-extrabold text-indigo-600 uppercase tracking-wider truncate">
                {product.category?.name || 'Couture'}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>4.9</span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="block group-hover:text-indigo-600 transition-colors">
              <h3 className="text-sm font-serif font-light text-slate-900 dark:text-white line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {/* Color Swatch Dots */}
            {colorVariants.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                {colorVariants.slice(0, 4).map((c) => (
                  <span
                    key={c.color}
                    title={c.color}
                    className="w-3 h-3 rounded-full border border-slate-300 shadow-xs inline-block"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {colorVariants.length > 4 && (
                  <span className="text-[10px] text-slate-400 font-semibold">+{colorVariants.length - 4}</span>
                )}
              </div>
            )}
          </div>

          {/* Price & Sizes Bar */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 dark:text-white">
                {brandConfig.currency.symbol}{priceNum.toFixed(2)}
              </span>
              {compareAtPriceNum && compareAtPriceNum > priceNum && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  {brandConfig.currency.symbol}{compareAtPriceNum.toFixed(2)}
                </span>
              )}
            </div>

            {availableSizes.length > 0 && (
              <div className="flex items-center gap-1">
                {availableSizes.slice(0, 3).map((sz) => (
                  <span
                    key={sz}
                    className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                  >
                    {sz}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        open={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
