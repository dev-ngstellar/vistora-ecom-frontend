'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, HeartPulse, Baby, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  color: string;
  bgLight: string;
  badge: string;
  href: string;
  highlights: string[];
  image: string;
}

export const HealthGoalsSection: React.FC = () => {
  const [activeGoalId, setActiveGoalId] = useState('low-gi');

  const goals: Goal[] = [
    {
      id: 'low-gi',
      name: 'Low GI & Sugar Control',
      tagline: 'Unpolished Varagu (Kodo Millet), Saamai & Thinai with low glycemic index for stable glucose levels.',
      icon: HeartPulse,
      color: '#15803D',
      bgLight: '#F0FDF4',
      badge: 'Diabetic Friendly',
      href: '/shop?category=other-grains-millets',
      highlights: ['Unpolished Varagu & Little Millet', 'Foxtail Millet (Thinai)', 'Zero Chemical Polishing'],
      image: '/products-image all/millets/varugu front image_11zon.jpg.jpeg',
    },
    {
      id: 'immunity',
      name: 'Stamina & Anthocyanin Immunity',
      tagline: 'Ancient Karuppu Kavuni Black Rice and Mappillai Samba rich in anthocyanin antioxidants, iron & zinc.',
      icon: Activity,
      color: '#B45309',
      bgLight: '#FFFBEB',
      badge: 'High Antioxidants & Iron',
      href: '/shop?category=other-grains-millets',
      highlights: ['Karuppu Kavuni Black Rice', 'Mappillai Samba Heritage Red Rice', 'High Anthocyanin Content'],
      image: '/products-image all/millets/Black rice front image.jpg.jpeg',
    },
    {
      id: 'growth',
      name: 'Energy, Bone Health & Vitality',
      tagline: 'High-calcium native Kambu (Pearl Millet), Red Cholam & Horse Gram (Kollu) for natural vitality.',
      icon: Baby,
      color: '#A50025',
      bgLight: '#FFF0F3',
      badge: 'High Calcium & Plant Protein',
      href: '/shop?category=other-grains-millets',
      highlights: ['Traditional Pearl Millet (Kambu)', 'Organic Native Kollu (Horse Gram)', 'Red & White Cholam Whole Grains'],
      image: '/products-image all/millets/kambu front image.webp',
    },
  ];

  const activeGoal = goals.find((g) => g.id === activeGoalId) || goals[0];

  return (
    <section className="bg-[#FAF7F2] p-5 sm:p-8 rounded-3xl border border-[#E7E0D6] shadow-xs space-y-6 my-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E0D6] pb-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#15803D] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#15803D] fill-[#15803D]" />
            Wellness & Purpose
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
            Shop By Health Goal & Dietary Need
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] font-medium mt-1 max-w-xl">
            Pure nourishment tailored to your family's lifestyle—from low-glycemic millets to antioxidant heritage grains.
          </p>
        </div>

        <Link
          href="/shop?category=other-grains-millets"
          className="text-xs font-black text-[#A50025] hover:text-[#C2410C] flex items-center gap-1.5 transition shrink-0"
        >
          <span>Explore All Nutrition →</span>
        </Link>
      </div>

      {/* Goal Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {goals.map((goal) => {
          const IconComponent = goal.icon;
          const isSelected = goal.id === activeGoalId;

          return (
            <button
              key={goal.id}
              onClick={() => setActiveGoalId(goal.id)}
              className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#1C1917] shadow-md scale-[1.02]'
                  : 'bg-white/60 hover:bg-white border-[#E7E0D6] hover:border-[#D6CEBF]'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{ backgroundColor: goal.bgLight, color: goal.color }}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider block text-[#78716C]">
                  {goal.badge}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-[#1C1917] truncate leading-tight">
                  {goal.name}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Goal Showcase Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E7E0D6] shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-4 max-w-xl z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-xs"
            style={{ backgroundColor: activeGoal.bgLight, color: activeGoal.color }}
          >
            <span>🌿 {activeGoal.badge}</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-black text-[#1C1917] tracking-tight leading-snug">
            {activeGoal.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#57534E] font-medium leading-relaxed">
            {activeGoal.tagline}
          </p>

          <div className="space-y-2 pt-1">
            {activeGoal.highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#292524]">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <Link
              href={activeGoal.href}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#A50025] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md hover:scale-102"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Visual Preview */}
        <div className="relative w-full lg:w-[380px] h-[220px] sm:h-[260px] rounded-2xl overflow-hidden shadow-md border border-[#E7E0D6] shrink-0 group bg-slate-900">
          <img
            src={activeGoal.image}
            alt={activeGoal.name}
            className="w-full h-full object-contain p-2 group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-black flex items-center justify-between">
            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">100% Farm Fresh</span>
            <span className="text-amber-300">Pure & Tested</span>
          </div>
        </div>
      </div>
    </section>
  );
};
