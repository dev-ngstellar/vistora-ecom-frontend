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
      title: 'Fresh Rice & Organic Grains',
      subtitle: 'Premium Royal Basmati, organic Sona Masoori, red rice, and unrefined grains delivered fresh.',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1920&auto=format&fit=crop&q=80',
      mobileImageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      buttonText: 'Shop Rice & Grains',
      buttonLink: '/shop?category=rice-grains',
      badge: '100% Organic & Fresh',
    },
    {
      id: 'fb-2',
      title: 'Authentic Spices & Masalas',
      subtitle: 'Pure Guntur chilli powder, Salem turmeric, roasted coriander, and rich home-style sambar masala.',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&auto=format&fit=crop&q=80',
      mobileImageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      buttonText: 'Explore Spices',
      buttonLink: '/shop?category=spices-masala-powders',
      badge: 'Stone Ground Spices',
    },
    {
      id: 'fb-3',
      title: 'Health Mix & Multigrain Nutrition',
      subtitle: 'Traditional Sathu Maavu, sprouted millet drinks, and special nutrition mixes for kids and family.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1920&auto=format&fit=crop&q=80',
      mobileImageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      buttonText: 'Shop Health Mix',
      buttonLink: '/shop?category=health-mix-nutrition',
      badge: 'Traditional Superfoods',
    },
  ];

  const banners = fallbackBanners;

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
