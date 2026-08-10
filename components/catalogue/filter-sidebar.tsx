'use client';

import React, { useState } from 'react';
import { Brand, Category, Collection, ProductQueryFilters } from '@/types/catalogue.types';
import { Filter, RotateCcw, X, ChevronDown, Check } from 'lucide-react';
import { brandConfig } from '@/config';

interface FilterSidebarProps {
  categories?: Category[];
  brands?: Brand[];
  collections?: Collection[];
  filters: ProductQueryFilters;
  onFilterChange: (newFilters: Partial<ProductQueryFilters>) => void;
  onClearFilters: () => void;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories = [],
  brands = [],
  collections = [],
  filters,
  onFilterChange,
  onClearFilters,
  onCloseMobile,
}) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    collections: true,
    price: true,
    sizes: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-full bg-white rounded-[20px] p-6 border border-[#ECECEC] shadow-xs space-y-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ECECEC]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#B5123B]" />
          <h2 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider">Filter Catalog</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearFilters}
            className="text-xs font-bold text-[#6B7280] hover:text-[#B5123B] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#6B7280] hover:text-[#111111]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Accordion Filter */}
      {categories.length > 0 && (
        <div className="border-b border-[#ECECEC] pb-5 space-y-3">
          <button
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between text-xs font-extrabold text-[#111111] uppercase tracking-wider text-left focus:outline-none"
          >
            <span>Categories</span>
            <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${openSections.categories ? 'rotate-180 text-[#B5123B]' : ''}`} />
          </button>

          {openSections.categories && (
            <div className="space-y-1 pt-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => onFilterChange({ categoryId: undefined })}
                className={`w-full text-left px-3.5 py-2 rounded-[10px] text-xs transition-all flex items-center justify-between ${
                  !filters.categoryId
                    ? 'bg-[#FDF2F5] text-[#B5123B] font-extrabold'
                    : 'text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#111111] font-semibold'
                }`}
              >
                <span>All Categories</span>
                {!filters.categoryId && <Check className="w-3.5 h-3.5 text-[#B5123B]" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange({ categoryId: cat.id })}
                  className={`w-full text-left px-3.5 py-2 rounded-[10px] text-xs transition-all flex items-center justify-between ${
                    filters.categoryId === cat.id
                      ? 'bg-[#FDF2F5] text-[#B5123B] font-extrabold'
                      : 'text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#111111] font-semibold'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {filters.categoryId === cat.id && <Check className="w-3.5 h-3.5 text-[#B5123B]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}



      {/* Collections Accordion Filter */}
      {collections.length > 0 && (
        <div className="border-b border-[#ECECEC] pb-5 space-y-3">
          <button
            onClick={() => toggleSection('collections')}
            className="w-full flex items-center justify-between text-xs font-extrabold text-[#111111] uppercase tracking-wider text-left focus:outline-none"
          >
            <span>Collections</span>
            <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${openSections.collections ? 'rotate-180 text-[#B5123B]' : ''}`} />
          </button>

          {openSections.collections && (
            <div className="space-y-1 pt-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => onFilterChange({ collectionId: undefined })}
                className={`w-full text-left px-3.5 py-2 rounded-[10px] text-xs transition-all flex items-center justify-between ${
                  !filters.collectionId
                    ? 'bg-[#FDF2F5] text-[#B5123B] font-extrabold'
                    : 'text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#111111] font-semibold'
                }`}
              >
                <span>All Collections</span>
                {!filters.collectionId && <Check className="w-3.5 h-3.5 text-[#B5123B]" />}
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => onFilterChange({ collectionId: col.id })}
                  className={`w-full text-left px-3.5 py-2 rounded-[10px] text-xs transition-all flex items-center justify-between ${
                    filters.collectionId === col.id
                      ? 'bg-[#FDF2F5] text-[#B5123B] font-extrabold'
                      : 'text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#111111] font-semibold'
                  }`}
                >
                  <span className="truncate">{col.name}</span>
                  {filters.collectionId === col.id && <Check className="w-3.5 h-3.5 text-[#B5123B]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range Filter */}
      <div className="border-b border-[#ECECEC] pb-5 space-y-3">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-extrabold text-[#111111] uppercase tracking-wider text-left focus:outline-none"
        >
          <span>Price Range ({brandConfig.currency.symbol})</span>
          <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${openSections.price ? 'rotate-180 text-[#B5123B]' : ''}`} />
        </button>

        {openSections.price && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onFilterChange({
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-[14px] text-xs border border-[#ECECEC] focus:outline-none focus:border-[#B5123B] focus:ring-2 focus:ring-[#B5123B]/10 bg-[#FAFAFA] text-[#111111] font-bold"
            />
            <span className="text-[#6B7280] font-bold">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-[14px] text-xs border border-[#ECECEC] focus:outline-none focus:border-[#B5123B] focus:ring-2 focus:ring-[#B5123B]/10 bg-[#FAFAFA] text-[#111111] font-bold"
            />
          </div>
        )}
      </div>

      {/* Size Chips Filter */}
      <div className="border-b border-[#ECECEC] pb-5 space-y-3">
        <button
          onClick={() => toggleSection('sizes')}
          className="w-full flex items-center justify-between text-xs font-extrabold text-[#111111] uppercase tracking-wider text-left focus:outline-none"
        >
          <span>Size</span>
          <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${openSections.sizes ? 'rotate-180 text-[#B5123B]' : ''}`} />
        </button>

        {openSections.sizes && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {['XS', 'S', 'M', 'L', 'XL'].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => onFilterChange({ q: filters.q === sz ? undefined : sz })}
                className={`px-3.5 py-2 rounded-[14px] border text-xs font-extrabold transition-all duration-200 ${
                  filters.q === sz
                    ? 'bg-[#111827] text-white border-[#111827] shadow-sm scale-105'
                    : 'bg-[#FAFAFA] text-[#111111] border-[#ECECEC] hover:border-[#111111]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
