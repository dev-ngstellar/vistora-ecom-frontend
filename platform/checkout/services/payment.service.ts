import { apiClient } from '@/platform/lib';
import { ApiEnvelope } from '@/platform/types';
import { PaymentVerificationInput, PaymentVerificationResult } from '../types/payment.types';

export interface CreateRazorpayOrderInput {
  orderId?: string;
  addressId?: string;
  couponCode?: string | null;
  notes?: string;
  items?: Array<{ productId: string; variantId?: string | null; quantity: number }>;
}

export interface RazorpayOrderResponse {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  keyId: string;
}

export const paymentService = {
  createRazorpayOrder: async (payload: CreateRazorpayOrderInput): Promise<RazorpayOrderResponse> => {
    const res = await apiClient.post<ApiEnvelope<RazorpayOrderResponse>>('/payments/razorpay/create-order', payload);
    return res.data.data;
  },

  verifyPayment: async (input: PaymentVerificationInput): Promise<PaymentVerificationResult> => {
    const res = await apiClient.post<ApiEnvelope<PaymentVerificationResult>>('/payments/verify', input);
    return res.data.data;
  },
};
