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
            Curated Lines
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Explore Our Collections
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: BEAUTY ESSENTIALS */}
        <div className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-end p-6 sm:p-8 border border-[#E5E7EB] shadow-xs group">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop&q=80"
            alt="Beauty Essentials"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/60 to-transparent" />

          <div className="relative z-10 space-y-2 text-white max-w-md">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E66001] text-white">
              Beauty Essentials
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Lipsticks • Gloss • Kajal • Skincare
            </h3>
            <p className="text-xs text-slate-300 font-medium line-clamp-1">
              High-pigment lip colors, Ayurvedic kajal, and botanical eye care balm collections.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=lipsticks"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A50025] hover:bg-[#7D001C] text-white text-xs font-extrabold transition-all"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: SOUTH INDIAN HANDLOOMS */}
        <div className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-end p-6 sm:p-8 border border-[#E5E7EB] shadow-xs group">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80"
            alt="South Indian Handlooms"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/60 to-transparent" />

          <div className="relative z-10 space-y-2 text-white max-w-md">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#A50025] text-white">
              South Indian Handlooms
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Traditional Sarees & Handcrafted Collections
            </h3>
            <p className="text-xs text-slate-300 font-medium line-clamp-1">
              Authentic zari temple borders, Myil Khan Pet cotton weaves, and jacquard dhotis.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=sarees-handloom"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E66001] hover:bg-[#B84D01] text-white text-xs font-extrabold transition-all"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
