'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#111827] text-white my-6 min-h-[220px] sm:min-h-[260px] flex items-center shadow-xs border border-[#E5E7EB] group">
      <img
        src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=80"
        alt="Vistora Brand Story"
        className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#A50025]/95 via-[#111827]/80 to-transparent" />

      <div className="relative z-10 max-w-xl p-6 sm:p-12 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E66001] text-white shadow-xs">
          <Sparkles className="w-3.5 h-3.5" /> About Vistora Marketplace
        </span>

        <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          More Than Shopping. It's Vistora.
        </h2>

        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-md">
          Discover thoughtfully curated products from trusted sellers, all in one seamless shopping destination.
        </p>

        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-[#111827] text-xs font-extrabold hover:bg-[#FFF0F3] hover:text-[#A50025] transition-all shadow-sm"
          >
            <span>Explore Vistora</span>
            <ArrowRight className="w-4 h-4 text-[#A50025]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
