'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Clock,
  Construction,
  Layers,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  Compass
} from 'lucide-react';
import { Badge, Card, Tag } from 'antd';

interface QuickLink {
  label: string;
  href: string;
  primary?: boolean;
}

interface PlaceholderPageProps {
  title: string;
  description: string;
  module?: 'Customer' | 'Admin';
  icon?: React.ElementType;
  quickLinks?: QuickLink[];
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  module = 'Customer',
  icon: IconComponent = Construction,
  quickLinks,
}) => {
  const isAdmin = module === 'Admin';

  const defaultLinks: QuickLink[] = isAdmin
    ? [
      { label: 'Go to Dashboard', href: '/admin/dashboard', primary: true },
      { label: 'View Products', href: '/admin/products' },
      { label: 'View Orders', href: '/admin/orders' },
    ]
    : [
      { label: 'Back to Home', href: '/', primary: true },
      { label: 'Browse Catalog', href: '/shop' },
      { label: 'View Cart', href: '/cart' },
    ];

  const linksToDisplay = quickLinks || defaultLinks;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
      {/* Container card */}
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl">
        {/* Banner top */}
        <div
          className={`px-8 py-10 text-white relative overflow-hidden ${isAdmin
              ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900'
              : 'bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900'
            }`}
        >
          {/* Subtle decorative grid */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isAdmin
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'bg-white/20 text-white border border-white/30'
                  }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Vistora {module} Portal
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 shrink-0">
              <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Vistora Storefront
              </span>
              <span className="text-xs text-slate-500 mt-1">Standalone Architecture</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Live Service
              </span>
              <span className="text-xs text-slate-500 mt-1">All Systems Operational</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Support</span>
              <span className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-maroon" />
                24/7 Concierge
              </span>
              <span className="text-xs text-slate-500 mt-1">Customer Care Active</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              Need assistance? Explore other active areas of Vistora Commerce.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              {linksToDisplay.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${link.primary
                      ? isAdmin
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                >
                  {link.primary && <ArrowLeft className="w-4 h-4" />}
                  {link.label}
                  {!link.primary && <ChevronRight className="w-4 h-4 text-slate-400" />}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
