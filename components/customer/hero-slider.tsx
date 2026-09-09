'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBanners } from '@/hooks/use-content';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Award, ShieldCheck, Leaf } from 'lucide-react';
import { Skeleton } from 'antd';

export const HeroSlider: React.FC = () => {
  const { data: bannersData, isLoading } = useBanners({ position: 'HERO_SLIDER', isActive: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  const curatedSlides = [
    {
      id: 'slide-1',
      categoryBadge: '🌾 100% UNPOLISHED NATIVE MILLETS',
      title: 'Nutrient-Rich Native Millets Direct From Farms',
      subtitle: 'Wholesome Foxtail, Little Millet, Kambu & Varagu. Low glycemic index and naturally high in dietary fiber.',
      imageUrl: '/banners/millets-hero-banner.jpg',
      buttonText: 'Explore Native Millets',
      buttonLink: '/shop?category=other-grains-millets',
      accentColor: '#15803D',
      stats: [
        { label: 'Purity', value: '100% Unpolished' },
        { label: 'Fiber', value: 'High Dietary Fiber' },
        { label: 'Sugar Control', value: 'Low Glycemic' },
      ],
    },
    {
      id: 'slide-2',
      categoryBadge: '👑 ROYAL ANCIENT GRAINS',
      title: 'Traditional Karuppu Kavuni & Mappillai Samba',
      subtitle: 'Ancient Emperor’s Black Rice and Bridegroom Red Rice packed with anthocyanin antioxidants and natural minerals.',
      imageUrl: '/banners/black-rice-hero-banner.jpg',
      buttonText: 'Shop Heritage Rice',
      buttonLink: '/shop?category=other-grains-millets',
      accentColor: '#C2410C',
      stats: [
        { label: 'Antioxidants', value: 'Anthocyanin Rich' },
        { label: 'Vitality', value: 'Iron & Zinc' },
        { label: 'Cultivation', value: 'Traditional Grains' },
      ],
    },
    {
      id: 'slide-3',
      categoryBadge: '🌱 FARM DIRECT HARVEST',
      title: 'Pesticide-Free Wholesome Daily Staples',
      subtitle: 'Single-origin organic grains, native Horse Gram (Kollu), and Red Cholam cultivated with ancient farming wisdom.',
      imageUrl: '/banners/organic-farm-hero-banner.jpg',
      buttonText: 'Shop Farm Direct',
      buttonLink: '/shop?category=other-grains-millets',
      accentColor: '#A50025',
      stats: [
        { label: 'Sourcing', value: 'Direct from Farmers' },
        { label: 'Chemicals', value: 'Zero Residue' },
        { label: 'Protein', value: 'High Plant Protein' },
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % curatedSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [curatedSlides.length]);

  if (isLoading) {
    return (
      <div className="w-full h-[360px] sm:h-[440px] rounded-3xl bg-slate-900 overflow-hidden flex items-center justify-center p-8 border border-slate-800">
        <Skeleton active paragraph={{ rows: 4 }} className="max-w-xl" />
      </div>
    );
  }

  const current = curatedSlides[currentIndex];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] text-white my-3 shadow-2xl group min-h-[400px] sm:min-h-[480px] flex items-center border border-white/10">
      {/* Cinematic Background Image with Zoom Effect */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={current.imageUrl}
          alt={current.title}
          key={current.id}
          className="w-full h-full object-cover opacity-65 scale-100 animate-fade-in group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Soft Contrast Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/80 to-[#0F172A]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-[#0F172A]/40" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-2xl px-6 sm:px-12 lg:px-16 py-10 space-y-4">

        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/15 backdrop-blur-md border border-white/25 text-amber-300 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{current.categoryBadge}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
          {current.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-lg">
          {current.subtitle}
        </p>

        {/* Quick Value Stats */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 max-w-md">
          {current.stats.map((st, i) => (
            <div key={i} className="p-2 sm:p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/15">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">{st.label}</span>
              <span className="text-xs sm:text-sm font-black text-amber-300">{st.value}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex items-center gap-3">
          <Link
            href={current.buttonLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#A50025] hover:bg-[#83001D] text-white font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-[#A50025]/40 hover:scale-102 transition-all duration-200"
          >
            <span>{current.buttonText}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-black text-xs uppercase tracking-wider border border-white/20 transition-all duration-200"
          >
            <span>View All</span>
          </Link>
        </div>
      </div>


      {/* Slide Navigation Buttons */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? curatedSlides.length - 1 : prev - 1))}
        className="absolute left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-[#A50025] text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % curatedSlides.length)}
        className="absolute right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-[#A50025] text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Navigation Dots Indicator */}
      <div className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-2">
        {curatedSlides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? 'w-10 bg-amber-400 shadow-md' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
