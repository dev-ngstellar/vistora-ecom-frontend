'use client';

import React from 'react';
import { Tag } from 'lucide-react';
import { brandConfig } from '@/config';

interface PriceCardProps {
  price: number;
  compareAtPrice?: number | null;
  sku?: string;
}

export const PriceCard: React.FC<PriceCardProps> = ({ price, compareAtPrice, sku }) => {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  const compareNum = compareAtPrice
    ? typeof compareAtPrice === 'string'
      ? parseFloat(compareAtPrice)
      : compareAtPrice
    : null;

  const discountPercent =
    compareNum && compareNum > priceNum
      ? Math.round(((compareNum - priceNum) / compareNum) * 100)
      : null;

  return (
    <div className="space-y-1 py-3 border-y border-[#E5E7EB]">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
          {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
        </span>

        {compareNum && compareNum > priceNum && (
          <span className="text-base sm:text-lg font-semibold text-[#64748B] line-through">
            {brandConfig.currency.symbol}{compareNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
          </span>
        )}

        {discountPercent && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-[#E66001] text-white shadow-xs">
            <Tag className="w-3.5 h-3.5" />
            Save {discountPercent}%
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B] pt-1">
        <span>Taxes included. Free express shipping on orders over ₹1500.</span>
        {sku && <span className="font-mono text-[#64748B] font-bold text-[11px]">SKU: {sku}</span>}
      </div>
    </div>
  );
};
