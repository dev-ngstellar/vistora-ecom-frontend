'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCategories } from '@/hooks/use-catalogue';
import { 
  Home, 
  ShoppingBag, 
  Grid, 
  Flame, 
  ChevronDown, 
  ArrowRight,
  Layers
} from 'lucide-react';

export const customerNavItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/shop', icon: ShoppingBag },
  { label: 'Categories', href: '/shop?view=categories', icon: Grid },
  { label: 'Deals', href: '/shop?onSale=true', icon: Flame },
];

export const CustomerNav: React.FC = () => {
  const pathname = usePathname();
  const { data: categories = [] } = useCategories();
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDeptOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHomeActive = pathname === '/';
  const isShopActive = pathname === '/shop';

  return (
    <nav className="hidden lg:flex items-center space-x-1 sm:space-x-2">
      {/* Home */}
      <Link
        href="/"
        className={`px-3 py-2 text-xs font-extrabold transition-all duration-200 ${
          isHomeActive
            ? 'text-[#A50025] font-black border-b-2 border-[#A50025]'
            : 'text-[#111827] hover:text-[#A50025]'
        }`}
      >
        Home
      </Link>

      {/* Shop */}
      <Link
        href="/shop"
        className={`px-3 py-2 text-xs font-extrabold transition-all duration-200 ${
          isShopActive && !pathname.includes('?')
            ? 'text-[#A50025] font-black border-b-2 border-[#A50025]'
            : 'text-[#111827] hover:text-[#A50025]'
        }`}
      >
        Shop
      </Link>

      {/* Categories Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDeptOpen(!isDeptOpen)}
          onMouseEnter={() => setIsDeptOpen(true)}
          className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-extrabold transition-all duration-200 ${
            isDeptOpen
              ? 'text-[#A50025] font-black'
              : 'text-[#111827] hover:text-[#A50025]'
          }`}
        >
          <span>Categories</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDeptOpen ? 'rotate-180 text-[#A50025]' : 'text-slate-400'}`} />
        </button>

        {/* Categories Popover Dropdown */}
        {isDeptOpen && (
          <div
            onMouseLeave={() => setIsDeptOpen(false)}
            className="absolute top-full left-0 mt-1.5 w-64 rounded-2xl bg-white shadow-xl border border-[#E5E7EB] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-1"
          >
            <div className="px-3 py-1.5 border-b border-[#E5E7EB] flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A50025] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#E66001]" /> Departments
              </span>
            </div>

            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?categoryId=${cat.id}`}
                  onClick={() => setIsDeptOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-[#111827] hover:bg-[#FFF0F3] hover:text-[#A50025] transition-all group"
                >
                  <span>{cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#A50025] group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              ))
            ) : (
              <>
                <Link
                  href="/shop?category=lipsticks"
                  onClick={() => setIsDeptOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-[#111827] hover:bg-[#FFF0F3] hover:text-[#A50025] transition-all group"
                >
                  <span>Lipsticks & Lip Colors</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#A50025] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/shop?category=lip-gloss"
                  onClick={() => setIsDeptOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-[#111827] hover:bg-[#FFF0F3] hover:text-[#A50025] transition-all group"
                >
                  <span>Lip Gloss & Shimmer</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#A50025] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/shop?category=kajal-eyeliner"
                  onClick={() => setIsDeptOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-[#111827] hover:bg-[#FFF0F3] hover:text-[#A50025] transition-all group"
                >
                  <span>Kajal & Eyeliners</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#A50025] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/shop?category=skincare"
                  onClick={() => setIsDeptOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-[#111827] hover:bg-[#FFF0F3] hover:text-[#A50025] transition-all group"
                >
                  <span>Skincare & Eye Care</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#A50025] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/shop?category=sarees-handloom"
                  onClick={() => setIsDeptOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-[#111827] hover:bg-[#FFF0F3] hover:text-[#A50025] transition-all group"
                >
                  <span>Sarees & Handloom</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#A50025] group-hover:translate-x-1 transition-all" />
                </Link>
              </>
            )}

            <div className="pt-2 border-t border-[#E5E7EB] mt-1">
              <Link
                href="/shop"
                onClick={() => setIsDeptOpen(false)}
                className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-black text-[#A50025] hover:text-[#E66001] transition-colors"
              >
                <span>Browse All Categories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Deals */}
      <Link
        href="/shop?onSale=true"
        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-extrabold text-[#E66001] hover:text-[#A50025] transition-all duration-200"
      >
        <Flame className="w-3.5 h-3.5 text-[#E66001] fill-[#E66001]" />
        <span>Deals</span>
      </Link>
    </nav>
  );
};
