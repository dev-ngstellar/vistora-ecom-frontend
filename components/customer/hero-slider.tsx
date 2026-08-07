'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBanners } from '@/hooks/use-content';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Skeleton } from 'antd';

export const HeroSlider: React.FC = () => {
  const { data: bannersData, isLoading } = useBanners({ position: 'HERO_SLIDER', isActive: true });
  const dbBanners = bannersData?.banners || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackBanners = [
    {
      id: 'fb-1',
      title: 'Monochrome Tailored Suits & Runway Couture 2026',
      subtitle: 'Handcrafted Italian wool, silk gowns, and bespoke seasonal outerwear.',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop',
      mobileImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop',
      buttonText: 'Explore Collection',
      buttonLink: '/shop?category=women',
      badge: 'Haute Couture 2026',
    },
    {
      id: 'fb-2',
      title: 'Bespoke Executive Suits & Italian Craftsmanship',
      subtitle: 'Precision stitching engineered for timeless executive confidence and comfort.',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&auto=format&fit=crop',
      mobileImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
      buttonText: 'Shop Executive Wear',
      buttonLink: '/shop?category=men',
      badge: 'Bespoke Tailoring',
    },
    {
      id: 'fb-3',
      title: 'Swiss Timepieces & Designer Leather Accessories',
      subtitle: 'Refined craftsmanship designed to accent luxury wardrobes with perfection.',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&auto=format&fit=crop',
      mobileImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop',
      buttonText: 'Discover Accessories',
      buttonLink: '/shop?category=accessories',
      badge: 'Luxury Timepieces',
    },
  ];

  const banners = dbBanners.length > 0 ? dbBanners : fallbackBanners;

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] sm:h-[460px] rounded-3xl bg-slate-900 overflow-hidden flex items-center justify-center p-8 border border-slate-800">
        <Skeleton active paragraph={{ rows: 4 }} className="max-w-xl" />
      </div>
    );
  }

  const current = banners[currentIndex] || banners[0];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white my-4 shadow-xl group h-[360px] sm:h-[440px] lg:h-[480px] flex items-center border border-slate-800">
      {/* Background Media */}
      <picture className="absolute inset-0 w-full h-full">
        {current.mobileImageUrl && (
          <source media="(max-width: 640px)" srcSet={current.mobileImageUrl} />
        )}
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
      </picture>

      {/* Dynamic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

      {/* Content Box */}
      <div className="relative z-10 max-w-3xl px-6 sm:px-12 lg:px-16 py-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-maroon/90 text-white backdrop-blur-md border border-white/20 shadow-md">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>{(current as any).badge || 'Limited Edition Drop'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
          {current.title}
        </h1>

        {current.subtitle && (
          <p className="text-xs sm:text-base text-slate-200 max-w-xl font-medium leading-relaxed line-clamp-2 drop-shadow-xs">
            {current.subtitle}
          </p>
        )}

        <div className="pt-2 flex items-center gap-3">
          <Link
            href={current.buttonLink || '/shop'}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-maroon hover:bg-maroon-dark text-white font-black text-xs shadow-lg hover:shadow-maroon/30 transition-all hover:scale-102"
          >
            <span>{current.buttonText || 'Shop Collection'}</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </Link>
        </div>
      </div>

      {/* Slider Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            className="absolute left-4 z-20 p-3 rounded-full bg-slate-950/60 hover:bg-maroon text-white backdrop-blur-md border border-white/15 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 z-20 p-3 rounded-full bg-slate-950/60 hover:bg-maroon text-white backdrop-blur-md border border-white/15 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-10 bg-amber-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
