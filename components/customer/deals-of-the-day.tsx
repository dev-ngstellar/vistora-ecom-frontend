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
    <section className="bg-orange-light/50 p-4 sm:p-6 rounded-3xl border border-orange-200/80 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-200/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange text-white text-xs font-black uppercase tracking-wider shadow-xs">
            <Flame className="w-4 h-4 fill-white" />
            <span>Deals of the Day</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-extrabold text-slate-800 bg-white px-3 py-1 rounded-xl border border-orange-200">
            <Clock className="w-3.5 h-3.5 text-orange" />
            <span>
              Ends in <span className="font-mono text-orange">{formatTime(timeLeft.hours)}h : {formatTime(timeLeft.minutes)}m : {formatTime(timeLeft.seconds)}s</span>
            </span>
          </div>
        </div>

        <Link
          href="/shop"
          className="text-xs font-extrabold text-maroon hover:text-orange flex items-center gap-1 transition self-start sm:self-auto"
        >
          <span>View All Deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
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
