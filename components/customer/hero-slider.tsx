'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBanners } from '@/hooks/use-content';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Skeleton } from 'antd';

export const HeroSlider: React.FC = () => {
  const { data: bannersData, isLoading } = useBanners({ position: 'HERO_SLIDER', isActive: true });
  const banners = bannersData?.banners || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (isLoading) {
    return (
      <div className="w-full h-[520px] rounded-3xl bg-slate-900 overflow-hidden flex items-center justify-center p-8">
        <Skeleton active paragraph={{ rows: 4 }} className="max-w-xl" />
      </div>
    );
  }

  const defaultBanner = {
    title: 'New Season Fashion Collection 2026',
    subtitle: 'Discover trending apparel, luxury footwear, and designer accessories.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop',
    buttonText: 'Shop New Arrivals',
    buttonLink: '/shop',
  };

  const current = banners.length > 0 ? banners[currentIndex] : defaultBanner;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-white my-3 shadow-md group h-[320px] sm:h-[380px] flex items-center">
      {/* Background Media */}
      <picture className="absolute inset-0 w-full h-full">
        {current.mobileImageUrl && (
          <source media="(max-width: 640px)" srcSet={current.mobileImageUrl} />
        )}
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full h-full object-cover opacity-70 group-hover:scale-102 transition-transform duration-700 ease-out"
        />
      </picture>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-orange text-white shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Special Offer • Up to 40% Off</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {current.title}
        </h1>

        {current.subtitle && (
          <p className="text-xs sm:text-sm text-slate-200 max-w-lg font-medium leading-relaxed line-clamp-2">
            {current.subtitle}
          </p>
        )}

        <div className="pt-1">
          <Link
            href={current.buttonLink || '/shop'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-maroon hover:bg-maroon-dark text-white font-bold text-xs shadow-md transition-all hover:gap-2.5"
          >
            <span>{current.buttonText || 'Shop Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            className="absolute left-4 z-20 p-3 rounded-full bg-slate-950/50 hover:bg-slate-950 text-white backdrop-blur-md border border-white/10 transition opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 z-20 p-3 rounded-full bg-slate-950/50 hover:bg-slate-950 text-white backdrop-blur-md border border-white/10 transition opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
