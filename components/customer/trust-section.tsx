'use client';

import React from 'react';
import { ShieldCheck, Store, Lock, Truck } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'Curated Products',
      description: 'Thoughtfully selected products from our marketplace.',
    },
    {
      icon: Store,
      title: 'Trusted Sellers',
      description: 'Products sourced from verified marketplace sellers.',
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'Safe and encrypted checkout experience.',
    },
    {
      icon: Truck,
      title: 'Reliable Delivery',
      description: 'Your order delivered safely to your doorstep.',
    },
  ];

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs my-6">
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 space-y-1">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#A50025]">
          The Vistora Guarantee
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
          Why Shop With Vistora?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trustItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] hover:border-[#A50025]/30 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFF0F3] text-[#A50025] flex items-center justify-center mb-3">
                <IconComp className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-extrabold text-[#111827] mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#64748B] font-normal leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
