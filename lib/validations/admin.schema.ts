import { z } from 'zod';

export const staffUserFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email address is required'),
  passwordRaw: z.string().min(8, 'Password must be at least 8 characters').optional(),
  phone: z.string().optional().nullable(),
  roleName: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CUSTOMER']),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const roleFormSchema = z.object({
  name: z.string().min(2, 'Role name is required'),
  description: z.string().optional().nullable(),
});

export type StaffUserFormValues = z.infer<typeof staffUserFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type RoleFormValues = z.infer<typeof roleFormSchema>;
