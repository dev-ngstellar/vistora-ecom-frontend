'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCategories } from '@/hooks/use-catalogue';
import { 
  Home, 
  ShoppingBag, 
  Grid, 
  Zap, 
  Flame, 
  ChevronDown, 
  ArrowRight,
  Layers
} from 'lucide-react';

export const customerNavItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop All', href: '/shop', icon: ShoppingBag },
  { label: 'New Drops', href: '/shop?sort=newest', icon: Zap },
  { label: 'Flash Deals', href: '/shop?onSale=true', icon: Flame },
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
    <nav className="hidden lg:flex items-center space-x-2">
      {/* Home */}
      <Link
        href="/"
        className={`nav-link-underline inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
          isHomeActive
            ? 'active text-[#B5123B] font-extrabold'
            : 'text-[#111111] hover:text-[#B5123B]'
        }`}
      >
        <Home className={`w-4 h-4 ${isHomeActive ? 'text-[#B5123B]' : 'text-slate-400'}`} />
        <span>Home</span>
      </Link>

      {/* Shop All */}
      <Link
        href="/shop"
        className={`nav-link-underline inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
          isShopActive && !pathname.includes('?')
            ? 'active text-[#B5123B] font-extrabold'
            : 'text-[#111111] hover:text-[#B5123B]'
        }`}
      >
        <ShoppingBag className={`w-4 h-4 ${isShopActive && !pathname.includes('?') ? 'text-[#B5123B]' : 'text-slate-400'}`} />
        <span>Shop All</span>
      </Link>

      {/* Departments Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDeptOpen(!isDeptOpen)}
          onMouseEnter={() => setIsDeptOpen(true)}
          className={`nav-link-underline inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
            isDeptOpen
              ? 'active text-[#B5123B] font-extrabold'
              : 'text-[#111111] hover:text-[#B5123B]'
          }`}
        >
          <Grid className={`w-4 h-4 ${isDeptOpen ? 'text-[#B5123B]' : 'text-slate-400'}`} />
          <span>Departments</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDeptOpen ? 'rotate-180 text-[#B5123B]' : 'text-slate-400'}`} />
        </button>

        {/* Categories Mega Dropdown */}
        {isDeptOpen && (
          <div
            onMouseLeave={() => setIsDeptOpen(false)}
            className="absolute top-full left-0 mt-2 w-72 rounded-[20px] bg-white shadow-2xl border border-[#ECECEC] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-1.5"
          >
            <div className="px-3 py-2 border-b border-[#ECECEC] flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#B5123B] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#F59E0B]" /> Luxury Departments
              </span>
            </div>

            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?categoryId=${cat.id}`}
                  onClick={() => setIsDeptOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-bold text-[#111111] hover:bg-[#FDF2F5] hover:text-[#B5123B] transition-all group"
                >
                  <span>{cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#B5123B] group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              ))
            ) : (
              <>
                <Link
                  href="/shop?category=men"
                  onClick={() => setIsDeptOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-bold text-[#111111] hover:bg-[#FDF2F5] hover:text-[#B5123B] transition-all group"
                >
                  <span>Men's Apparel</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#B5123B] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/shop?category=women"
                  onClick={() => setIsDeptOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-bold text-[#111111] hover:bg-[#FDF2F5] hover:text-[#B5123B] transition-all group"
                >
                  <span>Women's Couture</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#B5123B] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/shop?category=watches"
                  onClick={() => setIsDeptOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-bold text-[#111111] hover:bg-[#FDF2F5] hover:text-[#B5123B] transition-all group"
                >
                  <span>Luxury Timepieces</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#B5123B] group-hover:translate-x-1 transition-all" />
                </Link>
              </>
            )}

            <div className="pt-2 border-t border-[#ECECEC] mt-1">
              <Link
                href="/shop"
                onClick={() => setIsDeptOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-black text-[#B5123B] hover:text-[#D97706] transition-colors"
              >
                <span>Browse All Categories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* New Drops */}
      <Link
        href="/shop?sort=newest"
        className="nav-link-underline inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-[#111111] hover:text-[#B5123B] transition-all duration-200"
      >
        <Zap className="w-4 h-4 text-[#F59E0B]" />
        <span>New Drops</span>
      </Link>

      {/* Flash Deals */}
      <Link
        href="/shop?onSale=true"
        className="nav-link-underline inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-[#111111] hover:text-[#B5123B] transition-all duration-200"
      >
        <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        <span>Flash Deals</span>
      </Link>
    </nav>
  );
};
