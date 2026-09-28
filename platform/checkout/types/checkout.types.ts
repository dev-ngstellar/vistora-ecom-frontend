export enum CheckoutStep {
  CUSTOMER_DETAILS = 0,
  SHIPPING_ADDRESS = 1,
  PAYMENT_METHOD = 2,
  ORDER_REVIEW = 3,
  CONFIRMATION = 4,
}

export interface StepStatus {
  step: CheckoutStep;
  title: string;
  isCompleted: boolean;
  isValid: boolean;
  errorMessage?: string;
}

export interface CheckoutState {
  currentStep: CheckoutStep;
  highestStepReached: CheckoutStep;
  selectedAddressId: string | null;
  selectedShippingMethodId: string | null;
  selectedPaymentMethod: 'RAZORPAY' | 'STRIPE' | 'COD';
  appliedCouponCode: string | null;
  notes: string;
  isSubmitting: boolean;
  orderId: string | null;
  error: string | null;
}
