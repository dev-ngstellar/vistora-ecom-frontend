'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Award } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#14261C] text-white my-8 min-h-[260px] sm:min-h-[300px] flex items-center shadow-lg border border-emerald-900/40 group">
      <img
        src="/products-image all/millets/maapillai samba front.webp"
        alt="Vistora Organic Grains & Millets"
        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#14261C]/95 via-[#14261C]/85 to-transparent" />

      <div className="relative z-10 max-w-xl p-6 sm:p-12 space-y-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#15803D] text-white shadow-xs">
            <Leaf className="w-3.5 h-3.5" /> 100% Farm-Direct Harvest
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <Award className="w-3.5 h-3.5" /> Unpolished & Nutrient Rich
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          Pure Grains & Ancient Millets For Modern Health.
        </h2>

        <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed max-w-md">
          Say goodbye to refined, chemically polished supermarket rice. Experience the wholesome nourishment of unpolished Foxtail, Kodo, Little Millets, and ancient Black Rice.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <Link
            href="/shop?category=other-grains-millets"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#14261C] text-xs font-black uppercase tracking-wider transition-all shadow-md hover:scale-102"
          >
            <span>Explore Organic Millets</span>
            <ArrowRight className="w-4 h-4 text-[#14261C]" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider transition-all border border-white/15"
          >
            <span>Our Farm Story</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
