import { apiClient } from '@/platform/lib';
import { ApiEnvelope } from '@/platform/types';
import { Order } from '@/platform/types';

export interface CreateOrderPayload {
  addressId: string;
  paymentMethod: 'RAZORPAY' | 'STRIPE' | 'COD';
  couponCode?: string | null;
  notes?: string;
  items?: Array<{ productId: string; variantId?: string | null; quantity: number }>;
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

  getMyOrders: async (): Promise<Order[]> => {
    const res = await apiClient.get<ApiEnvelope<Order[]>>('/orders/my');
    return res.data.data;
  },

  downloadInvoice: async (orderId: string): Promise<any> => {
    const res = await apiClient.get<ApiEnvelope<any>>(`/orders/${orderId}/invoice`);
    return res.data.data;
  },
};
