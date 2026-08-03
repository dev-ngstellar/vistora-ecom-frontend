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
  const bgImage =
    category.imageUrl ||
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800';

  return (
    <Link
      href={`/shop?categoryId=${category.id}`}
      className="group relative h-48 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 text-white"
    >
      <Image
        src={bgImage}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent" />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md uppercase tracking-wider mb-1.5">
          <Layers className="w-3 h-3" />
          Category
        </span>
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-between">
          <span>{category.name}</span>
          <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-8px] group-hover:translate-x-0" />
        </h3>
      </div>
    </Link>
  );
};
