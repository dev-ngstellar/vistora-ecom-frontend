import { apiClient } from '@/platform/lib';
import { ApiEnvelope } from '@/platform/types';
import { AddressInput, AddressResponse } from '../types/address.types';

export const addressService = {
  listAddresses: async (): Promise<AddressResponse[]> => {
    const res = await apiClient.get<ApiEnvelope<AddressResponse[]>>('/customers/addresses');
    return res.data.data;
  },

  createAddress: async (data: AddressInput): Promise<AddressResponse> => {
    const res = await apiClient.post<ApiEnvelope<AddressResponse>>('/customers/addresses', data);
    return res.data.data;
  },

  updateAddress: async (id: string, data: Partial<AddressInput>): Promise<AddressResponse> => {
    const res = await apiClient.put<ApiEnvelope<AddressResponse>>(`/customers/addresses/${id}`, data);
    return res.data.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/addresses/${id}`);
  },
};
