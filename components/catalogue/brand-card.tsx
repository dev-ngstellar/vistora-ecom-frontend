'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Brand } from '@/types/catalogue.types';
import { Award } from 'lucide-react';

interface BrandCardProps {
  brand: Brand;
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  return (
    <Link
      href={`/shop?brandId=${brand.id}`}
      className="group p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center space-y-2"
    >
      <div className="relative w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
        {brand.logoUrl ? (
          <Image src={brand.logoUrl} alt={brand.name} fill className="object-contain p-2" />
        ) : (
          <Award className="w-8 h-8 text-indigo-600" />
        )}
      </div>
      <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition truncate w-full">
        {brand.name}
      </span>
    </Link>
  );
};
