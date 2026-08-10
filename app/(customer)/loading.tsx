import React from 'react';

export default function CustomerLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Editorial Banner Skeleton */}
      <div className="w-full h-64 rounded-[20px] bg-slate-200/80" />

      {/* Control Bar & Product Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block h-96 rounded-[20px] bg-slate-200/80" />

        {/* Content Column Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          <div className="h-14 rounded-[14px] bg-slate-200/80 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 rounded-[20px] bg-slate-200/80" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
