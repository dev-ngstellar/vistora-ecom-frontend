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
    if (lower.includes('rice') || lower.includes('grain') || lower.includes('kavuni') || lower.includes('samba') || lower.includes('hand-pounded')) {
      return 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789621837/hand_pounded_lean_rice_banner_showcase.webp';
    }
    if (lower.includes('millet') || lower.includes('ragi') || lower.includes('kambu') || lower.includes('thinai') || lower.includes('saamai') || lower.includes('varagu')) {
      return 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789621719/ragi_banner_showcase.webp';
    }
    if (lower.includes('spice') || lower.includes('masala') || lower.includes('chilli') || lower.includes('turmeric') || lower.includes('coriander')) {
      return 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789621837/hand_pounded_lean_rice_banner_showcase.webp';
    }
    if (lower.includes('health') || lower.includes('nutrition') || lower.includes('sathu')) {
      return 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789621806/kambu_kurunai_banner_showcase.webp';
    }
    if (lower.includes('oil') || lower.includes('ghee')) {
      return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000&auto=format&fit=crop&q=80';
    }
    return 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789621837/hand_pounded_lean_rice_front_image.webp';
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
