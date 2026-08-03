import { apiClient } from '@/lib/axios';
import { ApiEnvelope } from '@/types/auth.types';
import {
  CartSummaryResponse,
  CouponResponse,
  ShippingEstimateResponse,
  ValidateCouponResponse,
  WishlistSummaryResponse,
} from '@/types/shopping.types';

export const cartService = {
  get: async (): Promise<CartSummaryResponse> => {
    const res = await apiClient.get<ApiEnvelope<CartSummaryResponse>>('/cart');
    return res.data.data;
  },

  addItem: async (
    productId: string,
    variantId?: string | null,
    quantity: number = 1,
  ): Promise<CartSummaryResponse> => {
    const res = await apiClient.post<ApiEnvelope<CartSummaryResponse>>('/cart/items', {
      productId,
      variantId: variantId || null,
      quantity,
    });
    return res.data.data;
  },

  updateItem: async (itemId: string, quantity: number): Promise<CartSummaryResponse> => {
    const res = await apiClient.put<ApiEnvelope<CartSummaryResponse>>(`/cart/items/${itemId}`, {
      quantity,
    });
    return res.data.data;
  },

  removeItem: async (itemId: string): Promise<CartSummaryResponse> => {
    const res = await apiClient.delete<ApiEnvelope<CartSummaryResponse>>(`/cart/items/${itemId}`);
    return res.data.data;
  },

  clear: async (): Promise<CartSummaryResponse> => {
    const res = await apiClient.delete<ApiEnvelope<CartSummaryResponse>>('/cart');
    return res.data.data;
  },

  mergeGuestCart: async (
    guestItems: { productId: string; variantId?: string | null; quantity: number }[],
  ): Promise<CartSummaryResponse> => {
    const res = await apiClient.post<ApiEnvelope<CartSummaryResponse>>('/cart/merge', {
      guestItems,
    });
    return res.data.data;
  },

  applyCoupon: async (code: string): Promise<CartSummaryResponse> => {
    const res = await apiClient.post<ApiEnvelope<CartSummaryResponse>>('/cart/coupon', { code });
    return res.data.data;
  },

  removeCoupon: async (): Promise<CartSummaryResponse> => {
    const res = await apiClient.delete<ApiEnvelope<CartSummaryResponse>>('/cart/coupon');
    return res.data.data;
  },
};

export const wishlistService = {
  get: async (): Promise<WishlistSummaryResponse> => {
    const res = await apiClient.get<ApiEnvelope<WishlistSummaryResponse>>('/wishlist');
    return res.data.data;
  },

  getCount: async (): Promise<number> => {
    const res = await apiClient.get<ApiEnvelope<{ count: number }>>('/wishlist/count');
    return res.data.data.count;
  },

  addItem: async (
    productId: string,
    variantId?: string | null,
  ): Promise<WishlistSummaryResponse> => {
    const res = await apiClient.post<ApiEnvelope<WishlistSummaryResponse>>('/wishlist/items', {
      productId,
      variantId: variantId || null,
    });
    return res.data.data;
  },

  removeItem: async (itemId: string): Promise<WishlistSummaryResponse> => {
    const res = await apiClient.delete<ApiEnvelope<WishlistSummaryResponse>>(
      `/wishlist/items/${itemId}`,
    );
    return res.data.data;
  },

  moveToCart: async (itemId: string): Promise<WishlistSummaryResponse> => {
    const res = await apiClient.post<ApiEnvelope<WishlistSummaryResponse>>(
      `/wishlist/items/${itemId}/move-to-cart`,
    );
    return res.data.data;
  },
};

export const couponService = {
  validate: async (code: string, subtotal: number): Promise<ValidateCouponResponse> => {
    const res = await apiClient.post<ApiEnvelope<ValidateCouponResponse>>('/coupons/validate', {
      code,
      subtotal,
    });
    return res.data.data;
  },

  listPublic: async (): Promise<CouponResponse[]> => {
    const res = await apiClient.get<ApiEnvelope<CouponResponse[]>>('/coupons');
    return res.data.data;
  },

  create: async (data: Partial<CouponResponse>): Promise<CouponResponse> => {
    const res = await apiClient.post<ApiEnvelope<CouponResponse>>('/coupons', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<CouponResponse>): Promise<CouponResponse> => {
    const res = await apiClient.put<ApiEnvelope<CouponResponse>>(`/coupons/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/coupons/${id}`);
  },
};

export const shippingService = {
  estimate: async (
    subtotal: number,
    postalCode?: string,
    country?: string,
  ): Promise<ShippingEstimateResponse> => {
    const res = await apiClient.post<ApiEnvelope<ShippingEstimateResponse>>('/shipping/estimate', {
      subtotal,
      postalCode,
      country,
    });
    return res.data.data;
  },
};
