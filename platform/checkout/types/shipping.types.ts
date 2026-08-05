export interface ShippingMethod {
  id: string;
  name: string;
  code: string;
  description: string;
  cost: number;
  estimatedDays: string;
  isFree: boolean;
}

export interface ShippingEstimatePayload {
  subtotal: number;
  postalCode?: string;
  country?: string;
}

export interface ShippingEstimateResult {
  subtotal: number;
  freeShippingEligible: boolean;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  methods: ShippingMethod[];
}
