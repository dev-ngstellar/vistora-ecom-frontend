import { z } from 'zod';

export const couponFormSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').max(30).transform((v) => v.toUpperCase()),
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional().nullable(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
  value: z.number().min(0.01, 'Discount value must be greater than 0'),
  minimumOrderAmount: z.number().min(0).optional().nullable(),
  maximumDiscount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'RETURNED',
    'REFUNDED',
  ]),
  remarks: z.string().optional(),
});

export const orderCancelSchema = z.object({
  reason: z.string().min(3, 'Cancellation reason is required'),
});

export const customerStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'PENDING', 'BLOCKED', 'DELETED']),
});

export const reviewReplySchema = z.object({
  replyMessage: z.string().min(3, 'Reply message must be at least 3 characters'),
});

export type CouponFormValues = z.infer<typeof couponFormSchema>;
export type OrderStatusUpdateValues = z.infer<typeof orderStatusUpdateSchema>;
export type OrderCancelValues = z.infer<typeof orderCancelSchema>;
export type CustomerStatusValues = z.infer<typeof customerStatusSchema>;
export type ReviewReplyValues = z.infer<typeof reviewReplySchema>;
