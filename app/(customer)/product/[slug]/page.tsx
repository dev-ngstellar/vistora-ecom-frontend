'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/use-catalogue';
import { ProductGallery } from '@/components/catalogue/product-gallery';
import { VariantSelector } from '@/components/catalogue/variant-selector';
import { PriceCard } from '@/components/catalogue/price-card';
import { ProductDetailSkeleton } from '@/components/catalogue/skeleton-loaders';
import { ProductVariant } from '@/types/catalogue.types';
import { useCartMutations, useWishlistMutations } from '@/hooks/use-shopping';
import toast from 'react-hot-toast';
import {
  ShoppingBag,
  Heart,
  Share2,
  ChevronRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { brandConfig } from '@/config';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params['slug'] as string;
  const router = useRouter();
  const { requireCustomerAuth } = useAuth();

  const { data: product, isLoading, isError } = useProduct(slug);
  const { addToCart } = useCartMutations();
  const { addToWishlist } = useWishlistMutations();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

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
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
        <p className="text-sm text-slate-500">The product you are looking for may have been archived or removed.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-maroon text-white font-bold text-xs"
        >
          Return to Shop Catalog
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentComparePrice = selectedVariant
    ? selectedVariant.compareAtPrice
    : product.compareAtPrice;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;

  const primaryImg = product.images?.find((i) => i.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || '';

  const isOutOfStock =
    product.status === 'OUT_OF_STOCK' ||
    product.status === 'INACTIVE' ||
    (selectedVariant ? selectedVariant.stock <= 0 : false);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      quantity,
      productName: product.name,
      productSlug: product.slug,
      price: currentPrice,
      imageUrl: primaryImg,
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart.mutate(
      {
        productId: product.id,
        variantId: selectedVariant?.id || null,
        quantity,
        productName: product.name,
        productSlug: product.slug,
        price: currentPrice,
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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20 pt-4">
      {/* Main Two-Column Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Sticky Image Gallery */}
        <div className="lg:sticky lg:top-28">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Details & Purchase Controls */}
        <div className="space-y-7">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#B5123B] bg-[#FDF2F5] px-3.5 py-1 rounded-full border border-[#B5123B]/20">
                {product.category?.name || 'Luxury Apparel'}
              </span>
              {isOutOfStock ? (
                <span className="text-xs font-black uppercase tracking-widest text-white bg-rose-600 px-3.5 py-1 rounded-full shadow-xs">
                  Out of Stock
                </span>
              ) : (
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                  In Stock & Ready to Ship
                </span>
              )}
              {product.brand && (
                <span className="text-xs font-bold text-[#6B7280]">by {product.brand.name}</span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight leading-tight">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-sm text-[#6B7280] mt-3 leading-relaxed font-medium">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Price Component */}
          <PriceCard price={currentPrice} compareAtPrice={currentComparePrice} sku={currentSku} />

          {/* Variant Selector (Colors / Sizes) */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              onVariantSelect={(v) => setSelectedVariant(v)}
            />
          )}

          {/* Quantity & Action Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              {/* Quantity Counter */}
              <div className="flex items-center justify-between border border-[#ECECEC] rounded-[14px] bg-[#FAFAFA] p-1 shrink-0 h-14 w-36">
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-[10px] bg-white text-[#111111] font-black text-sm hover:bg-slate-200 transition shadow-xs flex items-center justify-center disabled:opacity-50"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-black text-[#111111]">{quantity}</span>
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-[10px] bg-white text-[#111111] font-black text-sm hover:bg-slate-200 transition shadow-xs flex items-center justify-center disabled:opacity-50"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 h-14 px-6 rounded-[14px] font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2.5 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-[#111827] hover:bg-[#B5123B] text-white hover:scale-[1.02]'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              {/* Buy Now */}
              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`flex-1 h-14 px-6 rounded-[14px] font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2.5 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-[#B5123B] hover:bg-[#8E0E2E] text-white hover:scale-[1.02]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Buy Now'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => requireCustomerAuth(() => addToWishlist.mutate({ productId: product.id, variantId: selectedVariant?.id || null }))}
                className="h-14 w-14 rounded-[14px] border border-[#ECECEC] text-[#111111] hover:text-[#B5123B] hover:bg-[#FDF2F5] hover:border-[#B5123B]/20 transition-all shadow-xs flex items-center justify-center shrink-0"
                title="Save to Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trust Feature Mini Cards */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#ECECEC] text-center">
            <div className="p-3.5 rounded-[16px] bg-[#FAFAFA] border border-[#ECECEC] space-y-1.5 hover-lift-shadow">
              <Truck className="w-5 h-5 text-[#B5123B] mx-auto" />
              <span className="text-[11px] font-extrabold text-[#111111] block">Express Shipping</span>
            </div>
            <div className="p-3.5 rounded-[16px] bg-[#FAFAFA] border border-[#ECECEC] space-y-1.5 hover-lift-shadow">
              <ShieldCheck className="w-5 h-5 text-[#B5123B] mx-auto" />
              <span className="text-[11px] font-extrabold text-[#111111] block">Authentic Guarantee</span>
            </div>
            <div className="p-3.5 rounded-[16px] bg-[#FAFAFA] border border-[#ECECEC] space-y-1.5 hover-lift-shadow">
              <RefreshCw className="w-5 h-5 text-[#B5123B] mx-auto" />
              <span className="text-[11px] font-extrabold text-[#111111] block">30-Day Free Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Accordions Section */}
      <div className="bg-white rounded-[20px] p-6 sm:p-10 border border-[#ECECEC] shadow-xs space-y-6">
        <div className="flex border-b border-[#ECECEC] gap-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-sm font-extrabold transition-all border-b-2 ${
              activeTab === 'description'
                ? 'border-[#B5123B] text-[#B5123B]'
                : 'border-transparent text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Product Overview & Story
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-4 text-sm font-extrabold transition-all border-b-2 ${
              activeTab === 'specifications'
                ? 'border-[#B5123B] text-[#B5123B]'
                : 'border-transparent text-[#6B7280] hover:text-[#111111]'
            }`}
          >
            Specifications & Material Care
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-[#6B7280] font-medium space-y-4">
            <p>{product.description || product.shortDescription || 'Crafted with meticulous attention to detail using ultra-soft, ethically sourced fabrics designed for timeless elegance.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div className="p-4 rounded-[14px] bg-[#FAFAFA] border border-[#ECECEC] flex justify-between items-center">
              <span className="font-bold text-[#6B7280]">Category</span>
              <span className="font-black text-[#111111]">{product.category?.name || 'N/A'}</span>
            </div>
            <div className="p-4 rounded-[14px] bg-[#FAFAFA] border border-[#ECECEC] flex justify-between items-center">
              <span className="font-bold text-[#6B7280]">Brand Label</span>
              <span className="font-black text-[#111111]">{product.brand?.name || `${brandConfig.name} Couture`}</span>
            </div>
            <div className="p-4 rounded-[14px] bg-[#FAFAFA] border border-[#ECECEC] flex justify-between items-center">
              <span className="font-bold text-[#6B7280]">SKU Code</span>
              <span className="font-mono font-black text-[#111111]">{product.sku}</span>
            </div>
            <div className="p-4 rounded-[14px] bg-[#FAFAFA] border border-[#ECECEC] flex justify-between items-center">
              <span className="font-bold text-[#6B7280]">Worldwide Shipping</span>
              <span className="font-black text-emerald-600">Complimentary Express</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
