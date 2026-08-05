'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addressService } from '../services/address.service';
import { AddressInput, AddressResponse } from '../types/address.types';
import { useAuth } from '@/platform/context';

export const useAddresses = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string | null>(null);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string | null>(null);

  const { data: addresses = [], isLoading } = useQuery<AddressResponse[]>({
    queryKey: ['checkout', 'addresses'],
    queryFn: async () => {
      const list = await addressService.listAddresses();
      // Auto-select default address if available
      const defaultAddr = list.find((a) => a.isDefault) || list[0];
      if (defaultAddr && !selectedShippingAddressId) {
        setSelectedShippingAddressId(defaultAddr.id);
        setSelectedBillingAddressId(defaultAddr.id);
      }
      return list;
    },
    enabled: isAuthenticated,
  });

  const createAddressMutation = useMutation({
    mutationFn: (data: AddressInput) => addressService.createAddress(data),
    onSuccess: (newAddr) => {
      queryClient.invalidateQueries({ queryKey: ['checkout', 'addresses'] });
      setSelectedShippingAddressId(newAddr.id);
      setSelectedBillingAddressId(newAddr.id);
      toast.success('Address saved successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to save address');
    },
  });

  const selectedShippingAddress = addresses.find((a) => a.id === selectedShippingAddressId) || null;
  const selectedBillingAddress = addresses.find((a) => a.id === selectedBillingAddressId) || selectedShippingAddress;

  return {
    addresses,
    isLoading,
    selectedShippingAddressId,
    selectedBillingAddressId,
    selectedShippingAddress,
    selectedBillingAddress,
    selectShippingAddress: (id: string) => {
      setSelectedShippingAddressId(id);
      if (!selectedBillingAddressId) setSelectedBillingAddressId(id);
    },
    selectBillingAddress: (id: string) => setSelectedBillingAddressId(id),
    createAddress: createAddressMutation.mutate,
    isCreating: createAddressMutation.isPending,
  };
};
