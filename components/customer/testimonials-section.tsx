'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 't-1',
      name: 'Aisha Sharma',
      role: 'Fashion Editor, Vogue Atelier',
      comment: 'Vistora’s silk velvet evening gown exceeded every expectation. The fit is impeccable, and the packaging reflects pure luxury.',
      rating: 5,
    },
    {
      id: 't-2',
      name: 'Rohan Mehta',
      role: 'Architect & Designer',
      comment: 'The cashmere tailored coat is an architectural masterpiece. The silhouette and warmth make it an essential winter garment.',
      rating: 5,
    },
    {
      id: 't-3',
      name: 'Elena Rostova',
      role: 'Haute Couture Collector',
      comment: 'Uncompromising quality and seamless concierge delivery across Mumbai. Vistora is truly redefining modern luxury eCommerce.',
      rating: 5,
    },
  ];

  return (
    <section className="space-y-6 my-10">
      <div className="text-center space-y-1.5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-maroon">Customer Feedback</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          What Our Shoppers Say
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-orange">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-orange text-orange" />
                ))}
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs">{item.name}</h4>
                <span className="text-[10px] text-slate-400">{item.role}</span>
              </div>
              <Quote className="w-6 h-6 text-maroon/20" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
