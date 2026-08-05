import { apiClient } from '@/platform/lib';
import { ApiEnvelope } from '@/platform/types';
import { Order } from '@/platform/types';

export interface CreateOrderPayload {
  addressId: string;
  paymentMethod: 'RAZORPAY' | 'STRIPE' | 'COD';
  couponCode?: string | null;
  notes?: string;
}

export const checkoutService = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const res = await apiClient.post<ApiEnvelope<Order>>('/orders', payload);
    return res.data.data;
  },

  getOrderDetails: async (orderId: string): Promise<Order> => {
    const res = await apiClient.get<ApiEnvelope<Order>>(`/orders/${orderId}`);
    return res.data.data;
  },
};
