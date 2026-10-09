import { z } from 'zod';

export const INDIAN_STATES = [
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Gujarat',
  'Delhi',
  'Goa',
  'Haryana',
  'Punjab',
  'Rajasthan',
  'Uttar Pradesh',
  'West Bengal',
  'Madhya Pradesh',
  'Bihar',
  'Odisha',
  'Assam',
  'Chhattisgarh',
  'Jharkhand',
  'Himachal Pradesh',
  'Uttarakhand',
  'Jammu and Kashmir',
  'Arunachal Pradesh',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Sikkim',
  'Tripura',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;

export const addressSchema = z.object({
  type: z.enum(['HOME', 'OFFICE', 'OTHER']).default('HOME'),
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(60, 'Full name cannot exceed 60 characters')
    .regex(
      /^[a-zA-Z\s.'-]+$/,
      'Full name must contain only letters and spaces (no numbers or special symbols)',
    ),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .transform((val) => val.replace(/[\s\-+]/g, '').replace(/^91/, ''))
    .refine(
      (val) => /^[6-9]\d{9}$/.test(val),
      'Enter a valid 10-digit Indian mobile number starting with 6-9 (e.g. 9876543210)',
    ),
  addressLine1: z
    .string({ required_error: 'Street address line 1 is required' })
    .trim()
    .min(5, 'Address line 1 must be at least 5 characters (e.g. Door/Flat No., Street)')
    .max(120, 'Address line 1 cannot exceed 120 characters'),
  addressLine2: z
    .string()
    .trim()
    .max(120, 'Address line 2 cannot exceed 120 characters')
    .nullable()
    .optional()
    .or(z.literal('')),
  city: z
    .string({ required_error: 'City is required' })
    .trim()
    .min(2, 'City is required (min 2 characters)')
    .max(50, 'City cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'City must contain only letters and spaces'),
  state: z
    .string({ required_error: 'State is required' })
    .trim()
    .min(2, 'Please select or enter a valid State')
    .max(50, 'State cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'State must contain only letters and spaces'),
  postalCode: z
    .string({ required_error: 'PIN code is required' })
    .trim()
    .regex(/^[1-9][0-9]{5}$/, 'PIN code must be a valid 6-digit Indian postal code (e.g. 641012)'),
  country: z.string().trim().default('India'),
  isDefault: z.boolean().default(false),
});

export type AddressSchemaType = z.infer<typeof addressSchema>;

export const validateAddress = (data: unknown) => {
  return addressSchema.safeParse(data);
};
