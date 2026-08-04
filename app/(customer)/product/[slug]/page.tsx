'use client';

import React, { useState } from 'react';
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

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params['slug'] as string;

  const { data: product, isLoading, isError } = useProduct(slug);
  const { addToCart } = useCartMutations();
  const { addToWishlist } = useWishlistMutations();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs"
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

  const handleAddToCart = () => {
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      quantity,
    });
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Dynamic Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 py-2">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-indigo-600">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/shop?categoryId=${product.category.id}`} className="hover:text-indigo-600">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Image Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Details & Purchase */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {product.category?.name || 'Haute Couture'}
              </span>
              {product.brand && (
                <span className="text-xs font-semibold text-slate-400">by {product.brand.name}</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
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

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-white text-slate-800 font-bold text-sm hover:bg-slate-200 transition shadow-xs flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-white text-slate-800 font-bold text-sm hover:bg-slate-200 transition shadow-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-sm transition shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>

              <button
                onClick={() => addToWishlist.mutate({ productId: product.id, variantId: selectedVariant?.id || null })}
                className="p-4 rounded-2xl border border-slate-200 text-slate-700 hover:text-red-500 hover:bg-slate-50 transition shadow-xs"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 space-y-1">
              <Truck className="w-5 h-5 text-indigo-600 mx-auto" />
              <span className="text-[11px] font-bold text-slate-800 block">Express Shipping</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 space-y-1">
              <ShieldCheck className="w-5 h-5 text-indigo-600 mx-auto" />
              <span className="text-[11px] font-bold text-slate-800 block">Authentic Guarantee</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 space-y-1">
              <RefreshCw className="w-5 h-5 text-indigo-600 mx-auto" />
              <span className="text-[11px] font-bold text-slate-800 block">30-Day Free Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description & Specs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-bold transition border-b-2 ${
              activeTab === 'description'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-3 text-sm font-bold transition border-b-2 ${
              activeTab === 'specifications'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Specifications & Attributes
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
            <p>{product.description || product.shortDescription || 'No description available for this luxury product.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between">
              <span className="font-semibold text-slate-500">Category</span>
              <span className="font-bold text-slate-900">{product.category?.name || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between">
              <span className="font-semibold text-slate-500">Brand</span>
              <span className="font-bold text-slate-900">{product.brand?.name || 'Vistora Private Label'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between">
              <span className="font-semibold text-slate-500">SKU Number</span>
              <span className="font-mono font-bold text-slate-900">{product.sku}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between">
              <span className="font-semibold text-slate-500">Availability</span>
              <span className="font-bold text-emerald-600">In Stock</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
