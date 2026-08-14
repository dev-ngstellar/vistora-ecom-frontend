'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/use-catalogue';
import { ProductCard } from '@/components/catalogue/product-card';
import { ProductGridSkeleton } from '@/components/catalogue/skeleton-loaders';
import { Search, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: productsData, isLoading } = useProducts({
    q: query || undefined,
    limit: 20,
  });

  const products = productsData?.items || [];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16 pt-3">
      {/* Search Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#A50025] text-xs font-bold uppercase tracking-wider mb-1">
            <Search className="w-4 h-4 text-[#A50025]" />
            <span>Search Results</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            {query ? (
              <>Results for <span className="text-[#A50025]">"{query}"</span></>
            ) : (
              'All Products'
            )}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {products.length > 0 && (
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FFF0F3] border border-[#A50025]/30 text-[#A50025] font-black text-xs">
              {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
            </span>
          )}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs font-extrabold text-[#111827] hover:text-[#A50025] hover:bg-[#FFF0F3] hover:border-[#A50025]/30 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Full Catalog</span>
          </Link>
        </div>
      </div>

      {/* Products Uniform Grid or Empty State */}
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs max-w-lg mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-[#FFF0F3] text-[#A50025] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#111827]">No matching products found</h2>
          <p className="text-xs text-[#64748B] font-medium leading-relaxed">
            We couldn't find anything matching "{query}". Try checking your spelling or searching for a broader term.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111827] hover:bg-[#A50025] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#E66001]" />
            <span>Browse Full Catalog</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
      <SearchResults />
    </Suspense>
  );
}
