'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBrands, useCategories, useCollections, useProducts } from '@/hooks/use-catalogue';
import { ProductCard } from '@/components/catalogue/product-card';
import { FilterSidebar } from '@/components/catalogue/filter-sidebar';
import { CataloguePagination } from '@/components/catalogue/catalogue-pagination';
import { ProductGridSkeleton } from '@/components/catalogue/skeleton-loaders';
import { ProductQueryFilters } from '@/types/catalogue.types';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse filters from URL search params
  const [filters, setFilters] = useState<ProductQueryFilters>({
    q: searchParams.get('q') || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    brandId: searchParams.get('brandId') || undefined,
    collectionId: searchParams.get('collectionId') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
    sort: searchParams.get('sort') || 'created_at_desc',
  });

  const [searchInput, setSearchInput] = useState<string>(filters.q || '');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: collections } = useCollections();

  const { data: productsData, isLoading } = useProducts(filters);
  const products = productsData?.items || [];
  const meta = productsData?.meta || { total: 0, page: 1, limit: 12, totalPages: 1 };

  // Sync state changes to URL search params
  const handleFilterChange = (newFilters: Partial<ProductQueryFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    updateUrlParams(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange({ q: searchInput || undefined });
  };

  const handleClearFilters = () => {
    const cleared: ProductQueryFilters = { page: 1, limit: 12, sort: 'created_at_desc' };
    setSearchInput('');
    setFilters(cleared);
    updateUrlParams(cleared);
  };

  const updateUrlParams = (updatedFilters: ProductQueryFilters) => {
    const params = new URLSearchParams();
    if (updatedFilters.q) params.set('q', updatedFilters.q);
    if (updatedFilters.categoryId) params.set('categoryId', updatedFilters.categoryId);
    if (updatedFilters.brandId) params.set('brandId', updatedFilters.brandId);
    if (updatedFilters.collectionId) params.set('collectionId', updatedFilters.collectionId);
    if (updatedFilters.minPrice !== undefined) params.set('minPrice', String(updatedFilters.minPrice));
    if (updatedFilters.maxPrice !== undefined) params.set('maxPrice', String(updatedFilters.maxPrice));
    if (updatedFilters.sort) params.set('sort', updatedFilters.sort);
    if (updatedFilters.page && updatedFilters.page > 1) params.set('page', String(updatedFilters.page));

    const queryString = params.toString();
    router.push(queryString ? `/shop?${queryString}` : '/shop');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 to-slate-900 opacity-90" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
            Official Store Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Discover Luxury Essentials
          </h1>
          <p className="text-sm text-slate-300">
            Browse our full catalog of apparel, accessories, and seasonal footwear.
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            categories={categories}
            brands={brands}
            collections={collections}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products Listing Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by keyword or SKU..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    handleFilterChange({ q: undefined });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2 hover:bg-slate-200 transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-2 bg-slate-50">
                <ArrowUpDown className="w-4 h-4 text-slate-500" />
                <select
                  value={filters.sort || 'created_at_desc'}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="created_at_desc">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(filters.q || filters.categoryId || filters.brandId || filters.collectionId || filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active:</span>
              {filters.q && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  Query: {filters.q}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange({ q: undefined })} />
                </span>
              )}
              {filters.categoryId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  Category Selected
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange({ categoryId: undefined })} />
                </span>
              )}
              {filters.brandId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  Brand Selected
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange({ brandId: undefined })} />
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-red-600 hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid / Skeleton */}
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <p className="text-base font-bold text-slate-800">No products matched your criteria.</p>
              <p className="text-xs text-slate-500">Try adjusting your keyword query, price sliders, or category selections.</p>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-indigo-600 transition"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          <CataloguePagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(page) => handleFilterChange({ page })}
          />
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-xs bg-white h-full overflow-y-auto p-4">
            <FilterSidebar
              categories={categories}
              brands={brands}
              collections={collections}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
