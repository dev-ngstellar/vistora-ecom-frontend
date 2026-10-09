'use client';

import { useCart } from '@/platform/hooks';
import { calculateFinancialSummary, CalculatedFinancialSummary } from '../calculations/summary.calculator';

export const useOrderSummary = (
  shippingCostOverride?: number,
): CalculatedFinancialSummary & {
  itemCount: number;
  taxRate: number;
  taxLabel: string;
  taxInclusive: boolean;
} => {
  const { data: cartSummary } = useCart();

  const subtotal = cartSummary?.subtotal || 0;
  const discount = cartSummary?.discount || 0;
  const shippingCost = shippingCostOverride !== undefined ? shippingCostOverride : cartSummary?.shipping || 0;
  const taxRate = cartSummary?.taxRate !== undefined ? cartSummary.taxRate : 5;
  const taxLabel = cartSummary?.taxLabel || 'GST';
  const taxInclusive = Boolean(cartSummary?.taxInclusive);

  const calculated = calculateFinancialSummary({
    subtotal,
    discount,
    shippingCost,
    taxRate: taxRate / 100,
    taxInclusive,
  });

  return {
    ...calculated,
    taxRate,
    taxLabel,
    taxInclusive,
    itemCount: cartSummary?.itemCount || 0,
  };
};
