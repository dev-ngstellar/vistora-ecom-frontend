'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
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
    message.success('Thank you for subscribing to Vistora!');
    setEmail('');
  };

  return (
    <section className="bg-[#A50025] text-white rounded-2xl p-6 sm:p-8 border border-[#7D001C] shadow-xs my-6">
      <div className="max-w-xl mx-auto text-center space-y-3">
        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
          Get the latest from Vistora
        </h2>

        <p className="text-xs sm:text-sm text-slate-100 font-medium">
          New arrivals, offers and exclusive deals.
        </p>

        {subscribed ? (
          <div className="p-3 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold">
            <CheckCircle2 className="w-4 h-4 text-[#E66001]" />
            <span>Thank you! You are now subscribed to Vistora updates.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto pt-1">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white text-[#111827] placeholder-slate-400 rounded-xl text-xs font-bold border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E66001] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E66001] hover:bg-[#B84D01] text-white text-xs font-extrabold transition-all shadow-xs shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
