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

  const sampleProducts = [
    {
      id: 'sample-1',
      name: 'Monochrome Tailored Double-Breasted Suit',
      slug: 'monochrome-tailored-double-breasted-suit',
      price: 45900,
      compareAtPrice: 58000,
      featured: true,
      status: 'ACTIVE',
      category: { name: "Men's Tailoring" },
      images: [{ imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop', isPrimary: true }],
    },
    {
      id: 'sample-2',
      name: 'Double-Breasted Wool Trench Coat',
      slug: 'double-breasted-wool-trench-coat',
      price: 32500,
      compareAtPrice: 42000,
      featured: true,
      status: 'ACTIVE',
      category: { name: "Women's Outerwear" },
      images: [{ imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop', isPrimary: true }],
    },
    {
      id: 'sample-3',
      name: 'Swiss Chronograph Automatic Watch',
      slug: 'swiss-chronograph-automatic-watch',
      price: 89000,
      compareAtPrice: 110000,
      featured: true,
      status: 'ACTIVE',
      category: { name: 'Luxury Timepieces' },
      images: [{ imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&auto=format&fit=crop', isPrimary: true }],
    },
    {
      id: 'sample-4',
      name: 'Florentine Leather Structured Tote',
      slug: 'florentine-leather-structured-tote',
      price: 28900,
      compareAtPrice: 36000,
      featured: true,
      status: 'ACTIVE',
      category: { name: 'Leather Goods' },
      images: [{ imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&auto=format&fit=crop', isPrimary: true }],
    },
  ];

  const featuredProducts = (featuredData?.items && featuredData.items.length > 0) ? featuredData.items : sampleProducts as any[];
  const trendingProducts = (trendingData?.items && trendingData.items.length > 0) ? trendingData.items : sampleProducts as any[];
  const newArrivals = (newArrivalsData?.items && newArrivalsData.items.length > 0) ? newArrivalsData.items : sampleProducts as any[];

  return (
    <div className="space-y-8 sm:space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 2. HERO SLIDER */}
      <HeroSlider />

      {/* 3. CATEGORIES */}
      <section className="space-y-4 pt-2">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2 text-maroon text-xs font-black uppercase tracking-widest mb-1">
              <Layers className="w-4 h-4 text-orange" />
              <span>Explore Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-black text-maroon hover:text-orange flex items-center gap-1.5 transition hover:translate-x-0.5"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingCategories ? (
          <CategoryGridSkeleton count={4} />
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-50 text-center text-slate-500 text-xs font-bold border border-slate-200/80">
            No categories available at the moment.
          </div>
        )}
      </section>

      {/* 4. DEALS OF THE DAY */}
      <DealsOfTheDay />

      {/* 5. FEATURED PRODUCTS (RESPONSIVE 4/3/2 GRID) */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2 text-maroon text-xs font-black uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-orange" />
              <span>Handpicked Top Picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-black text-maroon hover:text-orange flex items-center gap-1.5 transition hover:translate-x-0.5"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingFeatured ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 6. PROMOTIONAL BANNER */}
      <PromoBanner />

      {/* 7. TRENDING PRODUCTS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2 text-orange text-xs font-black uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4 text-orange fill-orange" />
              <span>Most Popular</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trending Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-black text-maroon hover:text-orange flex items-center gap-1.5 transition hover:translate-x-0.5"
          >
            <span>View Trending Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingTrending ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 8. NEW ARRIVALS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2 text-maroon text-xs font-black uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4 text-orange fill-orange" />
              <span>Fresh Catalog Drop</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-black text-maroon hover:text-orange flex items-center gap-1.5 transition hover:translate-x-0.5"
          >
            <span>Browse New Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingNewArrivals ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 9. NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}
