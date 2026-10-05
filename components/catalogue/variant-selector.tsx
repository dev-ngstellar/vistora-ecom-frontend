'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { ProductVariant, ProductImage } from '@/types/catalogue.types';
import { Check } from 'lucide-react';
import { brandConfig } from '@/config';

interface VariantSelectorProps {
  variants?: ProductVariant[];
  productImages?: ProductImage[];
  selectedVariant?: ProductVariant | null;
  onVariantSelect?: (variant: ProductVariant) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants = [],
  productImages = [],
  selectedVariant,
  onVariantSelect,
}) => {
  if (!variants || variants.length === 0) return null;

  const currencySymbol = brandConfig.currency.symbol;

  // Extract distinct colors and sizes if applicable
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[];
  const hasMultipleColors = colors.length > 1;

  // Set default initial variant if none selected
  useEffect(() => {
    if (variants.length > 0 && !selectedVariant && onVariantSelect) {
      onVariantSelect(variants[0]);
    }
  }, [variants, selectedVariant, onVariantSelect]);

  // Helper to determine thumbnail for each variant
  const getThumbnailForVariant = (variant: ProductVariant) => {
    // 1. Explicit variant image
    if (variant.imageUrl) return variant.imageUrl;
    if (variant.imageUrls && variant.imageUrls.length > 0) return variant.imageUrls[0];

    // 2. Alt text matching for variant color or size
    if (productImages.length > 0) {
      if (variant.size) {
        const sizeLower = variant.size.toLowerCase().trim();
        const matchedBySize = productImages.find((img) =>
          img.altText ? img.altText.toLowerCase().includes(sizeLower) : false,
        );
        if (matchedBySize) return matchedBySize.imageUrl;
      }
      if (variant.color) {
        const colorLower = variant.color.toLowerCase().trim();
        const matchedByColor = productImages.find((img) =>
          img.altText ? img.altText.toLowerCase().includes(colorLower) : false,
        );
        if (matchedByColor) return matchedByColor.imageUrl;
      }

      // 3. Primary or first gallery image (1st front image)
      const primaryImg = productImages.find((i) => i.isPrimary) || productImages[0];
      return primaryImg?.imageUrl || null;
    }

    return null;
  };

  const handleVariantClick = (variant: ProductVariant) => {
    if (onVariantSelect) {
      onVariantSelect(variant);
    }
  };

  const handleColorFilter = (color: string) => {
    const currentSize = selectedVariant?.size;
    const match =
      variants.find((v) => v.color === color && v.size === currentSize) ||
      variants.find((v) => v.color === color) ||
      variants[0];
    if (match && onVariantSelect) {
      onVariantSelect(match);
    }
  };

  // If there are multiple colors, filter the visible variant cards for the selected color
  const activeColor = selectedVariant?.color || colors[0] || null;
  const visibleVariants = hasMultipleColors
    ? variants.filter((v) => !activeColor || v.color === activeColor)
    : variants;

  return (
    <div className="space-y-3.5 py-3 border-y border-[#E5E7EB]">
      {/* Optional Color Filter (Only shown if product actually has multiple distinct colors) */}
      {hasMultipleColors && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Colour / Shade: <span className="text-[#111827] font-black">{activeColor}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isColorSelected = activeColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorFilter(color)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${isColorSelected
                      ? 'border-[#A50025] bg-[#FFF0F3] text-[#A50025] shadow-xs'
                      : 'border-[#E5E7EB] bg-white text-[#475569] hover:border-slate-400'
                    }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Variant Cards (e.g. 500g, 1kg with Images & Accurate Prices) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Pack Size / Weight:{' '}
            <span className="text-[#111827] font-black">
              {selectedVariant?.size || selectedVariant?.sku || 'Standard Pack'}
            </span>
          </span>
          {selectedVariant?.color && !hasMultipleColors && (
            <span className="text-[11px] font-medium text-[#64748B]">
              Shade: <span className="text-[#111827] font-semibold">{selectedVariant.color}</span>
            </span>
          )}
        </div>

        {/* Responsive flex layout for compact, adjustable pack cards */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {visibleVariants.map((variant, idx) => {
            const isSelected = selectedVariant?.id
              ? selectedVariant.id === variant.id
              : selectedVariant?.sku === variant.sku || idx === 0;

            const price =
              typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price;
            const compareAt = variant.compareAtPrice
              ? typeof variant.compareAtPrice === 'string'
                ? parseFloat(variant.compareAtPrice)
                : variant.compareAtPrice
              : null;

            const discount =
              compareAt && compareAt > price
                ? Math.round(((compareAt - price) / compareAt) * 100)
                : 0;

            const thumbUrl = getThumbnailForVariant(variant);
            const isOutOfStock = variant.stock <= 0;

            return (
              <button
                key={variant.id || variant.sku || idx}
                type="button"
                onClick={() => handleVariantClick(variant)}
                disabled={isOutOfStock}
                className={`relative group flex flex-col items-center w-[calc(50%-5px)] sm:w-[130px] sm:max-w-[140px] shrink-0 p-2.5 rounded-2xl border-2 transition-all duration-200 text-center ${isSelected
                    ? 'border-[#A50025] bg-[#FFF0F3]/60 shadow-sm ring-2 ring-[#A50025]/20'
                    : isOutOfStock
                      ? 'border-[#E5E7EB] bg-slate-50 opacity-60 cursor-not-allowed'
                      : 'border-[#E5E7EB] bg-white hover:border-slate-400 hover:shadow-xs'
                  }`}
              >
                {/* Variant Image Thumbnail */}
                <div className="relative w-full h-20 sm:h-24 rounded-xl bg-[#F8F9FA] overflow-hidden flex items-center justify-center mb-2">
                  {thumbUrl ? (
                    <Image
                      src={thumbUrl}
                      alt={variant.size || variant.sku || 'Product Variant'}
                      fill
                      sizes="140px"
                      className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#94A3B8] font-bold">
                      {variant.size || 'Pack'}
                    </div>
                  )}

                  {/* Discount Tag (cleanly pinned inside image container) */}
                  {discount > 0 && (
                    <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-[#E66001] text-white shadow-xs tracking-tight">
                      {discount}% OFF
                    </span>
                  )}

                  {/* Active Checkmark Badge (cleanly pinned inside image container) */}
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 z-10 w-4 h-4 rounded-full bg-[#A50025] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Variant Size Label */}
                <span className="block text-xs font-black text-[#111827] tracking-tight mb-1 truncate w-full">
                  {variant.size || variant.sku || 'Standard'}
                </span>

                {/* Price Display */}
                <div className="w-full flex items-baseline justify-center gap-1.5 mb-1">
                  <span
                    className={`text-sm font-black ${isSelected ? 'text-[#A50025]' : 'text-[#111827]'
                      }`}
                  >
                    {currencySymbol}
                    {price.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                  </span>

                  {compareAt && compareAt > price && (
                    <span className="text-[11px] font-medium text-[#64748B] line-through">
                      {currencySymbol}
                      {compareAt.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                {isOutOfStock ? (
                  <span className="text-[10px] font-bold text-red-600 uppercase">
                    Out of Stock
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-emerald-700">
                    In Stock
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
