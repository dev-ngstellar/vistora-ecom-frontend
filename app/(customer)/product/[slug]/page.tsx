'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useProduct, useProducts } from '@/hooks/use-catalogue';
import { ProductGallery } from '@/components/catalogue/product-gallery';
import { VariantSelector } from '@/components/catalogue/variant-selector';
import { ProductCard } from '@/components/catalogue/product-card';
import { ProductDetailSkeleton } from '@/components/catalogue/skeleton-loaders';
import { ProductVariant } from '@/types/catalogue.types';
import { useCart, useCartMutations, useWishlist, useWishlistMutations } from '@/hooks/use-shopping';
import {
  ShoppingBag,
  Heart,
  ChevronDown,
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
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  // Fetch recommendations from same category
  const { data: recsData } = useProducts({
    categoryId: product?.categoryId,
    limit: 5,
  });
  const recommendations = (recsData?.items || []).filter((p) => p.id !== product?.id).slice(0, 4);

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

  const availableStock = selectedVariant ? selectedVariant.stock : 0;

  const handleAddToCart = () => {
    if (isOutOfStock || quantity > availableStock) return;
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
    if (isOutOfStock || quantity > availableStock) return;
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

  const handleWishlistToggle = () => {
    requireCustomerAuth(() => {
      if (isInWishlist && wishlistItem) {
        removeFromWishlist.mutate(wishlistItem.id);
      } else {
        addToWishlist.mutate({ productId: product.id, variantId: selectedVariant?.id || null });
      }
    });
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pb-28 lg:pb-14 pt-0">

      {/* MAIN COMPACT PRODUCT PURCHASE AREA (3-COLUMN MARKETPLACE GRID: 32% | 40% | 28%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* COLUMN 1: PRODUCT IMAGE GALLERY (32% -> 4 Cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* COLUMN 2: PRODUCT INFORMATION (40% -> 5 Cols) */}
        <div className="lg:col-span-5 space-y-3">

          {/* Brand + Rating Header */}
          <div className="space-y-1 border-b border-[#E5E7EB] pb-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#A50025]">
                {product.brand?.name || product.category?.name || 'VISTORA SELECTION'}
              </span>
              <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-amber-800 font-extrabold text-[11px]">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.8</span>
                <span className="text-slate-400 font-normal">(124 reviews)</span>
              </div>
            </div>

            <h1 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight leading-snug">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-xs text-[#64748B] font-medium leading-relaxed line-clamp-2">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Offer & Pricing Block */}
          <div className="space-y-1 border-b border-[#E5E7EB] pb-2.5">
            {discountPercent && (
              <div className="inline-flex items-center gap-1 bg-[#FFF6F0] border border-[#E66001]/30 text-[#E66001] px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                <Tag className="w-3 h-3 text-[#E66001]" /> 🔥 VISTORA DEAL · {discountPercent}% OFF
              </div>
            )}

            <div className="flex items-baseline gap-2.5 pt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>

              {compareNum && compareNum > priceNum && (
                <span className="text-xs font-semibold text-[#64748B] line-through">
                  MRP {brandConfig.currency.symbol}{compareNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </span>
              )}

              {discountPercent && (
                <span className="text-xs font-black text-[#E66001]">
                  ({discountPercent}% OFF)
                </span>
              )}
            </div>

            <p className="text-[10px] text-[#64748B] font-medium">
              Inclusive of all taxes. Free delivery eligible on orders over ₹1500.
            </p>
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              onVariantSelect={(v) => setSelectedVariant(v)}
            />
          )}

          {/* Compact Product Highlights Grid */}
          <div className="space-y-1.5 pt-1">
            <span className="font-extrabold block text-[10px] uppercase tracking-wider text-[#64748B]">
              Highlights
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-[#111827]">
              <div className="flex items-center gap-1.5 bg-[#F7F8FA] p-1.5 rounded-lg border border-[#E5E7EB]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">100% Authentic Quality</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F7F8FA] p-1.5 rounded-lg border border-[#E5E7EB]">
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Fast Express Shipping</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F7F8FA] p-1.5 rounded-lg border border-[#E5E7EB]">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Easy 7-Day Returns</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F7F8FA] p-1.5 rounded-lg border border-[#E5E7EB]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Safe & Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: STICKY PURCHASE PANEL (28% -> 3 Cols) */}
        <div className="lg:col-span-3 lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs space-y-3">

            {/* Price Header */}
            <div className="border-b border-[#E5E7EB] pb-2 space-y-0.5">
              <span className="text-[10px] text-[#64748B] font-bold block uppercase tracking-wider">TOTAL PRICE:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111827]">
                  {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </span>
                {compareNum && compareNum > priceNum && (
                  <span className="text-xs text-[#64748B] line-through font-semibold">
                    MRP {brandConfig.currency.symbol}{compareNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                  </span>
                )}
              </div>
            </div>

            {/* Availability & Free Shipping Indicator */}
            <div className="space-y-1 text-xs">
              {isOutOfStock ? (
                <span className="font-extrabold uppercase tracking-wider text-rose-600 block text-[11px]">
                  ✕ Currently Out of Stock
                </span>
              ) : (
                <span className="font-extrabold uppercase tracking-wider text-emerald-700 block text-[11px]">
                  ✓ In Stock & Ready to Ship
                </span>
              )}
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Free Delivery Eligible
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Quantity</label>
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
                  disabled={isOutOfStock || isInCart || quantity >= availableStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white text-[#111827] font-black text-sm hover:bg-slate-200 transition shadow-2xs flex items-center justify-center disabled:opacity-50"
                >
                  +
                </button>
              </div>
              {quantity > availableStock && (
                <p className="text-[10px] text-rose-600 font-extrabold mt-1">
                  ⚠️ Insufficient stock (Only {availableStock} units left)
                </p>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* Add to Cart / Go to Cart */}
              <button
                disabled={isOutOfStock || (!isInCart && quantity > availableStock)}
                onClick={handleAddToCart}
                className={`w-full h-10 rounded-xl font-black text-xs tracking-wider uppercase transition-all duration-200 shadow-xs flex items-center justify-center gap-2 ${isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : isInCart
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : quantity > availableStock
                        ? 'bg-rose-50 text-rose-500 border border-rose-200 cursor-not-allowed'
                        : 'bg-[#A50025] hover:bg-[#7D001C] text-white active:scale-[0.99]'
                  }`}
              >
                {isInCart ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>ALREADY ADDED TO CART (GO TO BAG)</span>
                  </>
                ) : quantity > availableStock ? (
                  <>
                    <ShoppingBag className="w-4 h-4 text-rose-500" />
                    <span>Insufficient Stock</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>{isOutOfStock ? 'Sold Out' : 'ADD TO CART'}</span>
                  </>
                )}
              </button>

              {/* Buy Now Button */}
              <button
                disabled={isOutOfStock || quantity > availableStock}
                onClick={handleBuyNow}
                className={`w-full h-10 rounded-xl font-black text-xs tracking-wider uppercase transition-all duration-200 shadow-xs flex items-center justify-center gap-2 ${isOutOfStock || quantity > availableStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#E66001] hover:bg-[#B84D01] text-white active:scale-[0.99]'
                  }`}
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{isOutOfStock ? 'Sold Out' : quantity > availableStock ? 'Insufficient Stock' : 'BUY NOW'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`w-full h-9 rounded-xl border transition-all text-xs font-bold flex items-center justify-center gap-2 ${isInWishlist
                    ? 'bg-[#FFF0F3] border-[#A50025]/40 text-[#A50025]'
                    : 'border-[#E5E7EB] text-[#111827] hover:text-[#A50025] hover:bg-[#FFF0F3] hover:border-[#A50025]/30'
                  }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-[#A50025] text-[#A50025]' : ''}`} />
                <span>{isInWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Encrypted Lock Assurance */}
            <div className="pt-2 border-t border-[#E5E7EB] text-center text-[10px] text-[#64748B] flex items-center justify-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-[#A50025]" />
              <span>100% Encrypted & Secure Transaction</span>
            </div>

          </div>
        </div>

      </div>

      {/* COMPACT PRODUCT DETAILS ACCORDION SECTION */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden divide-y divide-[#E5E7EB]">

        {/* Accordion 1: Product Details */}
        <div>
          <button
            onClick={() => toggleAccordion('details')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAFBFD] transition"
          >
            <span className="text-xs sm:text-sm font-black text-[#111827] uppercase tracking-wider">Product Details</span>
            <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${openAccordion === 'details' ? 'rotate-180 text-[#A50025]' : ''}`} />
          </button>
          {openAccordion === 'details' && (
            <div className="px-5 pb-4 text-xs text-[#64748B] font-medium leading-relaxed space-y-2 border-t border-[#F3F4F6] pt-3">
              <p>{product.description || product.shortDescription || 'Crafted with premium materials and traditional artisan formulations designed for daily beauty, comfort, and safety.'}</p>
            </div>
          )}
        </div>

        {/* Accordion 2: Specifications */}
        <div>
          <button
            onClick={() => toggleAccordion('specs')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAFBFD] transition"
          >
            <span className="text-xs sm:text-sm font-black text-[#111827] uppercase tracking-wider">Specifications</span>
            <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${openAccordion === 'specs' ? 'rotate-180 text-[#A50025]' : ''}`} />
          </button>
          {openAccordion === 'specs' && (
            <div className="px-5 pb-4 border-t border-[#F3F4F6] pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
                  <span className="font-bold text-[#64748B]">Category</span>
                  <span className="font-black text-[#111827]">{product.category?.name || 'Vistora Selection'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
                  <span className="font-bold text-[#64748B]">SKU Code</span>
                  <span className="font-mono font-black text-[#111827]">{currentSku}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
                  <span className="font-bold text-[#64748B]">Authenticity</span>
                  <span className="font-black text-emerald-700">100% Guaranteed</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex justify-between items-center">
                  <span className="font-bold text-[#64748B]">Shipping</span>
                  <span className="font-black text-[#A50025]">Express Doorstep Shipping</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Care & Usage Instructions */}
        <div>
          <button
            onClick={() => toggleAccordion('care')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAFBFD] transition"
          >
            <span className="text-xs sm:text-sm font-black text-[#111827] uppercase tracking-wider">Care & Usage Instructions</span>
            <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${openAccordion === 'care' ? 'rotate-180 text-[#A50025]' : ''}`} />
          </button>
          {openAccordion === 'care' && (
            <div className="px-5 pb-4 text-xs text-[#64748B] font-medium leading-relaxed border-t border-[#F3F4F6] pt-3">
              <ul className="list-disc pl-4 space-y-1">
                <li>Store in a cool, dry place away from direct heat or sunlight.</li>
                <li>Keep container cap tightly closed after each use.</li>
                <li>Patch test recommended for sensitive skin.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Accordion 4: Shipping & Returns */}
        <div>
          <button
            onClick={() => toggleAccordion('shipping')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAFBFD] transition"
          >
            <span className="text-xs sm:text-sm font-black text-[#111827] uppercase tracking-wider">Shipping & Easy Returns</span>
            <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${openAccordion === 'shipping' ? 'rotate-180 text-[#A50025]' : ''}`} />
          </button>
          {openAccordion === 'shipping' && (
            <div className="px-5 pb-4 text-xs text-[#64748B] font-medium leading-relaxed border-t border-[#F3F4F6] pt-3">
              <p>Hassle-free 7-day return policy. Items must be unused and in original packaging.</p>
            </div>
          )}
        </div>

      </div>

      {/* YOU MAY ALSO LIKE RECOMMENDATIONS SECTION */}
      {recommendations.length > 0 && (
        <section className="space-y-3 pt-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
            <h2 className="text-base sm:text-lg font-black text-[#111827] tracking-tight uppercase">
              You May Also Like
            </h2>
            <Link
              href="/shop"
              className="text-xs font-extrabold text-[#A50025] hover:text-[#E66001] flex items-center gap-1 transition"
            >
              <span>View All →</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {recommendations.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}

      {/* STICKY MOBILE BOTTOM PURCHASE BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-2.5 shadow-lg flex items-center gap-2">
        <button
          onClick={handleWishlistToggle}
          className={`p-2.5 rounded-xl border transition-all ${isInWishlist ? 'bg-[#FFF0F3] border-[#A50025] text-[#A50025]' : 'border-slate-200 text-[#111827]'
            }`}
          title="Wishlist"
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-[#A50025]' : ''}`} />
        </button>

        <button
          disabled={isOutOfStock || (!isInCart && quantity > availableStock)}
          onClick={handleAddToCart}
          className={`flex-1 h-10 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${isOutOfStock
              ? 'bg-slate-200 text-slate-400'
              : isInCart
                ? 'bg-emerald-600 text-white'
                : quantity > availableStock
                  ? 'bg-rose-50 text-rose-500 border border-rose-200'
                  : 'bg-[#A50025] text-white'
            }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isInCart ? 'Go to Bag' : quantity > availableStock ? 'Insufficient Stock' : 'Add to Cart'}</span>
        </button>

        <button
          disabled={isOutOfStock || quantity > availableStock}
          onClick={handleBuyNow}
          className={`flex-1 h-10 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${isOutOfStock || quantity > availableStock
              ? 'bg-slate-200 text-slate-400'
              : 'bg-[#E66001] text-white'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{quantity > availableStock ? 'Insufficient Stock' : 'Buy Now'}</span>
        </button>
      </div>

    </div>
  );
}

