'use client';

import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { CheckoutStep } from '../types/checkout.types';
import { checkoutService, CreateOrderPayload } from '../services/checkout.service';
import { isStepValid } from '../validators/checkout.validator';
import { useAuth } from '@/platform/context';
import { useCart } from '@/platform/hooks';

export const useCheckout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { data: cartSummary } = useCart();

  const isBuyNow = searchParams?.get('buyNow') === 'true';

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING_ADDRESS);
  const [highestStepReached, setHighestStepReached] = useState<CheckoutStep>(CheckoutStep.SHIPPING_ADDRESS);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string | null>('standard-delivery');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'RAZORPAY' | 'STRIPE' | 'COD'>('COD');
  const [notes, setNotes] = useState<string>('');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const cartItemsCount = cartSummary?.itemCount || 0;
  const hasItemsInCart = cartItemsCount > 0;

  const checkStepValidity = (step: CheckoutStep): boolean => {
    return isStepValid(step, {
      isAuthenticated,
      hasItemsInCart,
      selectedAddressId,
      selectedShippingMethodId,
      selectedPaymentMethod,
    });
  };

  const goToStep = (targetStep: CheckoutStep) => {
    if (targetStep <= highestStepReached || checkStepValidity(targetStep - 1)) {
      setCurrentStep(targetStep);
      if (targetStep > highestStepReached) {
        setHighestStepReached(targetStep);
      }
    } else {
      toast.error('Please complete the current step before proceeding.');
    }
  };

  const nextStep = () => {
    if (checkStepValidity(currentStep)) {
      const next = (currentStep + 1) as CheckoutStep;
      goToStep(next);
    } else {
      toast.error('Please fulfill step requirements before advancing.');
    }
  };

  const prevStep = () => {
    if (currentStep > CheckoutStep.CUSTOMER_DETAILS) {
      setCurrentStep((currentStep - 1) as CheckoutStep);
    }
  };

  const createOrderMutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => checkoutService.createOrder(payload),
    onSuccess: (order) => {
      setCreatedOrderId(order.id);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('buyNowItem');
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setCurrentStep(CheckoutStep.CONFIRMATION);
      toast.success(`Order #${order.orderNumber} created successfully!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to place order. Please try again.');
    },
  });

  const submitOrder = (payload?: Partial<CreateOrderPayload>) => {
    if (!selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }

    let buyNowPayload: Partial<CreateOrderPayload> = {};
    if (isBuyNow && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('buyNowItem');
      if (stored) {
        try {
          const buyNowItem = JSON.parse(stored);
          buyNowPayload = {
            items: [{
              productId: buyNowItem.productId,
              variantId: buyNowItem.variantId || null,
              quantity: buyNowItem.quantity
            }]
          };
        } catch (e) {
          console.error(e);
        }
      }
    }

    createOrderMutation.mutate({
      addressId: selectedAddressId,
      paymentMethod: selectedPaymentMethod,
      couponCode: cartSummary?.couponCode || null,
      notes,
      ...buyNowPayload,
      ...payload,
    });
  };

  return {
    currentStep,
    highestStepReached,
    selectedAddressId,
    setSelectedAddressId,
    selectedShippingMethodId,
    setSelectedShippingMethodId,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    notes,
    setNotes,
    createdOrderId,
    cartSummary,
    user,
    isAuthenticated,
    hasItemsInCart,
    isStepValid: checkStepValidity,
    goToStep,
    nextStep,
    prevStep,
    submitOrder,
    isSubmittingOrder: createOrderMutation.isPending,
  };
};
