import { z } from 'zod';

export const addressSchema = z.object({
  type: z.enum(['HOME', 'OFFICE', 'OTHER']).default('HOME'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().nullable().optional(),
  landmark: z.string().nullable().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required').default('United States'),
  isDefault: z.boolean().default(false),
});

export type AddressSchemaType = z.infer<typeof addressSchema>;

export const validateAddress = (data: unknown) => {
  return addressSchema.safeParse(data);
};
