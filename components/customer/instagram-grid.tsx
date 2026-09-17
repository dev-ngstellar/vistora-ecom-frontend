'use client';

import React from 'react';
import { Instagram } from 'lucide-react';

export const InstagramGrid: React.FC = () => {
  const images = [
    { url: 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789621719/ragi_front_image.webp', tag: '#RagiMillet' },
    { url: 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789621806/kambu_kurunai_front_image.webp', tag: '#KambuKurunai' },
    { url: 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789621837/hand_pounded_lean_rice_front_image.webp', tag: '#LeanRice' },
    { url: 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789622123/black-rice-hero-banner.jpg', tag: '#BlackRice' },
    { url: 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789622140/millets-hero-banner.jpg', tag: '#NativeMillets' },
  ];

  return (
    <section className="space-y-6 my-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">@VistoraCommerce</span>
          <h2 className="text-3xl font-serif font-light text-slate-900 dark:text-white">
            Follow Our Editorial Lookbook
          </h2>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition w-fit"
        >
          <Instagram className="w-4 h-4 text-pink-600" />
          <span>Follow On Instagram</span>
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <img
              src={img.url}
              alt={img.tag}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
              <Instagram className="w-6 h-6 text-white mb-1" />
              <span className="text-[11px] font-extrabold text-white">{img.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
