'use client';

import { useCart, useCartMutations } from '@/platform/hooks';

export const useCoupons = () => {
  const { data: cartSummary } = useCart();
  const { applyCoupon, removeCoupon } = useCartMutations();

  const couponCode = cartSummary?.couponCode || null;
  const discountAmount = cartSummary?.discount || 0;

  return {
    couponCode,
    discountAmount,
    applyCoupon: (code: string) => applyCoupon.mutate(code),
    removeCoupon: () => removeCoupon.mutate(),
    isApplying: applyCoupon.isPending,
    isRemoving: removeCoupon.isPending,
  };
};
