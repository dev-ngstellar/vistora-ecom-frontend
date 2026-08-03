'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '@/types/catalogue.types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const bgImage =
    collection.bannerImage ||
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';

  return (
    <Link
      href={`/shop?collectionId=${collection.id}`}
      className="group relative h-56 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-6 text-white"
    >
      <Image
        src={bgImage}
        alt={collection.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

      <div className="relative z-10 space-y-1">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-widest shadow-xs">
          <Sparkles className="w-3 h-3 fill-slate-950" />
          Collection Showcase
        </span>
        <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight">
          {collection.name}
        </h3>
        {collection.description && (
          <p className="text-xs text-slate-300 line-clamp-1 leading-relaxed">
            {collection.description}
          </p>
        )}
        <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-amber-300 group-hover:text-white transition">
          <span>Explore Lookbook</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};
