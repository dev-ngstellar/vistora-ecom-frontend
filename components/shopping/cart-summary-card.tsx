'use client';

import React from 'react';
import Link from 'next/link';
import { CartSummaryResponse } from '@/types/shopping.types';
import { ArrowRight, ShieldCheck, Truck, Lock } from 'lucide-react';

interface CartSummaryCardProps {
  summary: CartSummaryResponse;
  onProceedToCheckout?: () => void;
}

export const CartSummaryCard: React.FC<CartSummaryCardProps> = ({
  summary,
  onProceedToCheckout,
}) => {
  const amountNeeded = Math.max(0, summary.freeShippingThreshold - summary.subtotal);
  const freeProgress = Math.min(100, (summary.subtotal / summary.freeShippingThreshold) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <h2 className="text-lg font-black text-slate-900 tracking-tight">Order Summary</h2>

      {/* Free Shipping Progress Indicator */}
      <div className="space-y-2 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
          <Truck className="w-4 h-4 text-indigo-600" />
          {summary.freeShippingEligible ? (
            <span>You qualify for FREE Worldwide Express Shipping!</span>
          ) : (
            <span>
              Add <span className="text-indigo-600 font-black">${amountNeeded.toFixed(2)}</span> more for FREE Shipping
            </span>
          )}
        </div>
        <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeProgress}%` }}
          />
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 text-xs border-b border-slate-100 pb-4">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ({summary.itemCount} items)</span>
          <span className="font-bold text-slate-900">${summary.subtotal.toFixed(2)}</span>
        </div>

        {summary.discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon Discount ({summary.couponCode})</span>
            <span>-${summary.discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>Estimated Sales Tax (8%)</span>
          <span className="font-bold text-slate-900">${summary.tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Shipping Fee</span>
          {summary.shipping === 0 ? (
            <span className="font-extrabold text-emerald-600 uppercase">FREE</span>
          ) : (
            <span className="font-bold text-slate-900">${summary.shipping.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-base font-black text-slate-900 block">Grand Total</span>
          <span className="text-[10px] text-slate-400">Includes taxes & shipping</span>
        </div>
        <span className="text-2xl font-black text-indigo-600">
          ${summary.total.toFixed(2)}
        </span>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <Link
          href="/checkout"
          onClick={onProceedToCheckout}
          className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-xs tracking-wider uppercase transition shadow-xl flex items-center justify-center gap-2 group"
        >
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Proceed to Secure Checkout</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/shop"
          className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
      </div>
    </div>
  );
};
