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
    message.success('Thank you for subscribing to Vistora Gazette!');
    setEmail('');
  };

  return (
    <section className="bg-maroon text-white rounded-2xl p-6 sm:p-10 border border-maroon-dark shadow-md relative overflow-hidden my-10">
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-orange/20 blur-3xl" />

      <div className="relative z-10 max-w-xl mx-auto text-center space-y-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/90 bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-md">
          Stay Updated
        </span>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Subscribe for Exclusive Offers
        </h2>

        <p className="text-xs text-white/90 font-medium leading-relaxed">
          Be the first to get new arrivals, flash sale alerts, and promo coupon codes directly in your inbox.
        </p>

        {subscribed ? (
          <div className="p-3 bg-emerald-900/80 border border-emerald-700 text-emerald-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Thank you! You are subscribed to Vistora updates.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-1">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-transparent rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange hover:bg-orange-dark text-white font-extrabold text-xs uppercase tracking-wider transition whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
