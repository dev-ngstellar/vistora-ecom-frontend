export type PaymentGatewayType = 'RAZORPAY' | 'STRIPE' | 'COD';

export interface PaymentInitializationResult {
  gateway: PaymentGatewayType;
  orderId?: string;
  amount: number;
  currency: string;
  keyId?: string;
  clientSecret?: string;
}

export interface PaymentVerificationInput {
  orderId: string;
  gateway: PaymentGatewayType;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  stripePaymentIntentId?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  message: string;
  transactionReference?: string;
}
