'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <div className="text-center space-y-3 pt-6 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: August 2026 • Vistora Commerce Group
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            Vistora respects your privacy. When you browse our marketplace, create an account, or place an order, we collect information necessary to fulfill your purchases and personalize your shopping experience. This includes your name, shipping address, email address, phone number, and payment details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. How We Use Your Data</h2>
          <p>
            Your information is used strictly to process orders, send delivery status updates, prevent fraudulent transactions, and provide customer support. We do not sell or rent your personal information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Data Security & Encryption</h2>
          <p>
            All payment transactions and user credentials are encrypted using industry-standard SSL/TLS protocol. Financial details are processed securely by payment gateways and are never stored directly on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Cookies & Preferences</h2>
          <p>
            We use cookies to maintain your shopping cart items, remember active login sessions, and save currency/language preferences. You can disable cookies in your browser settings at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Contact Privacy Officer</h2>
          <p>
            If you have questions regarding our privacy practices or wish to request data deletion, please contact our support team at support@vistora.com.
          </p>
        </section>
      </div>
    </div>
  );
}
