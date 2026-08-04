'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/platform/types';

interface MinimalCategoryCardProps {
  category: Category;
}

export const MinimalCategoryCard: React.FC<MinimalCategoryCardProps> = ({ category }) => {
  return (
    <Link
      href={`/shop?categoryId=${category.id}`}
      className="group p-6 bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-900 rounded-md transition-all flex flex-col justify-between h-36"
    >
      <span className="text-xs font-mono text-slate-400 group-hover:text-slate-400">01</span>
      <div>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-white transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors line-clamp-1">
          {category.description || 'Explore collection'}
        </p>
      </div>
    </Link>
  );
};
