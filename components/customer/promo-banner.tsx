'use client';

import React from 'react';
import Link from 'next/link';
import { useBanners } from '@/hooks/use-content';
import { ArrowRight, Crown } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const { data: bannersData } = useBanners({ position: 'PROMO_GRID', isActive: true });
  const banner = bannersData?.banners?.[0] || {
    title: 'Bespoke Italian Tailoring',
    subtitle: 'Engineered for timeless sophistication and effortless luxury.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&auto=format&fit=crop',
    buttonText: 'Explore Bespoke Tailoring',
    buttonLink: '/shop?category=men',
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-white my-8 h-[280px] sm:h-[320px] flex items-center shadow-md group">
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-102 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-maroon/90 via-slate-950/80 to-transparent" />

      <div className="relative z-10 max-w-lg p-6 sm:p-10 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-orange text-white shadow-xs">
          <Crown className="w-3.5 h-3.5" /> Featured Spotlight
        </span>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
          {banner.title}
        </h2>

        {banner.subtitle && (
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed line-clamp-2">
            {banner.subtitle}
          </p>
        )}

        <div className="pt-1">
          <Link
            href={banner.buttonLink || '/shop'}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 transition shadow-sm"
          >
            <span>{banner.buttonText || 'Explore Now'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </Link>
        </div>
      </div>
    </section>
  );
};
