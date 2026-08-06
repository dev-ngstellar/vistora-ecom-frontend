'use client';

import React, { useState, useEffect } from 'react';
import { ProductVariant } from '@/types/catalogue.types';
import { Check, Info } from 'lucide-react';

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
    <div className="space-y-5 py-4 border-y border-slate-200/80">
      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Color:{' '}
              <span className="text-indigo-600 font-extrabold">{selectedColor}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              const matchingVar = variants.find((v) => v.color === color);
              const hex = matchingVar?.colorHex || '#1A1A1A';

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shadow-xs"
                    style={{ backgroundColor: hex }}
                  />
                  <span>{color}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Size:{' '}
              <span className="text-indigo-600 font-extrabold">{selectedSize}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              // Check stock availability for this size
              const matchingVariant = variants.find(
                (v) => v.size === size && (!selectedColor || v.color === selectedColor),
              );
              const isOutOfStock = matchingVariant ? matchingVariant.stock <= 0 : false;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => handleSizeChange(size)}
                  className={`w-12 h-10 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center border ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed line-through'
                      : isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-105'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
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
