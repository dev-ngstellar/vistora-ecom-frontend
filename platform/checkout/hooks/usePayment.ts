'use client';

import { useState } from 'react';
import { PaymentGatewayType } from '../types/payment.types';
import { openRazorpayModal } from '../payments/razorpay.adapter';
import { processCodPayment } from '../payments/cod.adapter';
import { paymentService, CreateRazorpayOrderInput } from '../services/payment.service';
import { brandConfig } from '@/config';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/axios';

export const usePayment = () => {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayType>('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const processPayment = async (params: {
    orderPayload: CreateRazorpayOrderInput;
    userEmail?: string | null;
    userName?: string | null;
    userPhone?: string | null;
  }): Promise<{ success: boolean; orderId?: string; transactionReference?: string }> => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      if (selectedGateway === 'COD') {
        const res = await processCodPayment();
        setIsProcessing(false);
        return { success: res.success, transactionReference: 'COD-CONFIRMED' };
      }

      if (selectedGateway === 'RAZORPAY') {
        // 1. Create Razorpay Order on server
        const rzpOrder = await paymentService.createRazorpayOrder(params.orderPayload);

        return new Promise((resolve) => {
          openRazorpayModal({
            key: rzpOrder.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
            amount: rzpOrder.amountInPaise,
            currency: rzpOrder.currency || 'INR',
            name: brandConfig.name,
            description: `Payment for Order #${rzpOrder.orderNumber}`,
            order_id: rzpOrder.razorpayOrderId,
            prefill: {
              email: params.userEmail || undefined,
              name: params.userName || undefined,
              contact: params.userPhone || undefined,
            },
            handler: async (response) => {
              try {
                const verifyRes = await paymentService.verifyPayment({
                  orderId: rzpOrder.orderId,
                  gateway: 'RAZORPAY',
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id || rzpOrder.razorpayOrderId,
                  razorpaySignature: response.razorpay_signature,
                });

                setIsProcessing(false);
                resolve({
                  success: true,
                  orderId: rzpOrder.orderId,
                  transactionReference: verifyRes.transactionReference || response.razorpay_payment_id,
                });
              } catch (err: any) {
                setIsProcessing(false);
                const msg = getErrorMessage(err, 'Payment verification failed');
                setPaymentError(msg);
                toast.error(msg);
                resolve({ success: false, orderId: rzpOrder.orderId });
              }
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
                setPaymentError('Payment window closed before completing.');
                toast('Payment cancelled or window closed.', { icon: 'ℹ️' });
                resolve({ success: false, orderId: rzpOrder.orderId });
              },
            },
            onPaymentFailed: (failureData: any) => {
              setIsProcessing(false);
              const reason = failureData?.error?.description || 'Payment failed or was declined by bank.';
              setPaymentError(reason);
              toast.error(reason);
              resolve({ success: false, orderId: rzpOrder.orderId });
            },
          }).catch((err) => {
            setIsProcessing(false);
            const msg = getErrorMessage(err, 'Could not launch payment gateway');
            setPaymentError(msg);
            toast.error(msg);
            resolve({ success: false });
          });
        });
      }

      setIsProcessing(false);
      return { success: false };
    } catch (err: any) {
      setIsProcessing(false);
      const msg = getErrorMessage(err, 'Payment processing error');
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
