'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <div className="text-center space-y-3 pt-6 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: August 2026 • Vistora Commerce Group
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or placing an order on Vistora, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our marketplace platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Marketplace Purchases & Pricing</h2>
          <p>
            All product prices, availability, and promotional offers displayed on Vistora are subject to change without prior notice. Vistora reserves the right to cancel orders resulting from typographical or pricing errors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Order Fulfillment & Delivery</h2>
          <p>
            Estimated delivery dates are provided for guidance only. Vistora is not liable for logistics delays caused by weather conditions, customs processing, or incorrect customer shipping addresses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. User Conduct & Accounts</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their account credentials. Any unauthorized activity performed using your account must be reported to Vistora support immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
