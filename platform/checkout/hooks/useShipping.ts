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

  const methods = estimate?.methods || [];
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
