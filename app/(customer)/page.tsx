'use client';

import React from 'react';
import Link from 'next/link';
import { useCategories, useCollections, useProducts } from '@/hooks/use-catalogue';
import { ProductCard } from '@/components/catalogue/product-card';
import { CategoryCard } from '@/components/catalogue/category-card';
import { CollectionCard } from '@/components/catalogue/collection-card';
import { HeroSlider } from '@/components/customer/hero-slider';
import { PromoBanner } from '@/components/customer/promo-banner';
import { BrandStory } from '@/components/customer/brand-story';
import { TestimonialsSection } from '@/components/customer/testimonials-section';
import { NewsletterSection } from '@/components/customer/newsletter-section';
import { InstagramGrid } from '@/components/customer/instagram-grid';
import {
  CategoryGridSkeleton,
  ProductGridSkeleton,
} from '@/components/catalogue/skeleton-loaders';
import { ArrowRight, Sparkles, Layers, Flame, Tag } from 'lucide-react';

export default function HomePage() {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: collections } = useCollections();
  const { data: newArrivalsData, isLoading: loadingNewArrivals } = useProducts({
    limit: 8,
  });
  const { data: trendingData, isLoading: loadingTrending } = useProducts({
    featured: true,
    limit: 4,
  });

  const newArrivals = newArrivalsData?.items || [];
  const trendingProducts = trendingData?.items || [];

  return (
    <div className="space-y-16 pb-20">
      {/* SECTION 3 — HERO EDITORIAL SLIDER BANNER */}
      <HeroSlider />

      {/* SECTION 4 — FEATURED CATEGORIES GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
              <Layers className="w-4 h-4" />
              <span>Curated Departments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-900 dark:text-white tracking-tight">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white hover:text-indigo-600 flex items-center gap-1.5 transition"
          >
            <span>Explore All Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingCategories ? (
          <CategoryGridSkeleton count={4} />
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-900 text-center text-slate-500 text-xs">
            No categories available at the moment.
          </div>
        )}
      </section>

      {/* SECTION 5 — NEW ARRIVALS PRODUCT GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Runway Arrivals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-900 dark:text-white tracking-tight">
              New Arrivals Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white hover:text-indigo-600 flex items-center gap-1.5 transition"
          >
            <span>View New Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingNewArrivals ? (
          <ProductGridSkeleton count={8} />
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-900 text-center text-slate-500 text-xs space-y-3">
            <p>No new arrivals found.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold"
            >
              Browse Full Shop Catalog
            </Link>
          </div>
        )}
      </section>

      {/* SECTION 6 — EDITORIAL PROMOTION BANNER */}
      <PromoBanner />

      {/* SECTION 7 — TRENDING COUTURE PRODUCTS GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>High Fashion Spotlight</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-900 dark:text-white tracking-tight">
              Trending Couture
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white hover:text-indigo-600 flex items-center gap-1.5 transition"
          >
            <span>View Trending</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingTrending ? (
          <ProductGridSkeleton count={4} />
        ) : trendingProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-900 text-center text-slate-500 text-xs">
            No trending items flagged yet.
          </div>
        )}
      </section>

      {/* SECTION 8 — FEATURED COLLECTIONS */}
      {collections && collections.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Tag className="w-4 h-4" />
            <span>Seasonal Runway</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-900 dark:text-white tracking-tight">
            Featured Lookbook Collections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.slice(0, 2).map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 9 — FEATURED BRAND HERITAGE STORY */}
      <BrandStory />

      {/* SECTION 10 — CUSTOMER TESTIMONIALS SHOWCASE */}
      <TestimonialsSection />

      {/* SECTION 11 — NEWSLETTER GAZETTE SUBSCRIPTION */}
      <NewsletterSection />

      {/* SECTION 12 — INSTAGRAM HIGH-FASHION GALLERY GRID */}
      <InstagramGrid />
    </div>
  );
}
