export interface CartItemResponse {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  variantId: string | null;
  variantSku: string | null;
  variantColor: string | null;
  variantSize: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availableStock: number;
}

export interface CartSummaryResponse {
  id: string;
  userId: string;
  status: string;
  couponCode: string | null;
  items: CartItemResponse[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShippingEligible: boolean;
  freeShippingThreshold: number;
}

export interface WishlistItemResponse {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string;
  variantId: string | null;
  variantSku: string | null;
  variantColor: string | null;
  variantSize: string | null;
}

export interface WishlistSummaryResponse {
  id: string;
  userId: string;
  items: WishlistItemResponse[];
  itemCount: number;
}

export interface CouponResponse {
  id: string;
  code: string;
  title: string;
  description: string | null;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minimumOrderAmount: number | null;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  createdAt: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  code: string;
  title: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  calculatedDiscount: number;
  message: string;
}

export interface ShippingMethodEstimate {
  id: string;
  name: string;
  code: string;
  description: string;
  cost: number;
  estimatedDays: string;
  isFree: boolean;
}

export interface ShippingEstimateResponse {
  subtotal: number;
  freeShippingEligible: boolean;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  methods: ShippingMethodEstimate[];
}
