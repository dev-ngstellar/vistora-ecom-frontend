'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/catalogue.types';
import { QuickViewModal } from './quick-view-modal';
import { Heart, Eye, Sparkles, Star, ShoppingCart } from 'lucide-react';
import { useWishlistMutations, useCartMutations } from '@/hooks/use-shopping';
import { useAuth } from '@/context/auth-context';
import { brandConfig } from '@/config';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist } = useWishlistMutations();
  const { addToCart } = useCartMutations();
  const { requireCustomerAuth } = useAuth();

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

  const colorVariants = Array.from(
    new Map(
      product.variants
        ?.filter((v) => v.color)
        .map((v) => [v.color, { color: v.color!, hex: v.colorHex || '#1A1A1A' }])
    ).values()
  );

  const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.status === 'INACTIVE';

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative rounded-2xl bg-white p-3 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-maroon/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
      >
        {/* Image Frame */}
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-50 mb-3">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
              isOutOfStock ? 'grayscale opacity-75' : ''
            }`}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isOutOfStock && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-600 text-white shadow-xs uppercase tracking-wider">
                Out of Stock
              </span>
            )}
            {discountPercent && !isOutOfStock && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-orange text-white shadow-xs">
                -{discountPercent}%
              </span>
            )}
            {product.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-maroon text-white shadow-xs">
                <Sparkles className="w-3 h-3 fill-white" />
                Featured
              </span>
            )}
          </div>

          {/* Top Right Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
            <button
              onClick={() => requireCustomerAuth(() => addToWishlist.mutate({ productId: product.id }))}
              className="p-1.5 rounded-full bg-white/90 text-slate-700 hover:text-maroon hover:bg-white shadow-xs transition"
              aria-label="Add to Wishlist"
              title="Add to Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="p-1.5 rounded-full bg-white/90 text-slate-700 hover:text-maroon hover:bg-white shadow-xs transition opacity-0 group-hover:opacity-100"
              aria-label="Quick View"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Meta */}
        <div className="px-1 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1 text-[11px]">
              <span className="font-bold text-maroon uppercase tracking-wider truncate">
                {product.category?.name || 'Fashion'}
              </span>
              <div className="inline-flex items-center gap-1 bg-orange-light border border-orange-100 px-1.5 py-0.5 rounded text-orange font-bold text-[10px]">
                <Star className="w-3 h-3 fill-orange text-orange" />
                <span>4.8</span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="block group-hover:text-maroon transition-colors">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {/* Color Swatches */}
            {colorVariants.length > 0 && (
              <div className="flex items-center gap-1 mt-1.5">
                {colorVariants.slice(0, 4).map((c) => (
                  <span
                    key={c.color}
                    title={c.color}
                    className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {colorVariants.length > 4 && (
                  <span className="text-[9px] text-slate-400 font-semibold">+{colorVariants.length - 4}</span>
                )}
              </div>
            )}
          </div>

          {/* Price & Add to Cart Bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-extrabold text-slate-900">
                  {brandConfig.currency.symbol}{priceNum.toFixed(2)}
                </span>
                {compareAtPriceNum && compareAtPriceNum > priceNum && (
                  <span className="text-[11px] font-semibold text-slate-400 line-through">
                    {brandConfig.currency.symbol}{compareAtPriceNum.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() =>
                !isOutOfStock &&
                addToCart.mutate({
                  productId: product.id,
                  quantity: 1,
                  productName: product.name,
                  productSlug: product.slug,
                  price: priceNum,
                  imageUrl: primaryImage,
                })
              }
              disabled={isOutOfStock || addToCart.isPending}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-maroon hover:bg-maroon-dark text-white'
              }`}
              title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isOutOfStock ? 'Out of Stock' : 'Add'}</span>
            </button>
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
