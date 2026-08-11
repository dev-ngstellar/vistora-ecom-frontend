'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CataloguePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CataloguePagination: React.FC<CataloguePaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (p: number) => {
    onPageChange(p);
    // Scroll smoothly to top of product grid
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {/* Previous Page Button */}
      <button
        onClick={() => handlePageClick(page - 1)}
        disabled={page <= 1}
        className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#FFF0F3] hover:text-[#A50025] hover:border-[#A50025]/30 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs flex items-center justify-center"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Number Buttons */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handlePageClick(pageNum)}
          className={`w-10 h-10 rounded-xl text-xs font-black transition-all shadow-2xs ${
            pageNum === page
              ? 'bg-[#A50025] text-white shadow-md scale-105'
              : 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#FFF0F3] hover:text-[#A50025] hover:border-[#A50025]/30'
          }`}
        >
          {pageNum}
        </button>
      ))}

      {/* Next Page Button */}
      <button
        onClick={() => handlePageClick(page + 1)}
        disabled={page >= totalPages}
        className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#FFF0F3] hover:text-[#A50025] hover:border-[#A50025]/30 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs flex items-center justify-center"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
