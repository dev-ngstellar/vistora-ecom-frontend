'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Tag, ShoppingBag } from 'lucide-react';

export const CollectionsSection: React.FC = () => {
  const collections = [
    {
      title: 'Ancient Millet Discovery Box',
      subtitle: 'Organic Thinai + Saamai + Kambu + Varagu (1kg each value pack)',
      tag: 'Save 15% Bundle',
      badgeBg: '#C2410C',
      image: '/products-image all/millets/Saamai front image_11zon.jpg.jpeg',
      href: '/shop?category=other-grains-millets',
      price: '₹375',
      originalPrice: '₹440',
    },
    {
      title: 'Heritage Royal Rice Duo',
      subtitle: 'Karuppu Kavuni Black Rice + Mappillai Samba Red Rice (1kg each)',
      tag: 'Antioxidant & Stamina',
      badgeBg: '#15803D',
      image: '/products-image all/millets/maapillai samba front.webp',
      href: '/shop?category=other-grains-millets',
      price: '₹285',
      originalPrice: '₹335',
    },
    {
      title: 'Native Energy & Protein Combo',
      subtitle: 'Organic Red Cholam (1kg) + White Jowar (1kg) + Native Kollu Horse Gram (1kg)',
      tag: 'Gluten-Free & Protein',
      badgeBg: '#A50025',
      image: '/products-image all/millets/Red cholam front image_11zon.jpg.jpeg',
      href: '/shop?category=other-grains-millets',
      price: '₹255',
      originalPrice: '₹300',
    },
  ];

  return (
    <section className="space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E7EB] pb-3.5">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#A50025] flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E66001] fill-[#E66001]" />
            Curated Artisanal Bundles
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Millet Essentials & Value Combos
          </h2>
        </div>
        <Link
          href="/shop?category=other-grains-millets"
          className="text-xs font-black text-[#A50025] hover:text-[#E66001] flex items-center gap-1 transition"
        >
          <span>View All Bundles →</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {collections.map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-3xl overflow-hidden min-h-[320px] flex flex-col justify-between p-6 border border-[#E5E7EB] shadow-xs group bg-[#111827] text-white"
          >
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-108 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/65 to-transparent" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs"
                style={{ backgroundColor: item.badgeBg }}
              >
                <Tag className="w-3 h-3" /> {item.tag}
              </span>
              <div className="flex items-baseline gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl">
                <span className="text-sm font-black text-amber-300">{item.price}</span>
                <span className="text-[11px] text-slate-400 line-through">{item.originalPrice}</span>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-2 pt-12">
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 font-medium line-clamp-2">
                {item.subtitle}
              </p>
              <div className="pt-2">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#111827] hover:bg-[#A50025] hover:text-white text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Shop Bundle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
