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
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
            <Link href="/" className="hover:text-maroon">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Search</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {query ? (
              <>Search results for <span className="text-maroon">"{query}"</span></>
            ) : (
              'All Products'
            )}
          </h1>
        </div>

        {products.length > 0 && (
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-maroon-light text-maroon font-bold text-xs">
            {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
          </span>
        )}
      </div>

      {/* Grid or Empty */}
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No matching products found</h2>
          <p className="text-sm text-slate-500">
            We couldn't find anything matching "{query}". Try checking your spelling or searching for a broader term.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-maroon text-white font-bold text-xs uppercase tracking-wider transition hover:bg-maroon-dark shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Full Shop Catalog
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
