export type CategoryStatus = 'ACTIVE' | 'INACTIVE';
export type BrandStatus = 'ACTIVE' | 'INACTIVE';
export type CollectionStatus = 'ACTIVE' | 'INACTIVE';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
export type ProductVisibility = 'PUBLIC' | 'PRIVATE';
export type VariantStatus = 'ACTIVE' | 'INACTIVE';
export type AttributeType = 'TEXT' | 'COLOR' | 'SIZE' | 'NUMBER' | 'BOOLEAN';

export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  status: CategoryStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  parent?: Category | null;
  children?: Category[];
}

export interface CategoryTreeItem extends Category {
  children?: CategoryTreeItem[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  website: string | null;
  status: BrandStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerImage: string | null;
  status: CollectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode: string | null;
  color: string | null;
  colorHex: string | null;
  size: string | null;
  weight: number | null;
  dimensions: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  status: VariantStatus;
}

export interface ProductAttributeValue {
  id: string;
  attributeId: string;
  value: string;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  name: string;
  type: AttributeType;
  values: ProductAttributeValue[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  sku: string;
  barcode: string | null;
  categoryId: string;
  category: Category;
  brandId: string | null;
  brand: Brand | null;
  collectionId: string | null;
  collection: Collection | null;
  costPrice: number | null;
  price: number;
  compareAtPrice: number | null;
  taxRate: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  status: ProductStatus;
  visibility: ProductVisibility;
  featured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryFilters {
  q?: string;
  categoryId?: string;
  brandId?: string;
  collectionId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  featured?: boolean;
  visibility?: ProductVisibility;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedProductsResponse {
  items: Product[];
  meta: PaginatedMeta;
}
