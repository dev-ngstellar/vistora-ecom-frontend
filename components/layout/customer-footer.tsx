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
    <footer className="bg-[#111827] text-white pt-16 pb-12 border-t border-slate-800">


      {/* Main 4-Column Footer Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand Info & VIP Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={brandConfig.logoUrl}
                alt="Vistora Logo"
                className="h-10 w-auto object-contain"
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              {brandConfig.tagline}
            </p>

            <form onSubmit={handleSubscribe} className="pt-2">
              <span className="text-xs font-extrabold text-white block mb-2">Subscribe to VIP Catalog Alerts</span>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="flex-1 bg-white/10 border border-white/15 px-4 py-2.5 rounded-[14px] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B5123B]"
                />
                <button
                  type="submit"
                  className="bg-[#B5123B] hover:bg-[#8E0E2E] text-white px-5 py-2.5 rounded-[14px] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </div>
            </form>
          </div>

          {/* Columns 2-4: Footer Link Groups */}
          {Object.entries(navigationConfig.footerGroups).map(([groupKey, group]) => (
            <div key={groupKey} className="space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">{group.title}</h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-[#B5123B] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Copyright & Social Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
        <p>{brandConfig.copyright}</p>
        <div className="flex items-center space-x-5">
          {socialConfig.links.instagram && (
            <a href={socialConfig.links.instagram} target="_blank" rel="noreferrer" className="hover:text-[#B5123B] transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {socialConfig.links.facebook && (
            <a href={socialConfig.links.facebook} target="_blank" rel="noreferrer" className="hover:text-[#B5123B] transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {socialConfig.links.twitter && (
            <a href={socialConfig.links.twitter} target="_blank" rel="noreferrer" className="hover:text-[#B5123B] transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {socialConfig.links.linkedin && (
            <a href={socialConfig.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#B5123B] transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};
