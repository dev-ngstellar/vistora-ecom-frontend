'use client';

import React from 'react';
import Link from 'next/link';
import { usePublicCMSPage } from '@/hooks/use-content';
import { Feather, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const { data: page } = usePublicCMSPage('about-us');

  return (
    <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-xl space-y-8 my-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <Feather className="w-4 h-4" />
          <span>Heritage & Artisanal Atelier</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight">
          {page?.title || 'Crafted with Italian Elegance'}
        </h2>

        <div
          className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              page?.content ||
              '<p>Vistora Commerce represents an elite luxury fashion house offering handcrafted haute couture, Italian silk gowns, and bespoke cashmere outerwear created by master artisans.</p>',
          }}
        />
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800 text-center">
        <div className="space-y-2">
          <Award className="w-6 h-6 mx-auto text-indigo-400" />
          <h4 className="font-serif text-lg font-light text-white">Artisanal Craftsmanship</h4>
          <p className="text-xs text-slate-400 font-light">Every seam, stitch, and lining is hand-inspected in Milan.</p>
        </div>

        <div className="space-y-2">
          <ShieldCheck className="w-6 h-6 mx-auto text-emerald-400" />
          <h4 className="font-serif text-lg font-light text-white">100% Certified Fabrics</h4>
          <p className="text-xs text-slate-400 font-light">Ethically sourced Mulberry silk, cashmere, and fine wools.</p>
        </div>

        <div className="space-y-2">
          <HeartHandshake className="w-6 h-6 mx-auto text-purple-400" />
          <h4 className="font-serif text-lg font-light text-white">Private Concierge Service</h4>
          <p className="text-xs text-slate-400 font-light">Bespoke fitting consultations and dedicated white-glove support.</p>
        </div>
      </div>
    </section>
  );
};
