import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12 text-center">
      <div className="p-5 rounded-3xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm mb-6">
        <Compass className="w-16 h-16 animate-bounce" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
        404 — Page Not Found
      </span>

      <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Lost in Luxury?
      </h1>

      <p className="mt-3 text-sm text-slate-600 max-w-md leading-relaxed">
        The page you are searching for does not exist or has been relocated to another section of Vistora Commerce.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
}
