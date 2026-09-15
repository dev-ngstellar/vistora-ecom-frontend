'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Sparkles, Award, Flame } from 'lucide-react';

export const CategoryBento: React.FC = () => {
  return (
    <section className="space-y-4 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E7EB] pb-3.5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#15803D] flex items-center gap-1.5 mb-0.5">
            <Leaf className="w-3.5 h-3.5 text-[#15803D] fill-[#15803D]" />
            Farm Fresh Catalogue
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111827] tracking-tight">
            Explore By Superfood Category
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold text-[#A50025] hover:text-[#E66001] flex items-center gap-1 transition group"
        >
          <span>View All Categories</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Bento 1 (Large - 5 cols): HERITAGE RICE */}
        <Link
          href="/shop?category=rice-grains"
          className="md:col-span-5 relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[320px] md:min-h-[420px] flex flex-col justify-between p-6 sm:p-8 border border-neutral-200/80 shadow-sm group bg-[#111827] text-white cursor-pointer"
        >
          <img
            src="/products-image all/hand_pounded_lean_rice_front_image.webp"
            alt="Ancient Heritage Rice"
            className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Top Badge */}
          <div className="relative z-10 flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-[#15803D] text-white shadow-xs backdrop-blur-sm">
              <Award className="w-3.5 h-3.5" /> 100% Unpolished
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Heritage & Royal Rice
            </h3>
            <p className="text-sm text-slate-200 font-normal leading-relaxed line-clamp-2">
              Hand-Pounded Lean Rice, Karuppu Kavuni & aged Royal Basmati.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-neutral-900 group-hover:bg-[#15803D] group-hover:text-white text-xs font-bold tracking-wide transition-colors duration-200 shadow-sm">
                <span>Shop Rice & Grains</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>

        {/* Right Column (7 cols) - Split Bento */}
        <div className="md:col-span-7 grid grid-cols-1 gap-4 sm:gap-5">
          
          {/* Bento 2: NATIVE MILLETS */}
          <Link
            href="/shop?category=other-grains-millets"
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[190px] sm:min-h-[200px] flex flex-col justify-between p-6 sm:p-7 border border-neutral-200/80 shadow-sm group bg-[#0F172A] text-white cursor-pointer"
          >
            <img
              src="/products-image all/ragi_banner_showcase.webp"
              alt="Native Millets & Ragi"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-transparent" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-[#C2410C] text-white shadow-xs">
                <Flame className="w-3 h-3 fill-white" /> Low GI & High Fiber
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                Native Millets & Supergrains
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-normal">
                Organic Ragi, Kambu Kurunai, Thinai, Saamai & Varagu.
              </p>
              <div className="pt-1.5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide transition-colors border border-white/20 group-hover:bg-[#C2410C] group-hover:border-[#C2410C]">
                  <span>Explore Millets</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {/* Bento 3: SPICES & MASALAS */}
          <Link
            href="/shop?category=spices-masala-powders"
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[190px] sm:min-h-[200px] flex flex-col justify-between p-6 sm:p-7 border border-neutral-200/80 shadow-sm group bg-[#2A0808] text-white cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1000&auto=format&fit=crop&q=80"
              alt="Authentic Spices & Masala"
              className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/65 to-transparent" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-[#A50025] text-white shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-300" /> Pure & Stone-Ground
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                Spices & Masala Powders
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-normal">
                Salem turmeric, Guntur chilli & traditional blends.
              </p>
              <div className="pt-1.5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide transition-colors border border-white/20 group-hover:bg-[#A50025] group-hover:border-[#A50025]">
                  <span>Explore Spices</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

        </div>

      </div>
    </section>
  );
};


