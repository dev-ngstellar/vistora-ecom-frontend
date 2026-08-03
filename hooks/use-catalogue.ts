'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  categoryService,
  brandService,
  collectionService,
  productService,
} from '@/services/catalogue.service';
import {
  Brand,
  Category,
  CategoryTreeItem,
  Collection,
  Product,
  ProductQueryFilters,
} from '@/types/catalogue.types';

// ==================== CATEGORIES HOOKS ====================
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  });
};

export const useCategoryTree = () => {
  return useQuery<CategoryTreeItem[]>({
    queryKey: ['categories', 'tree'],
    queryFn: () => categoryService.getTree(),
  });
};

export const useCategory = (idOrSlug: string) => {
  return useQuery<Category>({
    queryKey: ['category', idOrSlug],
    queryFn: () => categoryService.getByIdOrSlug(idOrSlug),
    enabled: !!idOrSlug,
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: (data: Partial<Category>) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create category');
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update category');
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete category');
    },
  });

  return { createCategory, updateCategory, deleteCategory };
};

// ==================== BRANDS HOOKS ====================
export const useBrands = () => {
  return useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: () => brandService.list(),
  });
};

export const useBrand = (idOrSlug: string) => {
  return useQuery<Brand>({
    queryKey: ['brand', idOrSlug],
    queryFn: () => brandService.getByIdOrSlug(idOrSlug),
    enabled: !!idOrSlug,
  });
};

export const useBrandMutations = () => {
  const queryClient = useQueryClient();

  const createBrand = useMutation({
    mutationFn: (data: Partial<Brand>) => brandService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand created successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create brand');
    },
  });

  const updateBrand = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brand> }) =>
      brandService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand updated successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update brand');
    },
  });

  const deleteBrand = useMutation({
    mutationFn: (id: string) => brandService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand deleted successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete brand');
    },
  });

  return { createBrand, updateBrand, deleteBrand };
};

// ==================== COLLECTIONS HOOKS ====================
export const useCollections = () => {
  return useQuery<Collection[]>({
    queryKey: ['collections'],
    queryFn: () => collectionService.list(),
  });
};

export const useCollection = (idOrSlug: string) => {
  return useQuery<Collection>({
    queryKey: ['collection', idOrSlug],
    queryFn: () => collectionService.getByIdOrSlug(idOrSlug),
    enabled: !!idOrSlug,
  });
};

export const useCollectionMutations = () => {
  const queryClient = useQueryClient();

  const createCollection = useMutation({
    mutationFn: (data: Partial<Collection>) => collectionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection created successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create collection');
    },
  });

  const updateCollection = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Collection> }) =>
      collectionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection updated successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update collection');
    },
  });

  const deleteCollection = useMutation({
    mutationFn: (id: string) => collectionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection deleted successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete collection');
    },
  });

  return { createCollection, updateCollection, deleteCollection };
};

// ==================== PRODUCTS HOOKS ====================
export const useProducts = (filters?: ProductQueryFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.list(filters),
  });
};

export const useProduct = (idOrSlug: string) => {
  return useQuery<Product>({
    queryKey: ['product', idOrSlug],
    queryFn: () => productService.getByIdOrSlug(idOrSlug),
    enabled: !!idOrSlug,
  });
};

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: (data: Partial<Product>) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create product');
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update product');
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete product');
    },
  });

  const duplicateProduct = useMutation({
    mutationFn: (product: Product) => productService.duplicate(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product duplicated successfully as Draft');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to duplicate product');
    },
  });

  return { createProduct, updateProduct, deleteProduct, duplicateProduct };
};
