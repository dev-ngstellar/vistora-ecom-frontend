'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Flame, Sparkles, Award } from 'lucide-react';

export const CategoryBento: React.FC = () => {
  return (
    <section className="space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E7EB] pb-3.5">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#15803D] flex items-center gap-1.5 mb-0.5">
            <Leaf className="w-3.5 h-3.5 text-[#15803D] fill-[#15803D]" />
            Farm Fresh Catalogue
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Explore By Superfood Category
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs font-black text-[#A50025] hover:text-[#E66001] flex items-center gap-1 transition"
        >
          <span>View All Products →</span>
        </Link>
      </div>

      {/* Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Bento 1 (Large - 5 cols): HERITAGE RICE */}
        <div className="md:col-span-5 relative rounded-3xl overflow-hidden min-h-[360px] md:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 border border-[#E5E7EB] shadow-xs group bg-[#1C1917] text-white">
          <img
            src="/products-image all/millets/Black rice front image.jpg.jpeg"
            alt="Heritage Rice - Karuppu Kavuni & Mappillai Samba"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-108 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/60 to-transparent" />

          {/* Top Chips */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#15803D] text-white shadow-xs">
              <Award className="w-3 h-3" /> 100% Unpolished
            </span>
            <span className="text-xs font-black text-amber-300">Antioxidant Rich</span>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                Category 01
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                Ancient Heritage Rice
              </h3>
            </div>

            <p className="text-xs text-slate-200 font-medium leading-relaxed line-clamp-2">
              Revered Karuppu Kavuni Black Rice and Mappillai Samba Bridegroom Red Rice for vitality and strength.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                🖤 Karuppu Kavuni
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                ❤️ Mappillai Samba
              </span>
            </div>

            <div className="pt-2">
              <Link
                href="/shop?category=other-grains-millets"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#111827] hover:bg-[#15803D] hover:text-white text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md"
              >
                <span>Shop Heritage Rice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols) - Split Bento */}
        <div className="md:col-span-7 grid grid-cols-1 gap-4 sm:gap-5">
          
          {/* Bento 2: NATIVE MILLETS */}
          <div className="relative rounded-3xl overflow-hidden min-h-[200px] sm:min-h-[210px] flex flex-col justify-between p-6 sm:p-7 border border-[#E5E7EB] shadow-xs group bg-[#312E81] text-white">
            <img
              src="/products-image all/millets/kambu front image.webp"
              alt="Native Millets - Thinai, Saamai, Kambu, Varagu"
              className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-108 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B4B]/95 via-[#1E1B4B]/75 to-transparent" />

            {/* Top */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#C2410C] text-white shadow-xs">
                <Flame className="w-3 h-3 fill-white" /> Low GI & Fiber Rich
              </span>
              <span className="text-[11px] font-black text-amber-300">Unpolished Whole Grains</span>
            </div>

            {/* Bottom */}
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                Organic Native Millets (Thinai, Saamai, Kambu, Varagu)
              </h3>
              <p className="text-xs text-slate-200 font-medium line-clamp-1">
                Perfect low-glycemic staple replacements for rice, upma, idli batter, and healthy bowls.
              </p>
              <div>
                <Link
                  href="/shop?category=other-grains-millets"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                  <span>Explore Millets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bento 3: SUPER-PULSES & CHOLAM */}
          <div className="relative rounded-3xl overflow-hidden min-h-[200px] sm:min-h-[210px] flex flex-col justify-between p-6 sm:p-7 border border-[#E5E7EB] shadow-xs group bg-[#14532D] text-white">
            <img
              src="/products-image all/millets/kollu frontside.webp"
              alt="Super Pulses - Horse Gram Kollu & Cholam"
              className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-108 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#052E16]/95 via-[#052E16]/75 to-transparent" />

            {/* Top */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#A50025] text-white shadow-xs">
                <Sparkles className="w-3 h-3 fill-[#E66001]" /> High Plant Protein
              </span>
              <span className="text-[11px] font-black text-amber-300">Stamina & Metabolism</span>
            </div>

            {/* Bottom */}
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                Native Kollu (Horse Gram) & Red / White Cholam
              </h3>
              <p className="text-xs text-slate-200 font-medium line-clamp-1">
                Authentic energy grains for warm rasam soups, nutritious rotis, and high-protein meals.
              </p>
              <div>
                <Link
                  href="/shop?category=other-grains-millets"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A50025] hover:bg-[#83001D] text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                  <span>Explore Pulses & Grains</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
