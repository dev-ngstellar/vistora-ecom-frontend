'use client';

import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 't-1',
      name: 'Priya Sundaram',
      location: 'Chennai, TN',
      comment: 'The MST Krishna Pet traditional saree has stunning zari border craft. The handloom texture feels incredibly authentic and rich.',
      rating: 5,
    },
    {
      id: 't-2',
      name: 'Ananya Deshmukh',
      location: 'Mumbai, MH',
      comment: 'Vistora Velvet Matte Lipstick in Dusty Nude Pink is non-drying and lasts all day. Loved the sleek packaging and quick delivery!',
      rating: 5,
    },
    {
      id: 't-3',
      name: 'Meera Iyer',
      location: 'Bengaluru, KA',
      comment: 'Bbloom VNatura Under Eye Cream corrected dark circles within 2 weeks! Genuine 100% natural product. Super happy with Vistora.',
      rating: 5,
    },
  ];

  return (
    <section className="space-y-4 my-6">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#A50025]">
            Verified Customer Reviews
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
            Customer Reviews
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#E66001]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#E66001] text-[#E66001]" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Buyer
                </span>
              </div>
              <p className="text-xs text-[#111827] font-medium leading-relaxed">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-[#111827] text-xs">{item.name}</h4>
                <span className="text-[10px] text-[#64748B] font-semibold">{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
