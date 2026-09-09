'use client';

import React from 'react';
import { Leaf, ShieldCheck, Flame, PackageCheck, Award, Sparkles } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Leaf,
      title: 'Direct Organic Sourcing',
      description: 'Cultivated naturally by traditional organic farmer collectives in Tamil Nadu & Andhra using heritage farming methods.',
      badge: 'Single Origin',
      color: '#15803D',
      bgLight: '#F0FDF4',
    },
    {
      step: '02',
      icon: Flame,
      title: 'Slow Cold Stone Grinding',
      description: 'Traditional slow-speed stone mills keep milling temperatures below 40°C, preserving 100% of volatile aromatic oils & nutrients.',
      badge: 'Essential Oils Locked',
      color: '#C2410C',
      bgLight: '#FFF7ED',
    },
    {
      step: '03',
      icon: ShieldCheck,
      title: 'Zero Fillers or Additives',
      description: 'Zero MSG, zero sawdust/starch fillers, zero added synthetic dyes. Tested rigorously in certified food labs for purity.',
      badge: '100% Pure & Lab Tested',
      color: '#A50025',
      bgLight: '#FFF0F3',
    },
    {
      step: '04',
      icon: PackageCheck,
      title: 'Aroma-Lock Fresh Packing',
      description: 'Packaged in multi-layer food-grade barrier pouches directly after milling to deliver farm-fresh scent to your kitchen.',
      badge: 'Freshness Guaranteed',
      color: '#1E293B',
      bgLight: '#F8FAFC',
    },
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E0D6] shadow-xs my-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-[#15803D]/10 text-[#15803D]">
          <Sparkles className="w-3.5 h-3.5" /> The Vistora Purity Standard
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#1C1917] tracking-tight">
          How We Bring Authentic Purity To Your Kitchen
        </h2>
        <p className="text-xs sm:text-sm text-[#78716C] font-medium">
          Say goodbye to stale supermarket chemicals. Every grain, spice batch, and porridge mix adheres to uncompromised traditional standards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {steps.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="relative flex flex-col justify-between p-5 rounded-2xl border border-[#E7E0D6] bg-[#FAF7F2] hover:bg-white hover:border-[#1C1917]/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: item.bgLight, color: item.color }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-[#D6CEBF] group-hover:text-[#1C1917] transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                    style={{ backgroundColor: item.bgLight, color: item.color }}
                  >
                    {item.badge}
                  </span>
                  <h3 className="text-base font-black text-[#1C1917] tracking-tight leading-snug">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-[#57534E] font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
