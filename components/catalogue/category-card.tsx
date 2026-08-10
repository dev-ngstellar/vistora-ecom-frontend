'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/catalogue.types';
import { ArrowRight, Layers } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const getCategoryFallbackImage = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('lipstick') || lower.includes('lip color')) {
      return 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1000&auto=format&fit=crop&q=80';
    }
    if (lower.includes('gloss') || lower.includes('shimmer')) {
      return 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=1000&auto=format&fit=crop&q=80';
    }
    if (lower.includes('kajal') || lower.includes('eyeliner') || lower.includes('eye')) {
      return 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1000&auto=format&fit=crop&q=80';
    }
    if (lower.includes('skincare') || lower.includes('care') || lower.includes('cream')) {
      return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&auto=format&fit=crop&q=80';
    }
    if (lower.includes('saree') || lower.includes('handloom')) {
      return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop&q=80';
  };

  const bgImage = category.imageUrl || getCategoryFallbackImage(category.name);

  return (
    <Link
      href={`/shop?categoryId=${category.id}`}
      className="group relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-500 flex flex-col justify-end p-5 text-white"
    >
      <Image
        src={bgImage}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent group-hover:via-slate-950/45 transition-colors" />

      <div className="relative z-10 flex items-end justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
            {category.name}
          </h3>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-maroon group-hover:scale-110 transition-all border border-white/20">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </Link>
  );
};
