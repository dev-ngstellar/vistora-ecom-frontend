import { apiClient } from '@/platform/lib';
import { ApiEnvelope } from '@/platform/types';
import { ShippingEstimatePayload, ShippingEstimateResult } from '../types/shipping.types';

export const shippingService = {
  estimateShipping: async (payload: ShippingEstimatePayload): Promise<ShippingEstimateResult> => {
    const res = await apiClient.post<ApiEnvelope<ShippingEstimateResult>>('/shipping/estimate', payload);
    return res.data.data;
  },
};
