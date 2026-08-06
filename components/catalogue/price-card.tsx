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
    <div className="space-y-1">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-slate-900 tracking-tight">
          {brandConfig.currency.symbol}{priceNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>

        {compareNum && compareNum > priceNum && (
          <span className="text-lg font-semibold text-slate-400 line-through">
            {brandConfig.currency.symbol}{compareNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        )}

        {discountPercent && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white shadow-xs">
            <Tag className="w-3.5 h-3.5" />
            Save {discountPercent}%
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>Taxes included. Free worldwide express shipping on luxury orders.</span>
        {sku && <span className="font-mono text-slate-400">SKU: {sku}</span>}
      </div>
    </div>
  );
};
