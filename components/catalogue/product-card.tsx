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
        className="group relative rounded-[20px] bg-white p-3.5 border border-[#ECECEC] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
      >
        {/* Image Frame (~75% Card Height Ratio) */}
        <div className="relative w-full aspect-[3/4] rounded-[16px] overflow-hidden bg-[#FAFAFA] mb-3.5">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
              isOutOfStock ? 'grayscale opacity-75' : ''
            }`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isOutOfStock && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-[8px] text-[10px] font-black bg-rose-600 text-white shadow-xs uppercase tracking-wider">
                Out of Stock
              </span>
            )}
            {discountPercent && !isOutOfStock && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-[8px] text-[10px] font-black bg-[#F59E0B] text-white shadow-xs">
                -{discountPercent}% OFF
              </span>
            )}
            {product.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[10px] font-extrabold bg-[#B5123B] text-white shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                Featured
              </span>
            )}
          </div>

          {/* Top Right Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button
              onClick={() => requireCustomerAuth(() => addToWishlist.mutate({ productId: product.id }))}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#111111] hover:text-[#B5123B] hover:bg-white shadow-sm transition-all hover:scale-110"
              aria-label="Add to Wishlist"
              title="Add to Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#111111] hover:text-[#B5123B] hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Quick View"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Meta Info */}
        <div className="px-1 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px]">
              <span className="font-extrabold text-[#B5123B] uppercase tracking-wider truncate">
                {product.brand?.name || product.category?.name || 'Luxury Fashion'}
              </span>
              <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full text-amber-800 font-black text-[10px]">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="block group-hover:text-[#B5123B] transition-colors">
              <h3 className="text-sm font-extrabold text-[#111111] line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Color Swatches */}
            {colorVariants.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                {colorVariants.slice(0, 4).map((c) => (
                  <span
                    key={c.color}
                    title={c.color}
                    className="w-3 h-3 rounded-full border border-[#ECECEC] inline-block shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {colorVariants.length > 4 && (
                  <span className="text-[10px] text-[#6B7280] font-bold">+{colorVariants.length - 4}</span>
                )}
              </div>
            )}
          </div>

          {/* Price & Add to Cart Bar */}
          <div className="mt-3.5 pt-2.5 border-t border-[#ECECEC] flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-[#111111]">
                  {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </span>
                {compareAtPriceNum && compareAtPriceNum > priceNum && (
                  <span className="text-xs font-semibold text-[#6B7280] line-through">
                    {brandConfig.currency.symbol}{compareAtPriceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
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
              className={`px-3.5 py-2 rounded-[14px] font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-[#111827] hover:bg-[#B5123B] text-white hover:scale-102'
              }`}
              title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{isOutOfStock ? 'Sold Out' : 'Add'}</span>
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
