'use client';

import React, { useState, useEffect } from 'react';
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

  // Extract distinct colors and sizes
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[];
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean))) as string[];

  const [selectedColor, setSelectedColor] = useState<string | null>(
    selectedVariant?.color || colors[0] || null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    selectedVariant?.size || sizes[0] || null,
  );

  useEffect(() => {
    if (selectedVariant) {
      if (selectedVariant.color) setSelectedColor(selectedVariant.color);
      if (selectedVariant.size) setSelectedSize(selectedVariant.size);
    }
  }, [selectedVariant]);

  useEffect(() => {
    if (variants && variants.length > 0 && !selectedVariant && onVariantSelect) {
      const initColor = colors[0] || null;
      const initSize = sizes[0] || null;
      const initialVariant =
        variants.find(
          (v) => (!initColor || v.color === initColor) && (!initSize || v.size === initSize),
        ) || variants[0];

      if (initialVariant) {
        onVariantSelect(initialVariant);
      }
    }
  }, [variants]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const matchingVariant =
      variants.find((v) => v.color === color && (!selectedSize || v.size === selectedSize)) ||
      variants.find((v) => v.color === color) ||
      variants[0];

    if (matchingVariant && onVariantSelect) {
      onVariantSelect(matchingVariant);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const matchingVariant =
      variants.find((v) => v.size === size && (!selectedColor || v.color === selectedColor)) ||
      variants.find((v) => v.size === size) ||
      variants[0];

    if (matchingVariant && onVariantSelect) {
      onVariantSelect(matchingVariant);
    }
  };

  // Common color name to HEX lookup map for automatic swatch rendering
  const COLOR_HEX_MAP: Record<string, string> = {
    orange: '#FF6600',
    red: '#E60023',
    'ruby red': '#B91C1C',
    ruby: '#991B1B',
    pink: '#EC4899',
    'rose pink': '#F43F5E',
    nude: '#E3A857',
    coral: '#FF6F61',
    magenta: '#D946EF',
    purple: '#A855F7',
    blue: '#3B82F6',
    navy: '#1E3A8A',
    black: '#111827',
    white: '#FFFFFF',
    green: '#10B981',
    yellow: '#EAB308',
    gold: '#D4AF37',
    silver: '#C0C0C0',
    brown: '#78350F',
    beige: '#E6D7C3',
    maroon: '#800000',
    peach: '#FFCBA4',
  };

  // Helper to find thumbnail image for a specific color
  const getThumbnailForColor = (
    color: string,
    matchingVariant?: ProductVariant,
    colorIndex: number = 0,
  ) => {
    if (matchingVariant?.imageUrl) return matchingVariant.imageUrl;

    // 1. Try finding matching image in productImages by color name in altText
    const colorLower = color.toLowerCase().trim();
    const matchedImg = productImages.find((img) =>
      img.altText ? img.altText.toLowerCase().includes(colorLower) : false,
    );
    if (matchedImg) return matchedImg.imageUrl;

    // 2. Map by gallery image index (e.g. 1st color -> 1st image, 2nd color -> 2nd image)
    if (productImages[colorIndex]) {
      return productImages[colorIndex].imageUrl;
    }

    // 3. Fall back to primary image or first available product image
    const primaryImg = productImages.find((i) => i.isPrimary) || productImages[0];
    return primaryImg?.imageUrl || null;
  };

  // Helper to get hex code for a color
  const getColorHex = (color: string, matchingVariant?: ProductVariant) => {
    if (matchingVariant?.colorHex) return matchingVariant.colorHex;
    const colorLower = color.toLowerCase().trim();
    return COLOR_HEX_MAP[colorLower] || '#111827';
  };

  return (
    <div className="space-y-4 py-3 border-y border-[#E5E7EB]">
      {/* Amazon-Style Color Swatches Section */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Colour: <span className="text-[#111827] font-black">{selectedColor}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {colors.map((color, colorIdx) => {
              const isSelected = selectedColor === color;
              const matchingVar = variants.find((v) => v.color === color);
              const price = matchingVar
                ? typeof matchingVar.price === 'string'
                  ? parseFloat(matchingVar.price)
                  : matchingVar.price
                : null;
              const compareAt = matchingVar?.compareAtPrice
                ? typeof matchingVar.compareAtPrice === 'string'
                  ? parseFloat(matchingVar.compareAtPrice)
                  : matchingVar.compareAtPrice
                : null;

              const thumbUrl = getThumbnailForColor(color, matchingVar, colorIdx);
              const hex = getColorHex(color, matchingVar);

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`relative group flex flex-col items-center justify-between p-1.5 rounded-xl border transition-all duration-200 min-w-[84px] sm:min-w-[94px] text-center ${
                    isSelected
                      ? 'border-[#A50025] ring-2 ring-[#A50025]/30 bg-[#FFF0F3]/40 shadow-xs'
                      : 'border-[#E5E7EB] bg-white hover:border-slate-400 hover:shadow-2xs'
                  }`}
                >
                  {/* Selected Check Badge */}
                  {isSelected && (
                    <span className="absolute top-1 right-1 z-10 w-4 h-4 rounded-full bg-[#A50025] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}

                  {/* Swatch Image Thumbnail Container */}
                  <div className="relative w-full h-14 rounded-lg bg-[#F7F8FA] overflow-hidden flex items-center justify-center mb-1">
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={`${color} variant swatch`}
                        fill
                        sizes="90px"
                        className="object-contain p-1 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span
                        className="w-7 h-7 rounded-full border border-black/15 shadow-sm inline-block shrink-0 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: hex }}
                      />
                    )}
                  </div>

                  {/* Variant Price & Strikethrough Display */}
                  <div className="w-full space-y-0.5 px-0.5">
                    {price !== null && (
                      <span
                        className={`block text-[11px] font-black leading-tight ${
                          isSelected ? 'text-[#A50025]' : 'text-[#111827]'
                        }`}
                      >
                        {currencySymbol}
                        {price.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                      </span>
                    )}

                    {compareAt && compareAt > (price || 0) && (
                      <span className="block text-[9px] font-medium text-[#64748B] line-through leading-none">
                        {currencySymbol}
                        {compareAt.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                      </span>
                    )}

                    <span className="block text-[10px] font-semibold text-[#475569] truncate mt-0.5">
                      {color}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Size: <span className="text-[#111827] font-black">{selectedSize}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              const matchingVar = variants.find(
                (v) => v.size === size && (!selectedColor || v.color === selectedColor),
              );
              const isOutOfStock = matchingVar ? matchingVar.stock <= 0 : false;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-200 border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#A50025] text-white border-[#A50025] shadow-xs'
                      : isOutOfStock
                        ? 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-70 cursor-not-allowed'
                        : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <span>{size}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
