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

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: collections } = useCollections();

  const [filters, setFilters] = useState<ProductQueryFilters>({
    q: searchParams.get('q') || undefined,
    categoryId: undefined,
    brandId: searchParams.get('brandId') || undefined,
    collectionId: searchParams.get('collectionId') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    featured: searchParams.get('featured') === 'true' || searchParams.get('onSale') === 'true' ? true : undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
    sort: searchParams.get('sort') || 'created_at_desc',
  });

  const [searchInput, setSearchInput] = useState<string>(filters.q || '');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Re-sync filters from URL searchParams dynamically on navigation
  useEffect(() => {
    const catVal = searchParams.get('category') || searchParams.get('categoryId');
    const featuredVal = searchParams.get('featured') || searchParams.get('onSale') || searchParams.get('deals');
    const brandVal = searchParams.get('brandId');
    const collectionVal = searchParams.get('collectionId');
    const qVal = searchParams.get('q');
    const minVal = searchParams.get('minPrice');
    const maxVal = searchParams.get('maxPrice');
    const sortVal = searchParams.get('sort') || 'created_at_desc';
    const pageVal = searchParams.get('page');

    let matchedCatId: string | undefined = undefined;
    if (catVal) {
      if (categories && categories.length > 0) {
        const matched = categories.find((c) => c.id === catVal || c.slug === catVal);
        matchedCatId = matched ? matched.id : catVal;
      } else {
        matchedCatId = catVal;
      }
    }

    setFilters({
      q: qVal || undefined,
      categoryId: matchedCatId,
      brandId: brandVal || undefined,
      collectionId: collectionVal || undefined,
      minPrice: minVal ? Number(minVal) : undefined,
      maxPrice: maxVal ? Number(maxVal) : undefined,
      featured: featuredVal === 'true' ? true : undefined,
      page: pageVal ? Number(pageVal) : 1,
      limit: 12,
      sort: sortVal,
    });
    if (qVal !== searchInput) {
      setSearchInput(qVal || '');
    }
  }, [searchParams, categories]);

  const { data: productsData, isLoading } = useProducts(filters);
  const products = productsData?.items || [];
  const meta = productsData?.meta || { total: 0, page: 1, limit: 12, totalPages: 1 };

  // Sync state changes to URL search params
  const handleFilterChange = (newFilters: Partial<ProductQueryFilters>) => {
    const targetPage = newFilters.page !== undefined ? newFilters.page : 1;
    const updated = { ...filters, ...newFilters, page: targetPage };
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
    if (updatedFilters.categoryId) {
      const cat = categories?.find((c) => c.id === updatedFilters.categoryId);
      params.set('category', cat?.slug || updatedFilters.categoryId);
    }
    if (updatedFilters.brandId) params.set('brandId', updatedFilters.brandId);
    if (updatedFilters.collectionId) params.set('collectionId', updatedFilters.collectionId);
    if (updatedFilters.minPrice !== undefined) params.set('minPrice', String(updatedFilters.minPrice));
    if (updatedFilters.maxPrice !== undefined) params.set('maxPrice', String(updatedFilters.maxPrice));
    if (updatedFilters.featured) params.set('featured', 'true');
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider text-amber-300">
            <span>✨ VISTORA CURATED CATALOGUE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Discover Signature Beauty & Luxury.
          </h1>

          <p className="text-sm text-slate-300 font-normal leading-relaxed">
            Explore our handcrafted luxury lipsticks, herbal kajals, under eye treatments, and authentic South Indian silk sarees.
          </p>
        </div>
      </div>

      {/* Main Two-Column Shop Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Desktop Sidebar Filter / Mobile Drawer */}
        <div className="hidden lg:block">
          <FilterSidebar
            categories={categories || []}
            brands={brands || []}
            collections={collections || []}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Right Content Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Control Bar */}
          <div className="bg-white rounded-[16px] p-4 border border-[#ECECEC] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input Bar inside Shop */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A50025] focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Sorting Selector */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={filters.sort || 'created_at_desc'}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A50025]"
                >
                  <option value="created_at_desc">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Tags Bar */}
          {(filters.categoryId || filters.brandId || filters.collectionId || filters.q || filters.featured) && (
            <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-500">Active Filters:</span>
              
              {filters.q && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-300 font-semibold text-slate-800">
                  Search: "{filters.q}"
                  <X className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => handleFilterChange({ q: undefined })} />
                </span>
              )}

              {filters.categoryId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-300 font-semibold text-slate-800">
                  Category: {categories?.find(c => c.id === filters.categoryId)?.name}
                  <X className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => handleFilterChange({ categoryId: undefined })} />
                </span>
              )}

              {filters.featured && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E66001] text-white font-semibold">
                  Featured Deals
                  <X className="w-3.5 h-3.5 cursor-pointer text-white/80 hover:text-white" onClick={() => handleFilterChange({ featured: undefined })} />
                </span>
              )}

              <button
                onClick={handleClearFilters}
                className="text-[#A50025] font-extrabold hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <ProductGridSkeleton />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 bg-white rounded-[20px] border border-[#ECECEC]">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your filter criteria. Try clearing some filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 rounded-xl bg-[#A50025] text-white font-bold text-xs hover:bg-[#7D001C] transition"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && meta.totalPages > 1 && (
            <div className="pt-6">
              <CataloguePagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={(page) => handleFilterChange({ page })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-base text-slate-900">Filter Catalogue</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              categories={categories || []}
              brands={brands || []}
              collections={collections || []}
              filters={filters}
              onFilterChange={(f) => {
                handleFilterChange(f);
                setIsMobileFilterOpen(false);
              }}
              onClearFilters={() => {
                handleClearFilters();
                setIsMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
