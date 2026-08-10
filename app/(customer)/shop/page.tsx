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

  const categoryParam = searchParams.get('category') || searchParams.get('categoryId');

  const [filters, setFilters] = useState<ProductQueryFilters>({
    q: searchParams.get('q') || undefined,
    categoryId: undefined,
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

  // Resolve category slug or ID from URL searchParams
  useEffect(() => {
    if (categoryParam && categories && categories.length > 0) {
      const matched = categories.find(
        (c) => c.id === categoryParam || c.slug === categoryParam
      );
      if (matched && filters.categoryId !== matched.id) {
        setFilters((prev) => ({ ...prev, categoryId: matched.id }));
      }
    } else if (!categoryParam && filters.categoryId) {
      setFilters((prev) => ({ ...prev, categoryId: undefined }));
    }
  }, [categoryParam, categories]);

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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20 pt-4">
      {/* Editorial Luxury Collection Hero Banner */}
      <div className="relative rounded-[20px] overflow-hidden shadow-xl min-h-[300px] sm:min-h-[360px] flex items-center p-8 sm:p-14 border border-[#ECECEC] group">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80')` }} />
        {/* Dark Luxury Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/95 via-[#111827]/80 to-transparent" />

        {/* Content */}
        <div className="relative z-10 space-y-4 max-w-xl text-white">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-[#B5123B] text-white shadow-xs">
            Official Store Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover Luxury Essentials
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            Explore our curated catalog of high-end apparel, fine timepieces, and hand-crafted seasonal leather goods.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleFilterChange({ sort: 'created_at_desc' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-[#B5123B] hover:bg-[#8E0E2E] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-102"
            >
              <span>Explore New Arrivals</span>
            </button>
          </div>
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
        <div className="lg:col-span-3 space-y-8">
          {/* Controls Bar: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-[20px] border border-[#ECECEC] shadow-xs">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search products by keyword or SKU..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-[14px] text-xs bg-[#FAFAFA] border border-[#ECECEC] focus:outline-none focus:border-[#B5123B] focus:ring-2 focus:ring-[#B5123B]/10 text-[#111111] font-bold"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    handleFilterChange({ q: undefined });
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111111]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-4 py-3 rounded-[14px] bg-[#FAFAFA] border border-[#ECECEC] text-[#111111] text-xs font-extrabold flex items-center gap-2 hover:bg-slate-100 transition"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#B5123B]" />
                <span>Filters</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 border border-[#ECECEC] rounded-[14px] px-3.5 py-2.5 bg-[#FAFAFA]">
                <ArrowUpDown className="w-4 h-4 text-[#B5123B]" />
                <select
                  value={filters.sort || 'created_at_desc'}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="bg-transparent text-xs font-extrabold text-[#111111] focus:outline-none cursor-pointer"
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
            <div className="flex flex-wrap items-center gap-2.5 bg-white p-3.5 rounded-[16px] border border-[#ECECEC]">
              <span className="text-xs font-extrabold text-[#6B7280] uppercase tracking-wider">Active Filters:</span>
              {filters.q && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDF2F5] text-[#B5123B] border border-[#B5123B]/20">
                  Query: {filters.q}
                  <X className="w-3.5 h-3.5 cursor-pointer hover:scale-110" onClick={() => handleFilterChange({ q: undefined })} />
                </span>
              )}
              {filters.categoryId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDF2F5] text-[#B5123B] border border-[#B5123B]/20">
                  Category Filter
                  <X className="w-3.5 h-3.5 cursor-pointer hover:scale-110" onClick={() => handleFilterChange({ categoryId: undefined })} />
                </span>
              )}
              {filters.brandId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDF2F5] text-[#B5123B] border border-[#B5123B]/20">
                  Brand Filter
                  <X className="w-3.5 h-3.5 cursor-pointer hover:scale-110" onClick={() => handleFilterChange({ brandId: undefined })} />
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs font-extrabold text-rose-600 hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid (4 cols desktop, 3 cols tablet, 2 cols mobile, 32px gaps) */}
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[20px] p-12 text-center border border-[#ECECEC] space-y-4">
              <p className="text-base font-extrabold text-[#111111]">No products matched your criteria.</p>
              <p className="text-xs text-[#6B7280]">Try adjusting your keyword query, price sliders, or category selections.</p>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-[#111827] text-white text-xs font-bold hover:bg-[#B5123B] transition-all duration-300 shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-[#111827]/70 backdrop-blur-xs flex justify-end lg:hidden">
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
