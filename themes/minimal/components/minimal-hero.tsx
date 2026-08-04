'use client';

import React from 'react';
import Link from 'next/link';
import { useBanners } from '@/platform/hooks';
import { brandConfig } from '@/config';
import { ArrowRight } from 'lucide-react';

export const MinimalHero: React.FC = () => {
  const { data: bannersData } = useBanners({ position: 'HERO_SLIDER', isActive: true });
  const banner = bannersData?.banners?.[0] || {
    title: `Discover ${brandConfig.name}`,
    subtitle: 'Essential collections engineered with clean aesthetics and timeless design.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
    buttonText: 'Browse Shop Catalog',
    buttonLink: '/shop',
  };

  return (
    <section className="relative bg-slate-900 text-white rounded-md overflow-hidden min-h-[440px] flex items-center p-8 sm:p-16 my-6">
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative z-10 max-w-xl space-y-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 border border-slate-700 px-3 py-1 rounded-full">
          Minimal Edition
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
          {banner.title}
        </h1>
        {banner.subtitle && (
          <p className="text-sm text-slate-300 leading-relaxed font-light">{banner.subtitle}</p>
        )}
        <div>
          <Link
            href={banner.buttonLink || '/shop'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded-md hover:bg-slate-100 transition"
          >
            <span>{banner.buttonText || 'Explore Catalog'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
