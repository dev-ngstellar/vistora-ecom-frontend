export interface AddressInput {
  type: 'HOME' | 'OFFICE' | 'OTHER';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressResponse extends AddressInput {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
