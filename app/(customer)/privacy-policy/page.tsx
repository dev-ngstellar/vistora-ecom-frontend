'use client';

import React from 'react';
import { brandConfig } from '@/config';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="text-center space-y-3 pt-6 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Legal Merchant: {brandConfig.merchantLegalName} • Last Updated: September 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">1. Information We Collect</h2>
          <p>
            <strong>{brandConfig.merchantLegalName}</strong> respects your privacy. When you browse our marketplace, create an account, or place an order, we collect information necessary to fulfill your purchases and provide support. This includes your name, shipping address, email address, phone number, and transaction identifiers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">2. How We Use Your Data</h2>
          <p>
            Your information is used strictly to process orders, generate invoices, send live SMS/Email dispatch and tracking status, prevent fraudulent activities, and provide customer support. We do not sell or rent your personal data to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">3. Data Security & Payment Protection</h2>
          <p>
            All payment transactions are encrypted using industry-standard 256-bit SSL/TLS protocol and processed directly through certified PCI-DSS compliant payment gateways (such as Razorpay). Card, NetBanking, and UPI sensitive credentials are never stored on our application servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">4. Cookies & Browser Preferences</h2>
          <p>
            We use essential cookies to maintain shopping cart items, preserve your logged-in session, and store user preferences. You can configure cookie permissions in your web browser settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">5. Grievance Redressal & Contact Officer</h2>
          <p>
            In accordance with Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules and applicable consumer protection guidelines, if you have any questions or concerns regarding your privacy:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-slate-700">
            <p><strong>Merchant:</strong> {brandConfig.merchantLegalName}</p>
            <p><strong>Physical Address:</strong> {brandConfig.officialAddress}</p>
            <p><strong>Grievance Officer:</strong> {brandConfig.grievanceOfficer.name}</p>
            <p><strong>Grievance Email:</strong> <a href={`mailto:${brandConfig.grievanceOfficer.email}`} className="text-[#A50025] font-semibold hover:underline">{brandConfig.grievanceOfficer.email}</a></p>
            <p><strong>Customer Helpline:</strong> {brandConfig.contactPhone} ({brandConfig.supportHours})</p>
            <p><strong>Jurisdiction:</strong> {brandConfig.governingJurisdiction}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

