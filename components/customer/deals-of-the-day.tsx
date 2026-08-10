'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types/catalogue.types';
import { ProductCard } from '@/components/catalogue/product-card';
import { ProductGridSkeleton } from '@/components/catalogue/skeleton-loaders';
import { Flame, Clock, ArrowRight } from 'lucide-react';

interface DealsOfTheDayProps {
  products?: Product[];
  isLoading?: boolean;
}

export const DealsOfTheDay: React.FC<DealsOfTheDayProps> = ({ products = [], isLoading = false }) => {
  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 8, minutes: 45, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="bg-[#FFF6F0] p-5 sm:p-6 rounded-2xl border border-[#E66001]/20 shadow-xs space-y-4 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E66001]/20 pb-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E66001] text-white text-xs font-black uppercase tracking-wider shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>Deals of the Day</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-extrabold text-[#111827] bg-white px-3 py-1 rounded-full border border-[#E5E7EB] shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#E66001]" />
            <span className="text-[#64748B] font-bold">Ends in</span>
            <div className="flex items-center gap-1 font-mono text-[#E66001] font-black">
              <span>{formatTime(timeLeft.hours)}h</span>
              <span>:</span>
              <span>{formatTime(timeLeft.minutes)}m</span>
              <span>:</span>
              <span>{formatTime(timeLeft.seconds)}s</span>
            </div>
          </div>
        </div>

        <Link
          href="/shop?onSale=true"
          className="text-xs font-extrabold text-[#A50025] hover:text-[#E66001] flex items-center gap-1 transition self-start sm:self-auto"
        >
          <span>View All Deals →</span>
        </Link>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-[#64748B] bg-white rounded-xl">
          No daily deals active at this moment.
        </div>
      )}
    </section>
  );
};
