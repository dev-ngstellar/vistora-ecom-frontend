'use client';

import React, { useState } from 'react';
import { Tag, Ticket, Check, X } from 'lucide-react';

interface CouponFormProps {
  appliedCoupon?: string | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  isLoading?: boolean;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  isLoading = false,
}) => {
  const [couponInput, setCouponInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      onApplyCoupon(couponInput.trim().toUpperCase());
      setCouponInput('');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
        <Ticket className="w-4 h-4 text-indigo-600" />
        <span>Promo Code / Gift Coupon</span>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-extrabold text-emerald-900 font-mono">
              {appliedCoupon} APPLIED
            </span>
          </div>
          <button
            type="button"
            onClick={onRemoveCoupon}
            disabled={isLoading}
            className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 transition"
          >
            <X className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code (e.g. LUXURY20)"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono uppercase"
          />
          <button
            type="submit"
            disabled={isLoading || !couponInput.trim()}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition disabled:opacity-40"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
};
