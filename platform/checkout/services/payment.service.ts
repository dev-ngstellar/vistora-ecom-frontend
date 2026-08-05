import { apiClient } from '@/platform/lib';
import { ApiEnvelope } from '@/platform/types';
import { PaymentVerificationInput, PaymentVerificationResult } from '../types/payment.types';

export const paymentService = {
  verifyPayment: async (input: PaymentVerificationInput): Promise<PaymentVerificationResult> => {
    const res = await apiClient.post<ApiEnvelope<PaymentVerificationResult>>('/payments/verify', input);
    return res.data.data;
  },
};
