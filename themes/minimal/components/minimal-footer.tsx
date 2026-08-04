'use client';

import React from 'react';
import Link from 'next/link';
import { brandConfig, navigationConfig, socialConfig } from '@/config';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export const MinimalFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">{brandConfig.name}</h3>
            <p className="text-slate-500 leading-relaxed max-w-xs">{brandConfig.tagline}</p>
          </div>

          {/* Dynamic Link Groups */}
          {Object.entries(navigationConfig.footerGroups).map(([groupKey, group]) => (
            <div key={groupKey} className="space-y-3">
              <h4 className="font-bold uppercase text-[11px] tracking-wider text-slate-900">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-slate-900 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{brandConfig.copyright}</p>
          <div className="flex items-center gap-4 text-slate-400">
            {socialConfig.links.instagram && (
              <a href={socialConfig.links.instagram} target="_blank" rel="noreferrer" className="hover:text-slate-900">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {socialConfig.links.facebook && (
              <a href={socialConfig.links.facebook} target="_blank" rel="noreferrer" className="hover:text-slate-900">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {socialConfig.links.twitter && (
              <a href={socialConfig.links.twitter} target="_blank" rel="noreferrer" className="hover:text-slate-900">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {socialConfig.links.linkedin && (
              <a href={socialConfig.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-slate-900">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
