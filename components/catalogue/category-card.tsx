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
      className="group relative h-40 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg border border-slate-200/80 transition-all duration-300 flex flex-col justify-end p-4 text-white"
    >
      <Image
        src={bgImage}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 block mb-0.5">
            Category
          </span>
          <h3 className="text-base font-extrabold text-white tracking-tight">
            {category.name}
          </h3>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-purple-600 transition-colors">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </Link>
  );
};
