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
    <section className="bg-slate-950 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl relative overflow-hidden my-16">
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-900/20 blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
          The Private Gazette
        </span>

        <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight text-white">
          Subscribe to Editorial Invitations
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          Be the first to receive private runway collection invitations, bespoke tailoring previews, and seasonal lookbook releases.
        </p>

        {subscribed ? (
          <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>You have been added to the Vistora Concierge Gazette list.</span>
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
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-slate-950 font-extrabold text-xs uppercase tracking-widest hover:bg-slate-100 transition whitespace-nowrap flex items-center justify-center gap-2"
            >
              <span>Join Gazette</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
