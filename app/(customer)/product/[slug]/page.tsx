'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/use-catalogue';
import { ProductGallery } from '@/components/catalogue/product-gallery';
import { VariantSelector } from '@/components/catalogue/variant-selector';
import { PriceCard } from '@/components/catalogue/price-card';
import { ProductDetailSkeleton } from '@/components/catalogue/skeleton-loaders';
import { ProductVariant } from '@/types/catalogue.types';
import { useCartMutations, useWishlistMutations } from '@/hooks/use-shopping';
import {
  ShoppingBag,
  Heart,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16 pt-3">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs font-bold text-[#64748B]">
        <Link href="/" className="hover:text-[#A50025] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/shop" className="hover:text-[#A50025] transition-colors">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#A50025] transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-[#111827] truncate max-w-[200px] sm:max-w-md">{product.name}</span>
      </nav>

      {/* Main Two-Column Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:sticky lg:top-24">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Details & Controls */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#A50025] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#A50025]/20">
                {product.category?.name || 'Vistora Selection'}
              </span>
              {isOutOfStock ? (
                <span className="text-[11px] font-black uppercase tracking-widest text-white bg-rose-600 px-3 py-1 rounded-full shadow-xs">
                  Out of Stock
                </span>
              ) : (
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  In Stock & Ready to Ship
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight leading-tight">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Price Card */}
          <PriceCard price={currentPrice} compareAtPrice={currentComparePrice} sku={currentSku} />

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              onVariantSelect={(v) => setSelectedVariant(v)}
            />
          )}

          {/* Quantity & Actions Bar */}
          <div className="space-y-4 pt-1">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border border-[#E5E7EB] rounded-xl bg-[#F7F8FA] p-1 shrink-0 h-12 w-32">
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white text-[#111827] font-black text-sm hover:bg-slate-200 transition shadow-xs flex items-center justify-center disabled:opacity-50"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-black text-[#111827]">{quantity}</span>
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white text-[#111827] font-black text-sm hover:bg-slate-200 transition shadow-xs flex items-center justify-center disabled:opacity-50"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 h-12 px-5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-200 shadow-xs flex items-center justify-center gap-2 ${isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#111827] hover:bg-[#A50025] text-white hover:scale-[1.01]'
                  }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#E66001]" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>

              {/* Buy Now */}
              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`flex-1 h-12 px-5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#A50025] hover:bg-[#7D001C] text-white hover:scale-[1.01]'
                  }`}
              >
                <Sparkles className="w-4 h-4 text-[#E66001]" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Buy Now'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => requireCustomerAuth(() => addToWishlist.mutate({ productId: product.id, variantId: selectedVariant?.id || null }))}
                className="h-12 w-12 rounded-xl border border-[#E5E7EB] text-[#111827] hover:text-[#A50025] hover:bg-[#FFF0F3] hover:border-[#A50025]/30 transition-all shadow-xs flex items-center justify-center shrink-0"
                title="Save to Wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trust Mini Feature Cards */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E5E7EB] text-center">
            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1">
              <Truck className="w-4 h-4 text-[#A50025] mx-auto" />
              <span className="text-[11px] font-extrabold text-[#111827] block">Express Shipping</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#A50025] mx-auto" />
              <span className="text-[11px] font-extrabold text-[#111827] block">Authentic Guarantee</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1">
              <RotateCcw className="w-4 h-4 text-[#A50025] mx-auto" />
              <span className="text-[11px] font-extrabold text-[#111827] block">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specifications Tabs Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="flex border-b border-[#E5E7EB] gap-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-xs sm:text-sm font-black transition-all border-b-2 ${activeTab === 'description'
                ? 'border-[#A50025] text-[#A50025]'
                : 'border-transparent text-[#64748B] hover:text-[#111827]'
              }`}
          >
            Product Overview & Story
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-3 text-xs sm:text-sm font-black transition-all border-b-2 ${activeTab === 'specifications'
                ? 'border-[#A50025] text-[#A50025]'
                : 'border-transparent text-[#64748B] hover:text-[#111827]'
              }`}
          >
            Specifications & Care
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="text-xs sm:text-sm leading-relaxed text-[#64748B] font-medium space-y-3">
            <p>{product.description || product.shortDescription || 'Crafted with meticulous attention to detail using premium, authentic materials designed for comfort, luxury, and timeless style.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
            <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
              <span className="font-bold text-[#64748B]">Category</span>
              <span className="font-black text-[#111827]">{product.category?.name || 'N/A'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
              <span className="font-bold text-[#64748B]">SKU Code</span>
              <span className="font-mono font-black text-[#111827]">{product.sku}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
              <span className="font-bold text-[#64748B]">Authenticity</span>
              <span className="font-black text-emerald-700">100% Guaranteed</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
              <span className="font-bold text-[#64748B]">Shipping</span>
              <span className="font-black text-[#A50025]">Express Doorstep Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
