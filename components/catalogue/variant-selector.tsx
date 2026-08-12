'use client';

import React, { useState, useEffect } from 'react';
import { ProductVariant } from '@/types/catalogue.types';
import { Check } from 'lucide-react';

interface VariantSelectorProps {
  variants?: ProductVariant[];
  onVariantSelect?: (variant: ProductVariant) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants = [],
  onVariantSelect,
}) => {
  if (!variants || variants.length === 0) return null;

  // Extract distinct colors and sizes
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[];
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean))) as string[];

  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] || null);

  useEffect(() => {
    if (variants && variants.length > 0 && onVariantSelect) {
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
    const matchingVariant = variants.find(
      (v) => v.color === color && (!selectedSize || v.size === selectedSize),
    );
    if (matchingVariant && onVariantSelect) {
      onVariantSelect(matchingVariant);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const matchingVariant = variants.find(
      (v) => v.size === size && (!selectedColor || v.color === selectedColor),
    );
    if (matchingVariant && onVariantSelect) {
      onVariantSelect(matchingVariant);
    }
  };

  return (
    <div className="space-y-3 py-2.5 border-b border-[#E5E7EB]">
      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Color:{' '}
              <span className="text-[#111827] font-black">{selectedColor}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              const matchingVar = variants.find((v) => v.color === color);
              const hex = matchingVar?.colorHex || '#111827';

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#FFF0F3] text-[#A50025] border-[#A50025] ring-1 ring-[#A50025]/30 font-black'
                      : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-slate-400'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 inline-block shadow-2xs shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  <span>{color}</span>
                  {isSelected && <Check className="w-3 h-3 text-[#A50025]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Size:{' '}
              <span className="text-[#111827] font-black">{selectedSize}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#FFF0F3] text-[#A50025] border-[#A50025] ring-1 ring-[#A50025]/30 font-black'
                      : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-slate-400'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
