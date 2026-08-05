'use client';

import { useCart } from '@/platform/hooks';
import { calculateFinancialSummary, CalculatedFinancialSummary } from '../calculations/summary.calculator';

export const useOrderSummary = (shippingCostOverride?: number): CalculatedFinancialSummary & { itemCount: number } => {
  const { data: cartSummary } = useCart();

  const subtotal = cartSummary?.subtotal || 0;
  const discount = cartSummary?.discount || 0;
  const shippingCost = shippingCostOverride !== undefined ? shippingCostOverride : cartSummary?.shipping || 0;

  const calculated = calculateFinancialSummary({
    subtotal,
    discount,
    shippingCost,
    taxRate: 0.05, // 5% default standard tax
  });

  return {
    ...calculated,
    itemCount: cartSummary?.itemCount || 0,
  };
};
