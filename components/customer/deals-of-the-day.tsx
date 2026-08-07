'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProducts } from '@/hooks/use-catalogue';
import { ProductCard } from '@/components/catalogue/product-card';
import { ProductGridSkeleton } from '@/components/catalogue/skeleton-loaders';
import { Flame, Clock, ArrowRight } from 'lucide-react';

export const DealsOfTheDay: React.FC = () => {
  const { data: dealsData, isLoading } = useProducts({ limit: 4 });
  const dealProducts = dealsData?.items || [];

  // Countdown timer simulation for Deal of the Day
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 15 });

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
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="bg-gradient-to-r from-amber-500/10 via-orange/10 to-amber-500/10 p-5 sm:p-7 rounded-3xl border border-orange/30 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-200/80 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-orange text-white text-xs font-black uppercase tracking-wider shadow-md">
            <Flame className="w-4 h-4 fill-white animate-pulse" />
            <span>Deals of the Day</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-slate-800 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-orange/30 shadow-xs">
            <Clock className="w-4 h-4 text-orange" />
            <span className="text-slate-600 font-bold">Ends in</span>
            <div className="flex items-center gap-1">
              <span className="font-mono bg-orange/15 text-orange px-2 py-0.5 rounded-lg font-black">{formatTime(timeLeft.hours)}h</span>
              <span className="text-orange font-black">:</span>
              <span className="font-mono bg-orange/15 text-orange px-2 py-0.5 rounded-lg font-black">{formatTime(timeLeft.minutes)}m</span>
              <span className="text-orange font-black">:</span>
              <span className="font-mono bg-orange/15 text-orange px-2 py-0.5 rounded-lg font-black">{formatTime(timeLeft.seconds)}s</span>
            </div>
          </div>
        </div>

        <Link
          href="/shop"
          className="text-xs font-black text-maroon hover:text-orange flex items-center gap-1.5 transition self-start sm:self-auto hover:translate-x-0.5"
        >
          <span>Explore All Daily Flash Deals</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : dealProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {dealProducts.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl">
          No daily deals active at this moment.
        </div>
      )}
    </section>
  );
};
