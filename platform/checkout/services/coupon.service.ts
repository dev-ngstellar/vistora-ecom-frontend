import { apiClient } from '@/platform/lib';
import { ApiEnvelope } from '@/platform/types';
import { ValidateCouponResponse } from '@/platform/types';

export const checkoutCouponService = {
  validateCoupon: async (code: string, subtotal: number): Promise<ValidateCouponResponse> => {
    const res = await apiClient.post<ApiEnvelope<ValidateCouponResponse>>('/coupons/validate', {
      code,
      subtotal,
    });
    return res.data.data;
  },
};
