'use client';

import React from 'react';
import { brandConfig } from '@/config';
import { Sparkles, ShieldCheck, Award, HeartHandshake, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4 pt-6">
        <span className="text-xs font-extrabold uppercase tracking-widest text-maroon bg-maroon-light px-4 py-1.5 rounded-full">
          About Vistora
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Pure Grains, Traditional Millets & Heritage Foods
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {brandConfig.merchantLegalName} is committed to bringing authentic, farm-fresh grocery, nutrient-dense millets, traditional rice varieties, and pure stone-ground spices directly to your family's table across India.
        </p>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] text-[#A50025] flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">100% Direct Fulfillment</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every grain, pulse, and spice is inspected, hygienic-packed, and shipped directly from our central facility in Komarapalayam.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] text-[#E66001] flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Pan India Delivery</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Swift 2–3 day dispatch with door delivery in 2–5 days. Free delivery across Komarapalayam and Bhavani.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Dedicated Support</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Live assistance 7 days a week (9 AM – 9 PM) and 24-hour return/replacement support for grocery and grain orders.
          </p>
        </div>
      </div>


      {/* CTA Footer */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to Start Shopping?</h2>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Explore our latest arrivals, trending deals, and exclusive marketplace collections.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-maroon text-white font-extrabold text-xs uppercase tracking-wider transition hover:bg-maroon-dark shadow-xl"
        >
          Explore Shop Catalog
        </Link>
      </div>
    </div>
  );
}
