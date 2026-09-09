'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CollectionsSection: React.FC = () => {
  return (
    <section className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#A50025] flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E66001] fill-[#E66001]" />
            Pure & Natural
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Explore Our Featured Collections
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: RICE & GRAINS */}
        <div className="relative rounded-2xl overflow-hidden min-h-[240px] flex items-end p-6 border border-[#E5E7EB] shadow-xs group">
          <img
            src="/products-image all/raw_white_rice_grains.jpg"
            alt="Rice & Grains Collection"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/60 to-transparent" />

          <div className="relative z-10 space-y-2 text-white max-w-md">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E66001] text-white">
              Organic Grains
            </span>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Basmati • Sona Masoori • Red Rice • Millets
            </h3>
            <p className="text-xs text-slate-300 font-medium line-clamp-2">
              Extra-long grain basmati, unpolished red rice, and nutrient-packed native millets.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=rice-grains"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A50025] hover:bg-[#7D001C] text-white text-xs font-extrabold transition-all"
              >
                <span>Explore Rice & Grains</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: SPICES & MASALA POWDERS */}
        <div className="relative rounded-2xl overflow-hidden min-h-[240px] flex items-end p-6 border border-[#E5E7EB] shadow-xs group">
          <img
            src="/products-image all/red_chilli_powder_bowl.jpg"
            alt="Spices & Masala Powders"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/60 to-transparent" />

          <div className="relative z-10 space-y-2 text-white max-w-md">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#A50025] text-white">
              Stone-Ground Spices
            </span>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Guntur Chilli • Salem Turmeric • Sambar Masala
            </h3>
            <p className="text-xs text-slate-300 font-medium line-clamp-2">
              Authentic single-origin ground spices and secret home-style curry masalas.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=spices-masala-powders"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E66001] hover:bg-[#B84D01] text-white text-xs font-extrabold transition-all"
              >
                <span>Explore Spices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 3: HEALTH MIX & NUTRITION */}
        <div className="relative rounded-2xl overflow-hidden min-h-[240px] flex items-end p-6 border border-[#E5E7EB] shadow-xs group">
          <img
            src="/products-image all/health_mix_sathu_maavu.jpg"
            alt="Health Mix & Nutrition"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/60 to-transparent" />

          <div className="relative z-10 space-y-2 text-white max-w-md">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E66001] text-white">
              Superfood Drinks
            </span>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Sathu Maavu • Sprouted Millets • Kids Growth Mix
            </h3>
            <p className="text-xs text-slate-300 font-medium line-clamp-2">
              Traditional 18-grain energy powders, sprouted ragi almond, and cocoa malt drinks.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=health-mix-nutrition"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A50025] hover:bg-[#7D001C] text-white text-xs font-extrabold transition-all"
              >
                <span>Explore Health Mixes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
