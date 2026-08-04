'use client';

import React from 'react';
import Link from 'next/link';
import { useCategories, useProducts } from '@/platform/hooks';
import { MinimalHeader } from '../components/minimal-header';
import { MinimalFooter } from '../components/minimal-footer';
import { MinimalHero } from '../components/minimal-hero';
import { MinimalProductCard } from '../components/minimal-product-card';
import { MinimalCategoryCard } from '../components/minimal-category-card';
import { ArrowRight } from 'lucide-react';

export const MinimalHomePage: React.FC = () => {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: productsData, isLoading: loadingProducts } = useProducts({ limit: 8 });

  const products = productsData?.items || [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
      <MinimalHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16 pb-20">
        {/* Minimal Hero */}
        <MinimalHero />

        {/* Featured Departments */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Departments</h2>
            <Link href="/shop" className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingCategories ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading departments...</div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((cat) => (
                <MinimalCategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          ) : null}
        </section>

        {/* Catalog Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Catalogue Selection</h2>
            <Link href="/shop" className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1">
              <span>Browse All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading products...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <MinimalProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">No items available in catalog.</div>
          )}
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
};
