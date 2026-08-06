'use client';

import React from 'react';
import Link from 'next/link';
import { useCategories, useProducts } from '@/hooks/use-catalogue';
import { ProductCard } from '@/components/catalogue/product-card';
import { CategoryCard } from '@/components/catalogue/category-card';
import { HeroSlider } from '@/components/customer/hero-slider';
import { DealsOfTheDay } from '@/components/customer/deals-of-the-day';
import { PromoBanner } from '@/components/customer/promo-banner';
import { NewsletterSection } from '@/components/customer/newsletter-section';
import {
  CategoryGridSkeleton,
  ProductGridSkeleton,
} from '@/components/catalogue/skeleton-loaders';
import { ArrowRight, Sparkles, Layers, Flame, ShoppingBag, Zap } from 'lucide-react';

export default function HomePage() {
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: featuredData, isLoading: loadingFeatured } = useProducts({
    featured: true,
    limit: 8,
  });
  const { data: trendingData, isLoading: loadingTrending } = useProducts({
    limit: 4,
  });
  const { data: newArrivalsData, isLoading: loadingNewArrivals } = useProducts({
    limit: 8,
  });

  const featuredProducts = featuredData?.items || [];
  const trendingProducts = trendingData?.items || [];
  const newArrivals = newArrivalsData?.items || [];

  return (
    <div className="space-y-6 sm:space-y-10 pb-16">
      {/* 2. HERO SLIDER */}
      <HeroSlider />

      {/* 3. CATEGORIES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-maroon text-xs font-extrabold uppercase tracking-wider mb-0.5">
              <Layers className="w-3.5 h-3.5 text-orange" />
              <span>Explore Departments</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-maroon hover:text-orange flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingCategories ? (
          <CategoryGridSkeleton count={4} />
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 text-center text-slate-500 text-xs">
            No categories available at the moment.
          </div>
        )}
      </section>

      {/* 4. DEALS OF THE DAY */}
      <DealsOfTheDay />

      {/* 5. FEATURED PRODUCTS (RESPONSIVE 4/3/2 GRID) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-maroon text-xs font-extrabold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-orange" />
              <span>Top Picks</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-maroon hover:text-orange flex items-center gap-1 transition"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingFeatured ? (
          <ProductGridSkeleton count={8} />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-50 text-center text-slate-500 text-xs space-y-2">
            <p>No featured products found.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-maroon text-white text-xs font-bold hover:bg-maroon-dark transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Catalog</span>
            </Link>
          </div>
        )}
      </section>

      {/* 6. PROMOTIONAL BANNER */}
      <PromoBanner />

      {/* 7. TRENDING PRODUCTS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-orange text-xs font-extrabold uppercase tracking-wider mb-0.5">
              <Flame className="w-3.5 h-3.5 text-orange" />
              <span>Most Popular</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Trending Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-maroon hover:text-orange flex items-center gap-1 transition"
          >
            <span>View Trending</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingTrending ? (
          <ProductGridSkeleton count={4} />
        ) : trendingProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {trendingProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-50 text-center text-slate-500 text-xs">
            No trending products flagged yet.
          </div>
        )}
      </section>

      {/* 8. NEW ARRIVALS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-maroon text-xs font-extrabold uppercase tracking-wider mb-0.5">
              <Zap className="w-3.5 h-3.5 text-orange" />
              <span>Fresh Catalog</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-maroon hover:text-orange flex items-center gap-1 transition"
          >
            <span>Browse New</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingNewArrivals ? (
          <ProductGridSkeleton count={8} />
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-50 text-center text-slate-500 text-xs space-y-2">
            <p>No new arrivals found.</p>
          </div>
        )}
      </section>

      {/* 9. NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}
