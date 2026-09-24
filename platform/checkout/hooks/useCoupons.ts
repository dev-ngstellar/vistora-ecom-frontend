'use client';

import { useCart, useCartMutations } from '@/platform/hooks';

export const useCoupons = () => {
  const { data: cartSummary } = useCart();
  const { applyCoupon, removeCoupon } = useCartMutations();

  const couponCode = cartSummary?.couponCode || cartSummary?.coupon?.code || null;
  const coupon = cartSummary?.coupon || (couponCode ? { code: couponCode, title: couponCode, type: 'PERCENTAGE', value: 0, discountAmount: cartSummary?.discount || 0 } : null);
  const discountAmount = cartSummary?.discount || 0;

  return {
    couponCode,
    coupon,
    discountAmount,
    applyCoupon: (code: string) => applyCoupon.mutate(code),
    removeCoupon: () => removeCoupon.mutate(),
    isApplying: applyCoupon.isPending,
    isRemoving: removeCoupon.isPending,
  };
};
