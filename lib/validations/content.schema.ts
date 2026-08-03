import { z } from 'zod';

export const bannerFormSchema = z.object({
  title: z.string().min(3, 'Banner title must be at least 3 characters'),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().min(1, 'Desktop banner image is required'),
  mobileImageUrl: z.string().optional().nullable(),
  position: z.string().default('HERO_SLIDER'),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export const cmsPageFormSchema = z.object({
  title: z.string().min(3, 'Page title must be at least 3 characters'),
  slug: z.string().min(2, 'Slug is required').transform((v) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
  content: z.string().min(10, 'Page content must be at least 10 characters'),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;
export type CMSPageFormValues = z.infer<typeof cmsPageFormSchema>;
