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
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800';

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

  const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.status === 'INACTIVE';

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative rounded-2xl bg-white p-3 border border-[#E5E7EB] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden h-full"
      >
        {/* Product Image Frame */}
        <Link
          href={`/product/${product.slug}`}
          className="block relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#F7F8FA] mb-3 cursor-pointer group/img"
        >
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out cursor-pointer ${
              isOutOfStock ? 'grayscale opacity-75' : ''
            }`}
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {isOutOfStock ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider shadow-xs">
                Out of Stock
              </span>
            ) : discountPercent ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-[#E66001] text-white shadow-xs">
                -{discountPercent}% OFF
              </span>
            ) : null}
            {product.featured && !isOutOfStock && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#A50025] text-white shadow-xs">
                <Sparkles className="w-3 h-3 text-[#E66001] fill-[#E66001]" />
                Featured
              </span>
            )}
          </div>

          {/* Action Icons */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                requireCustomerAuth(() => addToWishlist.mutate({ productId: product.id }));
              }}
              className="p-2 rounded-full bg-white/90 backdrop-blur-md text-[#111827] hover:text-[#A50025] hover:bg-white shadow-xs transition-all hover:scale-110"
              aria-label="Add to Wishlist"
              title="Add to Wishlist"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="p-2 rounded-full bg-white/90 backdrop-blur-md text-[#111827] hover:text-[#A50025] hover:bg-white shadow-xs transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Quick View"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </Link>

        {/* Product Meta Details */}
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1 text-[11px]">
              <span className="font-extrabold text-[#A50025] uppercase tracking-wider truncate">
                {product.category?.name || 'Vistora Selection'}
              </span>
              <div className="inline-flex items-center gap-1 text-amber-600 font-extrabold text-[11px]">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.8</span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="block group-hover:text-[#A50025] transition-colors">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#111827] line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Price & Add Button */}
          <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-[#111827]">
                {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>
              {compareAtPriceNum && compareAtPriceNum > priceNum && (
                <span className="text-[11px] font-semibold text-[#64748B] line-through">
                  {brandConfig.currency.symbol}{compareAtPriceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </span>
              )}
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
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1 transition-all shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#111827] hover:bg-[#A50025] text-white hover:scale-102'
              }`}
              title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#E66001]" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
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
