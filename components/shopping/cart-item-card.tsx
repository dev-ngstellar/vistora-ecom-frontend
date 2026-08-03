'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartItemResponse } from '@/types/shopping.types';
import { QuantitySelector } from './quantity-selector';
import { Trash2 } from 'lucide-react';

interface CartItemCardProps {
  item: CartItemResponse;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  disabled?: boolean;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  disabled = false,
}) => {
  const fallbackImage =
    item.imageUrl ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
      {/* Product info */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          <Image
            src={fallbackImage}
            alt={item.productName}
            fill
            sizes="80px"
            className="object-cover object-center"
          />
        </div>

        <div className="space-y-1">
          <Link
            href={`/product/${item.productSlug}`}
            className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1"
          >
            {item.productName}
          </Link>

          {/* Variant attributes */}
          {(item.variantColor || item.variantSize || item.variantSku) && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {item.variantColor && (
                <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                  {item.variantColor}
                </span>
              )}
              {item.variantSize && (
                <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                  Size: {item.variantSize}
                </span>
              )}
              {item.variantSku && (
                <span className="font-mono text-[10px] text-slate-400">SKU: {item.variantSku}</span>
              )}
            </div>
          )}

          <div className="text-xs text-slate-500 font-medium">
            Unit Price: ${item.unitPrice.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Quantity & Total Price */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <QuantitySelector
          quantity={item.quantity}
          maxStock={item.availableStock}
          onChange={(newQty) => onUpdateQuantity(item.id, newQty)}
          disabled={disabled}
        />

        <div className="text-right">
          <span className="text-base font-extrabold text-slate-900 block">
            ${item.totalPrice.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemoveItem(item.id)}
          disabled={disabled}
          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Remove Item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
