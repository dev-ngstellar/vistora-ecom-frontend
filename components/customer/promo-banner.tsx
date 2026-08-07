'use client';

import React from 'react';
import Link from 'next/link';
import { useBanners } from '@/hooks/use-content';
import { ArrowRight, Crown } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const { data: bannersData } = useBanners({ position: 'PROMO_GRID', isActive: true });
  const banner = bannersData?.banners?.[0] || {
    title: 'Bespoke Executive Suits & Italian Tailoring',
    subtitle: 'Engineered with hand-finished lapels and pure virgin wool for timeless elegance.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&auto=format&fit=crop',
    buttonText: 'Explore Italian Tailoring',
    buttonLink: '/shop?category=men',
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white my-10 h-[320px] sm:h-[380px] flex items-center shadow-xl group border border-slate-800">
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-maroon-dark/95 via-slate-950/85 to-transparent" />

      <div className="relative z-10 max-w-xl p-8 sm:p-14 space-y-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange text-white shadow-md">
          <Crown className="w-4 h-4 text-amber-300 fill-amber-300" /> Featured Editorial Spotlight
        </span>

        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-sm">
          {banner.title}
        </h2>

        {banner.subtitle && (
          <p className="text-xs sm:text-base text-slate-200 font-medium leading-relaxed line-clamp-2 drop-shadow-xs">
            {banner.subtitle}
          </p>
        )}

        <div className="pt-2">
          <Link
            href={banner.buttonLink || '/shop'}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-slate-950 text-xs font-black hover:bg-amber-300 hover:scale-102 transition-all shadow-lg"
          >
            <span>{banner.buttonText || 'Explore Now'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>
        </div>
      </div>
    </section>
  );
};
