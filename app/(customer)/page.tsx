'use client';

import React from 'react';
import Link from 'next/link';
import { useCategories, useProducts } from '@/hooks/use-catalogue';
import { ProductCard } from '@/components/catalogue/product-card';
import { HeroSlider } from '@/components/customer/hero-slider';
import { CategoryBento } from '@/components/customer/category-bento';
import { HealthGoalsSection } from '@/components/customer/health-goals-section';
import { DealsOfTheDay } from '@/components/customer/deals-of-the-day';
import { CollectionsSection } from '@/components/customer/collections-section';
import { PromoBanner } from '@/components/customer/promo-banner';
import { TrustSection } from '@/components/customer/trust-section';
import { TestimonialsSection } from '@/components/customer/testimonials-section';
import { NewsletterSection } from '@/components/customer/newsletter-section';
import { ProductGridSkeleton } from '@/components/catalogue/skeleton-loaders';
import { Flame, Sparkles, Heart } from 'lucide-react';

export default function HomePage() {
  const { data: categories, isLoading: loadingCategories } = useCategories();

  // Fetch up to 12 products to distribute across non-repeating merchandising grids
  const { data: productsData, isLoading: loadingProducts } = useProducts({
    limit: 12,
  });

  const allProducts = productsData?.items || [];

  // Partition products into unique sets
  const dealsProducts = allProducts.slice(0, 4);
  const trendingProducts = allProducts.slice(4, 8);
  const favouritesProducts = allProducts.slice(8, 12);

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HERO CAMPAIGN (3-Pillar Sensory Slider) */}
      <HeroSlider />

      {/* 2. POWERHOUSE BENTO CATEGORIES */}
      <CategoryBento />

      {/* 3. SHOP BY HEALTH GOAL & DIETARY PURPOSE */}
      <HealthGoalsSection />

      {/* 4. FRESH HARVEST DEALS OF THE DAY */}
      <DealsOfTheDay products={dealsProducts} isLoading={loadingProducts} />

      {/* 5. ARTISANAL KITCHEN ESSENTIALS & COMBO BUNDLES */}
      <CollectionsSection />

      {/* 6. TRENDING BESTSELLERS */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3.5">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#E66001] flex items-center gap-1.5 mb-0.5">
              <Flame className="w-3.5 h-3.5 fill-[#E66001]" />
              Most Popular In Kitchens
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#111827] tracking-tight">
              Trending Right Now
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs font-black text-[#A50025] hover:text-[#E66001] flex items-center gap-1 transition"
          >
            <span>View Trending →</span>
          </Link>
        </div>

        {loadingProducts ? (
          <ProductGridSkeleton count={4} />
        ) : trendingProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {trendingProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#64748B] bg-[#FAF7F2] rounded-2xl border border-[#E7E0D6]">
            Check out our complete catalogue in the shop section.
          </div>
        )}
      </section>

      {/* 7. PROMOTIONAL / FARM HARVEST BANNER */}
      <PromoBanner />

      {/* 8. THE VISTORA PURITY PROMISE (Artisanal 4-Step Process) */}
      <TrustSection />

      {/* 9. TOP RATED CUSTOMER PICKS */}
      {favouritesProducts.length > 0 && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3.5">
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
              className="text-xs font-black text-[#A50025] hover:text-[#E66001] flex items-center gap-1 transition"
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

      {/* 10. VERIFIED CUSTOMER REVIEWS */}
      <TestimonialsSection />

      {/* 11. NEWSLETTER & FRESH BATCH ALERTS */}
      <NewsletterSection />
    </div>
  );
}
