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
    <section className="space-y-6 my-16">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Patron Testimonials</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-900 dark:text-white">
          Voices of Discerning Clientele
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <Quote className="w-8 h-8 text-indigo-200 dark:text-indigo-900" />
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic font-light leading-relaxed">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{item.name}</h4>
              <span className="text-[11px] text-slate-400">{item.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
