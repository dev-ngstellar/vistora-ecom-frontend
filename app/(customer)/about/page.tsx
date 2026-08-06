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
          Redefining Modern Marketplace Shopping
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {brandConfig.tagline || 'One Destination. Endless Choices... Discover premium luxury collections across apparel, electronics, accessories, and home decor.'}
        </p>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-maroon-light text-maroon flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Curated Quality</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every product in our catalog undergoes rigorous authenticity and quality standards verification.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-maroon-light text-maroon flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Express Delivery</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fast nationwide and international logistics ensuring your orders reach your doorstep safely.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-maroon-light text-maroon flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Customer Support</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dedicated customer care team ready to assist with order tracking, exchanges, and inquiries.
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
