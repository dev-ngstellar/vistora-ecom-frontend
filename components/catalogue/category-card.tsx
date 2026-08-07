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
    if (lower.includes('men')) return 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop';
    if (lower.includes('women')) return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop';
    if (lower.includes('access') || lower.includes('watch')) return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&auto=format&fit=crop';
    if (lower.includes('foot') || lower.includes('shoe')) return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&auto=format&fit=crop';
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
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange text-white shadow-xs">
            {category._count?.products ? `${category._count.products} Products` : 'Collection'}
          </span>
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
