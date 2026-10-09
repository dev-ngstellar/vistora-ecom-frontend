export interface FinancialSummaryInput {
  subtotal: number;
  discount: number;
  shippingCost: number;
  taxRate?: number; // e.g. 0.05 for 5%
  taxInclusive?: boolean;
}

export interface CalculatedFinancialSummary {
  subtotal: number;
  discount: number;
  shippingCost: number;
  taxAmount: number;
  grandTotal: number;
}

export const calculateFinancialSummary = (
  input: FinancialSummaryInput,
): CalculatedFinancialSummary => {
  const subtotal = Math.max(0, input.subtotal);
  const discount = Math.max(0, input.discount);
  const shippingCost = Math.max(0, input.shippingCost);
  
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxRate = input.taxRate !== undefined ? input.taxRate : 0.05;
  const taxInclusive = Boolean(input.taxInclusive);

  let taxAmount = 0;
  if (taxInclusive) {
    taxAmount = parseFloat(((taxableAmount * (taxRate * 100)) / (100 + taxRate * 100)).toFixed(2));
  } else {
    taxAmount = parseFloat((taxableAmount * taxRate).toFixed(2));
  }
  
  const grandTotal = parseFloat((taxableAmount + (taxInclusive ? 0 : taxAmount) + shippingCost).toFixed(2));

  return {
    subtotal,
    discount,
    shippingCost,
    taxAmount,
    grandTotal,
  };
};
