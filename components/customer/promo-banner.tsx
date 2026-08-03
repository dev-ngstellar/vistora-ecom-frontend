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
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white my-12 h-[420px] flex items-center shadow-xl group">
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />

      <div className="relative z-10 max-w-xl p-8 sm:p-12 space-y-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
          <Crown className="w-3.5 h-3.5" /> Private Editorial
        </span>

        <h2 className="text-3xl sm:text-5xl font-serif font-light text-white leading-tight">
          {banner.title}
        </h2>

        {banner.subtitle && (
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            {banner.subtitle}
          </p>
        )}

        <div className="pt-2">
          <Link
            href={banner.buttonLink || '/shop'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-950 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition shadow-lg"
          >
            <span>{banner.buttonText || 'Discover Collection'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
