import { CheckoutStep } from '../types/checkout.types';

export const isStepValid = (
  step: CheckoutStep,
  context: {
    isAuthenticated: boolean;
    hasItemsInCart: boolean;
    selectedAddressId: string | null;
    selectedShippingMethodId: string | null;
    selectedPaymentMethod: string | null;
  },
): boolean => {
  switch (step) {
    case CheckoutStep.CUSTOMER_DETAILS:
      return context.isAuthenticated;

    case CheckoutStep.SHIPPING_ADDRESS:
      return context.isAuthenticated && Boolean(context.selectedAddressId);

    case CheckoutStep.SHIPPING_METHOD:
      return Boolean(context.selectedShippingMethodId);

    case CheckoutStep.PAYMENT_METHOD:
      return Boolean(context.selectedPaymentMethod);

    case CheckoutStep.ORDER_REVIEW:
      return (
        context.isAuthenticated &&
        context.hasItemsInCart &&
        Boolean(context.selectedAddressId) &&
        Boolean(context.selectedPaymentMethod)
      );

    case CheckoutStep.CONFIRMATION:
      return true;

    default:
      return false;
  }
};
