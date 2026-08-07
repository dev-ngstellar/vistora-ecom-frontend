'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { shippingService } from '../services/shipping.service';
import { ShippingMethod, ShippingEstimateResult } from '../types/shipping.types';
import { AddressResponse } from '../types/address.types';

export const useShipping = (subtotal: number, selectedAddress?: AddressResponse | null) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  const { data: estimate, isLoading } = useQuery<ShippingEstimateResult>({
    queryKey: ['checkout', 'shipping', subtotal, selectedAddress?.postalCode, selectedAddress?.country],
    queryFn: async () => {
      const res = await shippingService.estimateShipping({
        subtotal,
        postalCode: selectedAddress?.postalCode,
        country: selectedAddress?.country,
      });
      if (res.methods.length > 0 && !selectedMethodId) {
        setSelectedMethodId(res.methods[0].id);
      }
      return res;
    },
    enabled: subtotal > 0,
  });

  const defaultMethods: ShippingMethod[] = [
    {
      id: 'standard-delivery',
      name: 'Standard Express Courier',
      code: 'STANDARD',
      description: 'Delivered in 3 to 5 business days with live tracking',
      cost: subtotal >= 150 ? 0 : 15,
      estimatedDays: '3-5 Business Days',
      isFree: subtotal >= 150,
    },
    {
      id: 'next-day-priority',
      name: 'VIP Next-Day Priority',
      code: 'PRIORITY',
      description: 'Guaranteed next-day delivery for urgent orders',
      cost: 35,
      estimatedDays: '1 Business Day',
      isFree: false,
    },
  ];

  const methods = (estimate?.methods && estimate.methods.length > 0) ? estimate.methods : defaultMethods;
  const selectedMethod: ShippingMethod | null =
    methods.find((m) => m.id === selectedMethodId) || methods[0] || null;

  const shippingCost = selectedMethod ? selectedMethod.cost : estimate?.freeShippingEligible ? 0 : 15;

  return {
    methods,
    selectedMethod,
    selectedMethodId: selectedMethod?.id || null,
    setSelectedMethodId,
    shippingCost,
    freeShippingEligible: estimate?.freeShippingEligible || false,
    freeShippingThreshold: estimate?.freeShippingThreshold || 150,
    amountNeededForFreeShipping: estimate?.amountNeededForFreeShipping || 0,
    isLoading,
  };
};
