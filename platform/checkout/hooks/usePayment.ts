'use client';

import { useState } from 'react';
import { PaymentGatewayType } from '../types/payment.types';
import { openRazorpayModal } from '../payments/razorpay.adapter';
import { processCodPayment } from '../payments/cod.adapter';
import { processStripePayment } from '../payments/stripe.adapter';
import { paymentService } from '../services/payment.service';
import { brandConfig } from '@/config';
import toast from 'react-hot-toast';

export const usePayment = () => {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayType>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const processPayment = async (params: {
    orderId: string;
    amount: number;
    userEmail?: string;
    userName?: string;
    userPhone?: string;
  }): Promise<{ success: boolean; transactionReference?: string }> => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      if (selectedGateway === 'COD') {
        const res = await processCodPayment();
        setIsProcessing(false);
        return { success: res.success, transactionReference: 'COD-CONFIRMED' };
      }

      if (selectedGateway === 'RAZORPAY') {
        return new Promise((resolve) => {
          openRazorpayModal({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
            amount: Math.round(params.amount * 100), // in paise
            currency: brandConfig.currency.code,
            name: brandConfig.name,
            description: `Payment for Order #${params.orderId}`,
            prefill: {
              email: params.userEmail,
              name: params.userName,
              contact: params.userPhone,
            },
            handler: async (response) => {
              try {
                const verifyRes = await paymentService.verifyPayment({
                  orderId: params.orderId,
                  gateway: 'RAZORPAY',
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                });
                setIsProcessing(false);
                resolve({ success: true, transactionReference: verifyRes.transactionReference || response.razorpay_payment_id });
              } catch (err: any) {
                setIsProcessing(false);
                const msg = err.message || 'Payment verification failed';
                setPaymentError(msg);
                toast.error(msg);
                resolve({ success: false });
              }
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
                setPaymentError('Payment window closed by user.');
                resolve({ success: false });
              },
            },
          }).catch((err) => {
            setIsProcessing(false);
            setPaymentError(err.message);
            toast.error(err.message);
            resolve({ success: false });
          });
        });
      }

      if (selectedGateway === 'STRIPE') {
        const stripeRes = await processStripePayment({
          clientSecret: 'mock_stripe_client_secret',
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_mock',
        });
        setIsProcessing(false);
        if (stripeRes.success) {
          return { success: true, transactionReference: stripeRes.paymentIntentId };
        } else {
          setPaymentError(stripeRes.error || 'Stripe payment failed.');
          return { success: false };
        }
      }

      setIsProcessing(false);
      return { success: false };
    } catch (err: any) {
      setIsProcessing(false);
      const msg = err.message || 'Payment processing error';
      setPaymentError(msg);
      toast.error(msg);
      return { success: false };
    }
  };

  return {
    selectedGateway,
    setSelectedGateway,
    processPayment,
    isProcessing,
    paymentError,
  };
};
