'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

import { brandConfig, navigationConfig, socialConfig } from '@/config';

export const CustomerFooter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success(`Thank you for subscribing to ${brandConfig.name} newsletter!`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      {/* Value Proposition Highlights Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-3 rounded-xl bg-orange/20 text-orange">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Complimentary shipping on orders over {brandConfig.currency.symbol}150</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-3 rounded-xl bg-maroon/20 text-maroon-light">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">30-day money back return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">100% Authentic</h4>
              <p className="text-xs text-slate-400 mt-0.5">Guaranteed genuine luxury apparel</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">24/7 VIP Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated customer care assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src={brandConfig.logoUrl}
                alt="Vistora Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-white">{brandConfig.shortName}</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-orange">STOREFRONT</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {brandConfig.tagline}
            </p>

            <form onSubmit={handleSubscribe} className="pt-2">
              <span className="text-xs font-semibold text-slate-200 block mb-2">Subscribe to VIP Catalog Alerts</span>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="flex-1 bg-white/10 border border-white/15 px-3.5 py-2 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange"
                />
                <button
                  type="submit"
                  className="bg-orange hover:bg-orange-dark text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </div>
            </form>
          </div>

          {/* Dynamic Footer Link Groups */}
          {Object.entries(navigationConfig.footerGroups).map(([groupKey, group]) => (
            <div key={groupKey} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{group.title}</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-indigo-400 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Copyright & Social */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>{brandConfig.copyright}</p>
        <div className="flex items-center space-x-4">
          {socialConfig.links.instagram && (
            <a href={socialConfig.links.instagram} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {socialConfig.links.facebook && (
            <a href={socialConfig.links.facebook} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {socialConfig.links.twitter && (
            <a href={socialConfig.links.twitter} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {socialConfig.links.linkedin && (
            <a href={socialConfig.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};
