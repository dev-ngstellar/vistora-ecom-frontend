'use client';

import React from 'react';
import { Brand, Category, Collection, ProductQueryFilters } from '@/types/catalogue.types';
import { Filter, RotateCcw, X } from 'lucide-react';

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
  return (
    <aside className="w-full bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Refine By</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Categories</h3>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            <button
              onClick={() => onFilterChange({ categoryId: undefined })}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                !filters.categoryId
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ categoryId: cat.id })}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                  filters.categoryId === cat.id
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Brands</h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            <button
              onClick={() => onFilterChange({ brandId: undefined })}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                !filters.brandId
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Brands
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => onFilterChange({ brandId: b.id })}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                  filters.brandId === b.id
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collections Filter */}
      {collections.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Collections
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            <button
              onClick={() => onFilterChange({ collectionId: undefined })}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                !filters.collectionId
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Collections
            </button>
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => onFilterChange({ collectionId: col.id })}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                  filters.collectionId === col.id
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{col.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Price Range ($)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              onFilterChange({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
          <span className="text-slate-400 font-bold">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              onFilterChange({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Size</h3>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['XS', 'S', 'M', 'L', 'XL'].map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => onFilterChange({ q: filters.q === sz ? undefined : sz })}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                filters.q === sz
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color Swatches Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Color Palette</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { name: 'Camel', hex: '#C19A6B' },
            { name: 'Black', hex: '#1A1A1A' },
            { name: 'Red', hex: '#9E1B1B' },
            { name: 'Green', hex: '#0E5D3E' },
            { name: 'Off-White', hex: '#F5F5F0' },
          ].map((c) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              onClick={() => onFilterChange({ q: filters.q === c.name ? undefined : c.name })}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                filters.q === c.name ? 'border-indigo-600 scale-110 ring-2 ring-indigo-300' : 'border-slate-300'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};
