export interface FinancialSummaryInput {
  subtotal: number;
  discount: number;
  shippingCost: number;
  taxRate?: number; // e.g. 0.08 for 8%
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
  const taxRate = input.taxRate || 0.05; // 5% default standard tax
  const taxAmount = parseFloat((taxableAmount * taxRate).toFixed(2));
  
  const grandTotal = parseFloat((taxableAmount + shippingCost + taxAmount).toFixed(2));

  return {
    subtotal,
    discount,
    shippingCost,
    taxAmount,
    grandTotal,
  };
};
