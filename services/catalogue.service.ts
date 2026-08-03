import { apiClient } from '@/lib/axios';
import { ApiEnvelope } from '@/types/auth.types';
import {
  Brand,
  Category,
  CategoryTreeItem,
  Collection,
  Product,
  ProductQueryFilters,
  PaginatedMeta,
} from '@/types/catalogue.types';

export const categoryService = {
  list: async (): Promise<Category[]> => {
    const res = await apiClient.get<ApiEnvelope<Category[]>>('/categories');
    return res.data.data;
  },

  getTree: async (): Promise<CategoryTreeItem[]> => {
    const res = await apiClient.get<ApiEnvelope<CategoryTreeItem[]>>('/categories/tree');
    return res.data.data;
  },

  getByIdOrSlug: async (idOrSlug: string): Promise<Category> => {
    const res = await apiClient.get<ApiEnvelope<Category>>(`/categories/${idOrSlug}`);
    return res.data.data;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    const res = await apiClient.post<ApiEnvelope<Category>>('/categories', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const res = await apiClient.put<ApiEnvelope<Category>>(`/categories/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};

export const brandService = {
  list: async (): Promise<Brand[]> => {
    const res = await apiClient.get<ApiEnvelope<Brand[]>>('/brands');
    return res.data.data;
  },

  getByIdOrSlug: async (idOrSlug: string): Promise<Brand> => {
    const res = await apiClient.get<ApiEnvelope<Brand>>(`/brands/${idOrSlug}`);
    return res.data.data;
  },

  create: async (data: Partial<Brand>): Promise<Brand> => {
    const res = await apiClient.post<ApiEnvelope<Brand>>('/brands', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Brand>): Promise<Brand> => {
    const res = await apiClient.put<ApiEnvelope<Brand>>(`/brands/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/brands/${id}`);
  },
};

export const collectionService = {
  list: async (): Promise<Collection[]> => {
    const res = await apiClient.get<ApiEnvelope<Collection[]>>('/collections');
    return res.data.data;
  },

  getByIdOrSlug: async (idOrSlug: string): Promise<Collection> => {
    const res = await apiClient.get<ApiEnvelope<Collection>>(`/collections/${idOrSlug}`);
    return res.data.data;
  },

  create: async (data: Partial<Collection>): Promise<Collection> => {
    const res = await apiClient.post<ApiEnvelope<Collection>>('/collections', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Collection>): Promise<Collection> => {
    const res = await apiClient.put<ApiEnvelope<Collection>>(`/collections/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/collections/${id}`);
  },
};

export const productService = {
  list: async (
    filters?: ProductQueryFilters,
  ): Promise<{ items: Product[]; meta: PaginatedMeta }> => {
    const params = new URLSearchParams();
    if (filters?.q) params.append('q', filters.q);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.brandId) params.append('brandId', filters.brandId);
    if (filters?.collectionId) params.append('collectionId', filters.collectionId);
    if (filters?.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
    if (filters?.status) params.append('status', filters.status);
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
    if (filters?.visibility) params.append('visibility', filters.visibility);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.sort) params.append('sort', filters.sort);

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';

    const res = await apiClient.get<ApiEnvelope<Product[]>>(url);
    const meta = (res.data as unknown as { meta?: PaginatedMeta }).meta || {
      total: res.data.data.length,
      page: filters?.page || 1,
      limit: filters?.limit || 12,
      totalPages: 1,
    };

    return {
      items: res.data.data,
      meta,
    };
  },

  getByIdOrSlug: async (idOrSlug: string): Promise<Product> => {
    const res = await apiClient.get<ApiEnvelope<Product>>(`/products/${idOrSlug}`);
    return res.data.data;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const res = await apiClient.post<ApiEnvelope<Product>>('/products', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const res = await apiClient.put<ApiEnvelope<Product>>(`/products/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  duplicate: async (product: Product): Promise<Product> => {
    const duplicateData: Partial<Product> = {
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY-${Date.now().toString().slice(-4)}`,
      shortDescription: product.shortDescription,
      description: product.description,
      categoryId: product.categoryId,
      brandId: product.brandId,
      collectionId: product.collectionId,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      status: 'DRAFT',
      visibility: product.visibility,
      featured: product.featured,
    };

    const res = await apiClient.post<ApiEnvelope<Product>>('/products', duplicateData);
    return res.data.data;
  },
};
