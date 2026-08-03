export type BannerPosition =
  | 'HERO_SLIDER'
  | 'PROMO_GRID'
  | 'TOP_BAR'
  | 'FOOTER_BANNER'
  | 'CATEGORY_HEADER';

export type CMSPageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  mobileImageUrl?: string | null;
  position: BannerPosition | string;
  buttonText?: string | null;
  buttonLink?: string | null;
  sortOrder: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  status: CMSPageStatus;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
