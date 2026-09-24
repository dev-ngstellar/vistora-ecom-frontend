'use client';

import React from 'react';
import Link from 'next/link';
import { CartSummaryResponse } from '@/types/shopping.types';
import { ArrowRight, ShieldCheck, Truck, Lock, Tag, Sparkles, Loader2 } from 'lucide-react';
import { brandConfig } from '@/config';
import { useCoupons } from '@/platform/checkout';

interface CartSummaryCardProps {
  summary: CartSummaryResponse;
  onProceedToCheckout?: () => void;
}

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export const CartSummaryCard: React.FC<CartSummaryCardProps> = ({
  summary,
  onProceedToCheckout,
}) => {
  const { requireCustomerAuth } = useAuth();
  const router = useRouter();
  const { couponCode, coupon, discountAmount, applyCoupon, removeCoupon, isApplying, isRemoving } = useCoupons();
  const [couponInput, setCouponInput] = React.useState('');

  const subtotalNum = Number(summary.subtotal) || 0;
  const discountNum = Number(summary.discount) || 0;
  const taxNum = Number(summary.tax) || 0;
  const shippingNum = Number(summary.shipping) || 0;
  const totalNum = Number(summary.total) || 0;
  const thresholdNum = Number(summary.freeShippingThreshold) || 150;

  const amountNeeded = Math.max(0, thresholdNum - subtotalNum);
  const freeProgress = Math.min(100, (subtotalNum / thresholdNum) * 100);

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
    requireCustomerAuth(() => {
      router.push('/checkout');
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <h2 className="text-lg font-black text-slate-900 tracking-tight">Order Summary</h2>

      {/* Free Shipping Progress Indicator */}
      <div className="space-y-2 p-3.5 rounded-2xl bg-orange-light border border-orange-200">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Truck className="w-4 h-4 text-orange" />
          {summary.freeShippingEligible ? (
            <span>You qualify for FREE Worldwide Express Shipping!</span>
          ) : (
            <span>
              Add <span className="text-orange font-black">{brandConfig.currency.symbol}{amountNeeded.toFixed(2)}</span> more for FREE Shipping
            </span>
          )}
        </div>
        <div className="w-full bg-orange-200/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-orange h-full rounded-full transition-all duration-500"
            style={{ width: `${freeProgress}%` }}
          />
        </div>
      </div>

      {/* Promo Code Box */}
      <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Tag className="w-3.5 h-3.5 text-[#E66001]" />
            <span>Have a Promo Code?</span>
          </div>
          {couponCode && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              Applied
            </span>
          )}
        </div>

        {couponCode ? (
          <div className="p-3 bg-white border border-emerald-300 rounded-xl space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-black text-xs text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {couponCode}
              </span>
              <button
                onClick={() => removeCoupon()}
                disabled={isRemoving}
                className="text-rose-600 hover:text-rose-700 text-xs font-bold hover:underline cursor-pointer"
              >
                {isRemoving ? 'Removing...' : 'Remove'}
              </button>
            </div>
            {discountNum > 0 && (
              <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E66001] fill-[#E66001]" />
                You are saving {brandConfig.currency.symbol}{discountNum.toFixed(2)} on this order!
              </p>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ENTER CODE..."
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && couponInput.trim()) {
                  e.preventDefault();
                  applyCoupon(couponInput.trim());
                  setCouponInput('');
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs uppercase font-mono font-bold placeholder:font-sans placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#A50025]"
            />
            <button
              onClick={() => {
                if (couponInput.trim()) {
                  applyCoupon(couponInput.trim());
                  setCouponInput('');
                }
              }}
              disabled={isApplying || !couponInput.trim()}
              className="px-4 py-2 rounded-xl bg-[#A50025] text-white text-xs font-bold hover:bg-[#80001D] disabled:opacity-50 transition shadow-xs flex items-center gap-1"
            >
              {isApplying ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
            </button>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 text-xs border-b border-slate-100 pb-4">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ({summary.itemCount} items)</span>
          <span className="font-bold text-slate-900">{brandConfig.currency.symbol}{subtotalNum.toFixed(2)}</span>
        </div>

        {discountNum > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon Discount ({summary.couponCode})</span>
            <span>-{brandConfig.currency.symbol}{discountNum.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>Estimated Sales Tax (8%)</span>
          <span className="font-bold text-slate-900">{brandConfig.currency.symbol}{taxNum.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Shipping Fee</span>
          {shippingNum === 0 ? (
            <span className="font-extrabold text-emerald-600 uppercase">FREE</span>
          ) : (
            <span className="font-bold text-slate-900">{brandConfig.currency.symbol}{shippingNum.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-base font-black text-slate-900 block">Grand Total</span>
          <span className="text-[10px] text-slate-400">Includes taxes & shipping</span>
        </div>
        <span className="text-2xl font-black text-maroon">
          {brandConfig.currency.symbol}{totalNum.toFixed(2)}
        </span>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCheckoutClick}
          className="w-full py-4 px-6 rounded-2xl bg-maroon hover:bg-maroon-dark text-white font-extrabold text-xs tracking-wider uppercase transition shadow-xl flex items-center justify-center gap-2 group"
        >
          <Lock className="w-4 h-4 text-amber-300" />
          <span>Proceed to Secure Checkout</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

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
