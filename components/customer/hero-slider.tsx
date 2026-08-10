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
      title: 'Discover Vistora',
      subtitle: 'One destination. Endless choices across beauty, cosmetics, and handloom couture.',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&auto=format&fit=crop&q=80',
      mobileImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      badge: 'Vistora Marketplace',
    },
    {
      id: 'fb-2',
      title: 'Celebrate Indian Handloom',
      subtitle: 'Discover traditional South Indian sarees, zari borders, and handcrafted collections.',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&auto=format&fit=crop&q=80',
      mobileImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      buttonText: 'Explore Handlooms',
      buttonLink: '/shop?category=sarees-handloom',
      badge: 'Handcrafted Heritage',
    },
    {
      id: 'fb-3',
      title: 'Beauty Essentials',
      subtitle: 'Rich lip colors, Ayurvedic kajal, under-eye care, and non-sticky lip glosses.',
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1920&auto=format&fit=crop&q=80',
      mobileImageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
      buttonText: 'Shop Beauty',
      buttonLink: '/shop?category=lipsticks',
      badge: 'Botanical & Beauty',
    },
  ];

  const banners = fallbackBanners; // Prefer clean Vistora catalog banners

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (isLoading) {
    return (
      <div className="w-full h-[320px] sm:h-[380px] rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center p-8 border border-slate-800">
        <Skeleton active paragraph={{ rows: 3 }} className="max-w-xl" />
      </div>
    );
  }

  const current = banners[currentIndex] || banners[0];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#111827] text-white my-3 shadow-md group h-[320px] sm:h-[380px] lg:h-[420px] flex items-center border border-[#E5E7EB]">
      {/* Background Media */}
      <picture className="absolute inset-0 w-full h-full">
        {current.mobileImageUrl && (
          <source media="(max-width: 640px)" srcSet={current.mobileImageUrl} />
        )}
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </picture>

      {/* Dynamic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/95 via-[#111827]/75 to-transparent" />

      {/* Content Box */}
      <div className="relative z-10 max-w-2xl px-6 sm:px-12 lg:px-16 py-8 space-y-3.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#A50025] text-white shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E66001] fill-[#E66001]" />
          <span>{current.badge}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          {current.title}
        </h1>

        {current.subtitle && (
          <p className="text-xs sm:text-sm text-slate-200 max-w-lg font-medium leading-relaxed line-clamp-2">
            {current.subtitle}
          </p>
        )}

        <div className="pt-2 flex items-center gap-3">
          <Link
            href={current.buttonLink || '/shop'}
            className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-[#A50025] hover:bg-[#7D001C] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-102 transition-all duration-200"
          >
            <span>{current.buttonText || 'Shop Now'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      {/* Slider Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            className="absolute left-3 z-20 p-2.5 rounded-full bg-[#111827]/60 hover:bg-[#A50025] text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-3 z-20 p-2.5 rounded-full bg-[#111827]/60 hover:bg-[#A50025] text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-[#E66001]' : 'w-2 bg-white/40 hover:bg-white/70'
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
