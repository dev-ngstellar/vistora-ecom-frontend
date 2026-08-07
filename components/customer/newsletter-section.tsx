'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { message } from 'antd';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      message.error('Please enter a valid email address');
      return;
    }

    setSubscribed(true);
    message.success('Thank you for subscribing to Vistora VIP Gazette!');
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-br from-maroon-dark via-maroon to-slate-950 text-white rounded-3xl p-8 sm:p-14 border border-white/10 shadow-2xl relative overflow-hidden my-12">
      {/* Accent Glowing Blurs */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-orange/25 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-300 bg-white/15 px-3.5 py-1 rounded-full border border-white/20 backdrop-blur-md shadow-xs">
          VIP Catalog & Editorial Gazette
        </span>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Subscribe for Exclusive Offers
        </h2>

        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-lg mx-auto">
          Be the first to receive runway lookbooks, flash sales, private coupon drops, and luxury invitations directly in your inbox.
        </p>

        {subscribed ? (
          <div className="p-4 bg-emerald-900/80 border border-emerald-500 text-emerald-100 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-black shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Thank you! You have officially joined the Vistora VIP Directory.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-2">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-orange hover:bg-orange-dark text-white font-black text-xs uppercase tracking-wider transition-all hover:scale-102 whitespace-nowrap flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Join VIP</span>
              <ArrowRight className="w-4 h-4 text-amber-200" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
