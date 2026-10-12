'use client';

import React from 'react';
import { Sparkles, Mail, Phone, Clock, ShieldCheck } from 'lucide-react';
import { brandConfig } from '@/config';

export function ComingSoonContent() {
  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 selection:bg-[#E66001] selection:text-white relative overflow-hidden flex flex-col justify-between font-sans">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-[#A50025]/25 via-[#E66001]/15 to-transparent blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E66001]/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#A50025]/10 blur-[150px] rounded-full" />

      {/* Subtle Pattern Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />

      {/* Top Brand Bar (Notice: No links to site) */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#A50025] to-[#E66001] flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#A50025]/30">
            {brandConfig.logoLetter}
          </div>
          <div>
            <span className="font-extrabold tracking-wider text-xl text-white block leading-tight">
              {brandConfig.shortName}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {brandConfig.tagline}
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-300">
          <span className="w-2 h-2 rounded-full bg-[#E66001] animate-pulse" />
          <span>Temporary Pause</span>
        </div>
      </header>

      {/* Center Hero Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-2xl text-center">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md text-xs sm:text-sm font-semibold text-amber-300 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#E66001]" />
            <span>Under Scheduled Maintenance & Enhancements</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
            We Will Be{' '}
            <span className="bg-gradient-to-r from-[#FF7A1A] via-[#FFAA47] to-[#FF4E78] bg-clip-text text-transparent">
              Back Soon.
            </span>
          </h1>

          {/* Message */}
          <p className="text-slate-300 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10">
            Our online store is temporarily paused while we perform system upgrades and restock our collections. Thank you for your patience.
          </p>

          {/* Support Information Box */}
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-left max-w-lg mx-auto">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Need Assistance With Existing Orders?
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Customer Support Email</div>
                  <a
                    href={`mailto:${brandConfig.supportEmail}`}
                    className="font-medium text-white hover:text-amber-400 transition-colors"
                  >
                    {brandConfig.supportEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Direct Telephone Support</div>
                  <a
                    href={`tel:${brandConfig.supportPhone}`}
                    className="font-medium text-white hover:text-amber-400 transition-colors"
                  >
                    +91 {brandConfig.supportPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Support Working Hours</div>
                  <div className="text-white font-medium">{brandConfig.supportHours}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer (No links to site) */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 border-t border-white/10 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500">
        <div>
          {brandConfig.merchantLegalName}
        </div>
        <div className="mt-2 sm:mt-0 text-slate-400">
          All pending orders are being processed as normal.
        </div>
      </footer>
    </div>
  );
}
