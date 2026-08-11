'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/use-catalogue';
import { ProductGallery } from '@/components/catalogue/product-gallery';
import { VariantSelector } from '@/components/catalogue/variant-selector';
import { ProductDetailSkeleton } from '@/components/catalogue/skeleton-loaders';
import { ProductVariant } from '@/types/catalogue.types';
import { useCart, useCartMutations, useWishlist, useWishlistMutations } from '@/hooks/use-shopping';
import {
  ShoppingBag,
  Heart,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  Tag,
  CheckCircle2,
  Lock,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { brandConfig } from '@/config';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params['slug'] as string;
  const router = useRouter();
  const { requireCustomerAuth } = useAuth();

  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: cartData } = useCart();
  const { addToCart } = useCartMutations();
  const { data: wishlistData } = useWishlist();
  const { addToWishlist, removeFromWishlist } = useWishlistMutations();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

  const wishlistItem = wishlistData?.items?.find((item) => item.productId === product?.id);
  const isInWishlist = Boolean(wishlistItem);

  const cartItem = cartData?.items?.find(
    (item) =>
      item.productId === product?.id &&
      (!selectedVariant || item.variantId === selectedVariant.id)
  );
  const isInCart = Boolean(cartItem);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-2xl font-black text-[#111827]">Product Not Found</h1>
        <p className="text-xs text-[#64748B]">The product you are looking for may have been archived or removed.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A50025] text-white font-extrabold text-xs"
        >
          Return to Shop Catalog
        </Link>
      </div>
    );
  }

  const priceNum = selectedVariant
    ? typeof selectedVariant.price === 'string'
      ? parseFloat(selectedVariant.price)
      : selectedVariant.price
    : typeof product.price === 'string'
    ? parseFloat(product.price)
    : product.price;

  const compareNum = selectedVariant?.compareAtPrice
    ? typeof selectedVariant.compareAtPrice === 'string'
      ? parseFloat(selectedVariant.compareAtPrice)
      : selectedVariant.compareAtPrice
    : product.compareAtPrice
    ? typeof product.compareAtPrice === 'string'
      ? parseFloat(product.compareAtPrice)
      : product.compareAtPrice
    : null;

  const discountPercent =
    compareNum && compareNum > priceNum
      ? Math.round(((compareNum - priceNum) / compareNum) * 100)
      : null;

  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;

  const primaryImg = product.images?.find((i) => i.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || '';

  const isOutOfStock =
    product.status === 'OUT_OF_STOCK' ||
    product.status === 'INACTIVE' ||
    (selectedVariant ? selectedVariant.stock <= 0 : false);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (isInCart) {
      router.push('/cart');
      return;
    }
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      quantity,
      productName: product.name,
      productSlug: product.slug,
      price: priceNum,
      imageUrl: primaryImg,
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (isInCart) {
      router.push('/checkout');
      return;
    }
    addToCart.mutate(
      {
        productId: product.id,
        variantId: selectedVariant?.id || null,
        quantity,
        productName: product.name,
        productSlug: product.slug,
        price: priceNum,
        imageUrl: primaryImg,
      },
      {
        onSuccess: () => {
          requireCustomerAuth(() => {
            router.push('/checkout');
          });
        },
      }
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pb-14 pt-0">

      {/* Amazon-Style 3-Column Compact Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        
        {/* COLUMN 1: Vertical Thumbnails + Main Gallery (4 Cols - Max 360px) */}
        <div className="lg:col-span-4 max-w-[360px] mx-auto lg:mx-0 lg:sticky lg:top-20">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* COLUMN 2: Middle Product Details & Variant Options (5 Cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="space-y-1.5 border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A50025] bg-[#FFF0F3] px-2.5 py-0.5 rounded-full border border-[#A50025]/20">
                {product.category?.name || 'Vistora Selection'}
              </span>
              <div className="inline-flex items-center gap-1 text-amber-600 font-extrabold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.8</span>
                <span className="text-slate-400 text-[11px] font-normal">(124 reviews)</span>
              </div>
            </div>

            <h1 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight leading-snug">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Price & Deal Banner Box */}
          <div className="space-y-1.5 border-b border-[#E5E7EB] pb-3">
            {discountPercent && (
              <div className="inline-flex items-center gap-1.5 bg-[#E66001] text-white px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-2xs">
                <Tag className="w-3 h-3" /> Vistora Limited Deal
              </div>
            )}

            <div className="flex items-baseline gap-2.5 pt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>

              {compareNum && compareNum > priceNum && (
                <span className="text-xs font-semibold text-[#64748B] line-through">
                  {brandConfig.currency.symbol}{compareNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </span>
              )}

              {discountPercent && (
                <span className="text-xs font-black text-[#E66001]">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#64748B] font-normal">
              Inclusive of all taxes. Free express shipping on orders over ₹1500.
            </p>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              onVariantSelect={(v) => setSelectedVariant(v)}
            />
          )}

          {/* Quick Highlights */}
          <div className="space-y-1.5 text-xs text-[#111827] font-medium pt-1">
            <span className="font-extrabold block text-[11px] uppercase tracking-wider text-[#64748B]">Highlights:</span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 100% Authentic Quality</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Fast Express Shipping</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Easy 7-Day Returns</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Safe & Secure Checkout</div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Amazon-Style Right Buy Box Card (3 Cols) */}
        <div className="lg:col-span-3 lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs space-y-3.5">
            
            {/* Price Header */}
            <div className="border-b border-[#E5E7EB] pb-2.5 space-y-0.5">
              <span className="text-[10px] text-[#64748B] font-bold block uppercase tracking-wider">Total Price:</span>
              <div className="text-xl font-black text-[#111827]">
                {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </div>
              <span className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" /> FREE Delivery Eligible
              </span>
            </div>

            {/* Availability */}
            <div>
              {isOutOfStock ? (
                <span className="text-xs font-black uppercase tracking-wider text-rose-600 block">
                  Currently Out of Stock
                </span>
              ) : (
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 block">
                  In Stock & Ready to Ship
                </span>
              )}
            </div>

            {/* Quantity Counter */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-[#111827] uppercase tracking-wider block">Quantity:</label>
              <div className="flex items-center justify-between border border-[#E5E7EB] rounded-xl bg-[#F7F8FA] p-1 h-9 w-full">
                <button
                  disabled={isOutOfStock || isInCart}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white text-[#111827] font-black text-sm hover:bg-slate-200 transition shadow-2xs flex items-center justify-center disabled:opacity-50"
                >
                  -
                </button>
                <span className="text-xs font-black text-[#111827]">{quantity}</span>
                <button
                  disabled={isOutOfStock || isInCart}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white text-[#111827] font-black text-sm hover:bg-slate-200 transition shadow-2xs flex items-center justify-center disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart / Go to Cart Button */}
            <button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`w-full h-10 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-200 shadow-xs flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : isInCart
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'bg-[#111827] hover:bg-[#A50025] text-white hover:scale-[1.01]'
              }`}
            >
              {isInCart ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Already Added to Cart (Go to Bag)</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#E66001]" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                </>
              )}
            </button>

            {/* Buy Now Button */}
            <button
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className={`w-full h-10 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#E66001] hover:bg-[#B84D01] text-white hover:scale-[1.01]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isOutOfStock ? 'Sold Out' : 'Buy Now'}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() =>
                requireCustomerAuth(() => {
                  if (isInWishlist && wishlistItem) {
                    removeFromWishlist.mutate(wishlistItem.id);
                  } else {
                    addToWishlist.mutate({ productId: product.id, variantId: selectedVariant?.id || null });
                  }
                })
              }
              className={`w-full h-9 rounded-xl border transition-all text-xs font-bold flex items-center justify-center gap-2 ${
                isInWishlist
                  ? 'bg-[#FFF0F3] border-[#A50025]/40 text-[#A50025]'
                  : 'border-[#E5E7EB] text-[#111827] hover:text-[#A50025] hover:bg-[#FFF0F3] hover:border-[#A50025]/30'
              }`}
              title={isInWishlist ? 'In Wishlist (Click to remove)' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-[#A50025] text-[#A50025]' : ''}`} />
              <span>{isInWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>

            {/* Secure Lock Assurance */}
            <div className="pt-2 border-t border-[#E5E7EB] text-center text-[10px] text-[#64748B] flex items-center justify-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-[#A50025]" />
              <span>100% Encrypted & Secure Transaction</span>
            </div>

          </div>
        </div>

      </div>

      {/* Description & Specifications Tabs Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex border-b border-[#E5E7EB] gap-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-2.5 text-xs sm:text-sm font-black transition-all border-b-2 ${
              activeTab === 'description'
                ? 'border-[#A50025] text-[#A50025]'
                : 'border-transparent text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Product Overview & Story
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-2.5 text-xs sm:text-sm font-black transition-all border-b-2 ${
              activeTab === 'specifications'
                ? 'border-[#A50025] text-[#A50025]'
                : 'border-transparent text-[#64748B] hover:text-[#111827]'
            }`}
          >
            Specifications & Care
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="text-xs sm:text-sm leading-relaxed text-[#64748B] font-medium space-y-2.5">
            <p>{product.description || product.shortDescription || 'Crafted with meticulous attention to detail using premium, authentic materials designed for comfort, luxury, and timeless style.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
              <span className="font-bold text-[#64748B]">Category</span>
              <span className="font-black text-[#111827]">{product.category?.name || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
              <span className="font-bold text-[#64748B]">SKU Code</span>
              <span className="font-mono font-black text-[#111827]">{currentSku}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
              <span className="font-bold text-[#64748B]">Authenticity</span>
              <span className="font-black text-emerald-700">100% Guaranteed</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
              <span className="font-bold text-[#64748B]">Shipping</span>
              <span className="font-black text-[#A50025]">Express Doorstep Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
