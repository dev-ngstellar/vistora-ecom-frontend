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
    title: 'Haute Couture Autumn Collection 2026',
    subtitle: 'Discover hand-crafted Italian silk gowns and bespoke cashmere outerwear.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop',
    buttonText: 'Explore Collection',
    buttonLink: '/shop',
  };

  const current = banners.length > 0 ? banners[currentIndex] : defaultBanner;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white my-4 shadow-2xl group min-h-[520px] flex items-center">
      {/* Background Media */}
      <picture className="absolute inset-0 w-full h-full">
        {current.mobileImageUrl && (
          <source media="(max-width: 640px)" srcSet={current.mobileImageUrl} />
        )}
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full h-full object-cover opacity-75 scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
        />
      </picture>

      {/* Dark Luxury Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />

      {/* Editorial Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-white/20 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Exclusive Editorial Showcase</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-white leading-tight font-light">
          {current.title}
        </h1>

        {current.subtitle && (
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
            {current.subtitle}
          </p>
        )}

        <div className="pt-2">
          <Link
            href={current.buttonLink || '/shop'}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-slate-950 font-extrabold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl hover:gap-3"
          >
            <span>{current.buttonText || 'Discover Now'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
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
