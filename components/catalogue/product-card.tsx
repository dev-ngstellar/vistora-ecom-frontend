'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/catalogue.types';
import { QuickViewModal } from './quick-view-modal';
import { Heart, Eye, Sparkles, Star, ShoppingCart, Check } from 'lucide-react';
import { useCart, useWishlist, useWishlistMutations, useCartMutations } from '@/hooks/use-shopping';
import { useAuth } from '@/context/auth-context';
import { brandConfig } from '@/config';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { data: cartData } = useCart();
  const { data: wishlistData } = useWishlist();
  const { addToWishlist, removeFromWishlist } = useWishlistMutations();
  const { addToCart } = useCartMutations();
  const { requireCustomerAuth } = useAuth();

  const wishlistItem = wishlistData?.items?.find((item) => item.productId === product.id);
  const isInWishlist = Boolean(wishlistItem);

  const cartItem = cartData?.items?.find((item) => item.productId === product.id);
  const isInCart = Boolean(cartItem);

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

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requireCustomerAuth(() => {
      if (isInWishlist && wishlistItem) {
        removeFromWishlist.mutate(wishlistItem.id);
      } else {
        addToWishlist.mutate({ productId: product.id });
      }
    });
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (isInCart) {
      router.push('/cart');
      return;
    }
    addToCart.mutate({
      productId: product.id,
      quantity: 1,
      productName: product.name,
      productSlug: product.slug,
      price: priceNum,
      imageUrl: primaryImage,
    });
  };

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
              onClick={handleWishlistClick}
              className={`p-2 rounded-full backdrop-blur-md shadow-xs transition-all hover:scale-110 flex items-center justify-center ${
                isInWishlist
                  ? 'bg-[#FFF0F3] text-[#A50025] border border-[#A50025]/40'
                  : 'bg-white/90 text-[#111827] hover:text-[#A50025] hover:bg-white'
              }`}
              aria-label={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              title={isInWishlist ? 'In Wishlist (Click to remove)' : 'Add to Wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-[#A50025] text-[#A50025]' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="p-2 rounded-full bg-white/90 backdrop-blur-md text-[#111827] hover:text-[#A50025] hover:bg-white shadow-xs transition-all hover:scale-110"
              aria-label="Quick View"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </Link>

        {/* Product Details */}
        <div className="space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-[#A50025] mb-1">
              <span className="uppercase tracking-wider truncate">
                {product.category?.name || 'Vistora Collection'}
              </span>
              <div className="flex items-center gap-0.5 text-amber-600 font-extrabold text-[11px] shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.8</span>
              </div>
            </div>

            <Link
              href={`/product/${product.slug}`}
              className="font-extrabold text-xs text-[#111827] hover:text-[#A50025] transition-colors line-clamp-2 leading-snug block mb-1"
            >
              {product.name}
            </Link>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-black text-[#111827]">
                  {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </span>
                {compareAtPriceNum && compareAtPriceNum > priceNum && (
                  <span className="text-[11px] font-semibold text-[#64748B] line-through">
                    {brandConfig.currency.symbol}{compareAtPriceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                  </span>
                )}
              </div>
            </div>

            <button
              disabled={isOutOfStock}
              onClick={handleCartClick}
              className={`p-2 rounded-xl transition-all duration-200 shadow-xs flex items-center justify-center ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : isInCart
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-[#111827] hover:bg-[#A50025] text-white hover:scale-105'
              }`}
              title={
                isOutOfStock
                  ? 'Out of Stock'
                  : isInCart
                  ? 'Already in Cart (Click to view Bag)'
                  : 'Add to Cart'
              }
            >
              {isInCart ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <ShoppingCart className="w-4 h-4 text-[#E66001]" />
              )}
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
