'use client';

import React from 'react';
import Link from 'next/link';
import { useCategories, useProducts } from '@/hooks/use-catalogue';
import { ProductCard } from '@/components/catalogue/product-card';
import { CategoryCard } from '@/components/catalogue/category-card';
import { HeroSlider } from '@/components/customer/hero-slider';
import { DealsOfTheDay } from '@/components/customer/deals-of-the-day';
import { CollectionsSection } from '@/components/customer/collections-section';
import { PromoBanner } from '@/components/customer/promo-banner';
import { TrustSection } from '@/components/customer/trust-section';
import { TestimonialsSection } from '@/components/customer/testimonials-section';
import { NewsletterSection } from '@/components/customer/newsletter-section';
import {
  CategoryGridSkeleton,
  ProductGridSkeleton,
} from '@/components/catalogue/skeleton-loaders';
import { ArrowRight, Flame, Sparkles, Heart } from 'lucide-react';

export default function HomePage() {
  const { data: categories, isLoading: loadingCategories } = useCategories();

  // Fetch up to 12 products to distribute across non-repeating merchandising grids
  const { data: productsData, isLoading: loadingProducts } = useProducts({
    limit: 12,
  });

  const allProducts = productsData?.items || [];

  // Enforce Anti-Repetition Rule: Partition products into unique sets
  const dealsProducts = allProducts.slice(0, 4);
  const trendingProducts = allProducts.slice(4, 8);
  const favouritesProducts = allProducts.slice(8, 12);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 3. HERO CAMPAIGN */}
      <HeroSlider />

      {/* 4. SHOP BY CATEGORY */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#A50025] flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E66001]" />
              Explore Departments
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#111827] tracking-tight">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-extrabold text-[#A50025] hover:text-[#E66001] flex items-center gap-1 transition"
          >
            <span>View All →</span>
          </Link>
        </div>

        {loadingCategories ? (
          <CategoryGridSkeleton count={5} />
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-1">
            {categories.slice(0, 5).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#F7F8FA] text-center text-[#64748B] text-xs font-bold border border-[#E5E7EB]">
            No categories available at the moment.
          </div>
        )}
      </section>

      {/* 5. DEALS OF THE DAY */}
      <DealsOfTheDay products={dealsProducts} isLoading={loadingProducts} />

      {/* 6. EXPLORE OUR COLLECTIONS */}
      <CollectionsSection />

      {/* 7. TRENDING RIGHT NOW */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#E66001] flex items-center gap-1.5 mb-0.5">
              <Flame className="w-3.5 h-3.5 fill-[#E66001]" />
              Most Popular
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#111827] tracking-tight">
              Trending Right Now
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs font-extrabold text-[#A50025] hover:text-[#E66001] flex items-center gap-1 transition"
          >
            <span>View Trending →</span>
          </Link>
        </div>

        {loadingProducts ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {trendingProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 8. PROMOTIONAL / BRAND STORY BANNER */}
      <PromoBanner />

      {/* 9. WHY SHOP WITH VISTORA */}
      <TrustSection />

      {/* 10. CUSTOMER FAVOURITES */}
      {favouritesProducts.length > 0 && (
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#A50025] flex items-center gap-1.5 mb-0.5">
                <Heart className="w-3.5 h-3.5 text-[#A50025] fill-[#A50025]" />
                Top Rated Picks
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-[#111827] tracking-tight">
                Customer Favourites
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-extrabold text-[#A50025] hover:text-[#E66001] flex items-center gap-1 transition"
            >
              <span>View All →</span>
            </Link>
          </div>

          {loadingProducts ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {favouritesProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 11. CUSTOMER REVIEWS */}
      <TestimonialsSection />

      {/* 12. COMPACT NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}
