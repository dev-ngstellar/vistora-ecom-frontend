'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxStock?: number;
  onChange: (newQuantity: number) => void;
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxStock = 99,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 w-max">
      <button
        type="button"
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="w-7 h-7 rounded-lg bg-white text-slate-800 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs flex items-center justify-center"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="w-8 text-center text-xs font-bold text-slate-900">{quantity}</span>

      <button
        type="button"
        disabled={disabled || quantity >= maxStock}
        onClick={() => onChange(Math.min(maxStock, quantity + 1))}
        className="w-7 h-7 rounded-lg bg-white text-slate-800 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs flex items-center justify-center"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
