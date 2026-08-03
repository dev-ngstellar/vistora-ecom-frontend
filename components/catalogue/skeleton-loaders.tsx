'use client';

import React from 'react';

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-3xl bg-white p-3 border border-slate-100 shadow-xs animate-pulse space-y-3"
        >
          <div className="w-full h-56 bg-slate-200 rounded-2xl" />
          <div className="h-3 bg-slate-200 rounded-full w-1/3" />
          <div className="h-4 bg-slate-200 rounded-full w-3/4" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-5 bg-slate-200 rounded-full w-1/2" />
            <div className="w-8 h-8 bg-slate-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CategoryGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="h-44 rounded-3xl bg-slate-200 animate-pulse border border-slate-100"
        />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 animate-pulse">
      <div className="space-y-4">
        <div className="w-full h-96 bg-slate-200 rounded-3xl" />
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-slate-200 rounded-2xl" />
          <div className="w-20 h-20 bg-slate-200 rounded-2xl" />
          <div className="w-20 h-20 bg-slate-200 rounded-2xl" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-4 bg-slate-200 rounded-full w-1/4" />
        <div className="h-8 bg-slate-200 rounded-full w-3/4" />
        <div className="h-6 bg-slate-200 rounded-full w-1/3" />
        <div className="h-20 bg-slate-200 rounded-2xl" />
        <div className="h-12 bg-slate-200 rounded-2xl" />
        <div className="h-12 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
};
