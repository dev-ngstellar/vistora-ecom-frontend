'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import { useProducts } from '@/hooks/use-catalogue';
import { brandConfig } from '@/config';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const POPULAR_SEARCH_TAGS = [
  'Karuppu Kavuni',
  'Mappillai Samba',
  'Hand-Pounded Rice',
  'Organic Ragi',
  'Kambu Kurunai',
  'Thinai Millet',
  'Saamai',
  'Varagu',
  'Native Kollu',
  'White Cholam',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search products, brands & categories...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const hasValidQuery = isFocused && query.trim().length >= 2;

  // Active query search results
  const { data: searchResults, isLoading } = useProducts(
    {
      q: hasValidQuery ? query.trim() : undefined,
      limit: 5,
    },
    {
      enabled: hasValidQuery,
    }
  );

  // Popular / Trending products shown before typing
  const { data: popularProductsData, isLoading: isPopularLoading } = useProducts(
    {
      limit: 4,
    },
    {
      enabled: isFocused && !hasValidQuery,
    }
  );

  const matchingProducts = searchResults?.items || [];
  const popularProducts = popularProductsData?.items || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setIsFocused(false);
    setQuery('');
    router.push(`/product/${slug}`);
  };

  const handleSelectTag = (tag: string) => {
    setQuery(tag);
    setIsFocused(true);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 bg-slate-100/90 focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-maroon focus:ring-2 focus:ring-maroon/15 transition-all duration-200 outline-none shadow-xs"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsFocused(false);
            }}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Instant Product Suggestions Dropdown Popover */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[460px] overflow-y-auto space-y-3">
          {query.trim().length >= 2 ? (
            <div>
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-maroon flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-orange" /> Matching Products
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {isLoading ? 'Searching...' : `${matchingProducts.length} Results`}
                </span>
              </div>

              {isLoading ? (
                <div className="p-4 text-center text-xs text-slate-400 font-medium animate-pulse">
                  Fetching catalog matches...
                </div>
              ) : matchingProducts.length > 0 ? (
                <div className="divide-y divide-slate-100 pt-1">
                  {matchingProducts.map((prod) => {
                    const img =
                      prod.images?.find((i) => i.isPrimary)?.imageUrl ||
                      prod.images?.[0]?.imageUrl ||
                      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop';
                    const priceNum = typeof prod.price === 'string' ? parseFloat(prod.price) : prod.price;

                    return (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod.slug)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                          <img src={img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-maroon transition-colors">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {prod.category?.name || 'Organic Staples'}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-black text-slate-900 block">
                            {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={handleSearchSubmit}
                    className="w-full mt-2 pt-2 pb-1 text-center text-xs font-black text-maroon hover:text-orange flex items-center justify-center gap-1 transition"
                  >
                    <span>View all matching results for "{query}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 space-y-1">
                  <p className="font-bold">No exact product match found for "{query}"</p>
                  <p className="text-[11px] text-slate-400">Press Enter to search full store catalog</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-1 space-y-3">
              {/* Popular Search Tags */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange" /> Popular Search Suggestions
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {POPULAR_SEARCH_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectTag(tag)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-maroon-light hover:text-maroon text-slate-700 text-xs font-bold transition-all border border-slate-200/80 hover:border-maroon/30 shadow-2xs"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular & Trending Products Section */}
              {popularProducts.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-maroon" /> Trending Products
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsFocused(false);
                        router.push('/shop');
                      }}
                      className="text-[10px] font-bold text-maroon hover:text-orange transition"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                    {popularProducts.map((prod) => {
                      const img =
                        prod.images?.find((i) => i.isPrimary)?.imageUrl ||
                        prod.images?.[0]?.imageUrl ||
                        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop';
                      const priceNum = typeof prod.price === 'string' ? parseFloat(prod.price) : prod.price;

                      return (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod.slug)}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/70 hover:bg-maroon-light/60 border border-slate-100 hover:border-maroon/20 cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-slate-200">
                            <img src={img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-maroon transition-colors">
                              {prod.name}
                            </h4>
                            <span className="text-[10px] font-black text-maroon">
                              {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
