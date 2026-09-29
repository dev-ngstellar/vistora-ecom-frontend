'use client';

import React from 'react';
import { brandConfig } from '@/config';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="text-center space-y-3 pt-6 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Legal Merchant: {brandConfig.merchantLegalName} • Last Updated: September 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">1. About the Platform & Merchant Identification</h2>
          <p>
            This website and online storefront are owned and operated by <strong>{brandConfig.merchantLegalName}</strong> having its registered physical address at <strong>{brandConfig.officialAddress}</strong>. By accessing our platform, registering an account, or placing an order, you agree to comply with and be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">2. Serviceable Area & Order Acceptance</h2>
          <p>
            Vistora accepts and delivers orders <strong>Pan India</strong>, subject to the serviceability of the customer's PIN code by our logistics partners. We reserve the right to decline or cancel orders in non-serviceable geographic locations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">3. Pricing, Payments & Taxes</h2>
          <p>
            All prices listed on the platform are in Indian Rupees (INR) and are inclusive of applicable GST unless explicitly stated otherwise. Online payments are processed through secure payment gateway partners (such as Razorpay). We accept major credit/debit cards, UPI, NetBanking, and Cash on Delivery (COD) for eligible locations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">4. Dispatch SLA & Delivery Timelines</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Dispatch SLA:</strong> Orders will be dispatched within <strong>2–3 business days</strong> after successful order confirmation and payment.</li>
            <li><strong>Delivery Timeline:</strong> Orders are generally delivered within <strong>2–5 business days</strong> after dispatch, depending on the delivery destination.</li>
            <li><strong>Delivery Charges:</strong> Calculated based on location, package weight, and order value at checkout. <strong>Free door delivery</strong> is provided within <strong>Komarapalayam and Bhavani</strong>.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">5. Order Cancellation Policy</h2>
          <p>
            Customers can cancel their orders at any time <strong>before the order is dispatched</strong>. Once an order has been dispatched, cancellation is not permitted. <strong>No cancellation charges</strong> will apply for cancellations made prior to dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">6. Return, Replacement & 24-Hour Reporting Window</h2>
          <p>
            For grocery, grains, millets, and food products, customers must report any damaged, incorrect, missing, expired, tampered, or quality-related issue within <strong>24 hours of delivery</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Wrong product:</strong> Report within 24 hours with a clear photo/video for replacement.</li>
            <li><strong>Missing product:</strong> Report within 24 hours with a clear unboxing video showing package contents.</li>
            <li><strong>Expired product:</strong> Report within 24 hours with clear photo evidence of expiry date.</li>
            <li><strong>Damaged/Tampered packaging:</strong> Report within 24 hours with photo/video of outer box and tamper.</li>
            <li><strong>Opened/used product:</strong> Returns/replacements are not accepted if opened or used, except in verified quality/safety cases.</li>
          </ul>
          <p>
            See our complete <Link href="/cancellation-refund" className="text-[#A50025] font-bold hover:underline">Cancellation & Refund Policy</Link> for detailed steps.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">7. Refund Processing SLA</h2>
          <p>
            Approved refunds will be processed within <strong>5–7 business days</strong> after inspection approval. The reflection time in the customer's account may vary depending on their bank or payment provider.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">8. Grievance Officer & Customer Support</h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <p><strong>Customer Support:</strong> {brandConfig.contactPhone} ({brandConfig.supportHours})</p>
            <p><strong>Support Email:</strong> <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#A50025] font-semibold hover:underline">{brandConfig.supportEmail}</a></p>
            <p><strong>Grievance Officer:</strong> {brandConfig.grievanceOfficer.name} (<a href={`mailto:${brandConfig.grievanceOfficer.email}`} className="text-[#A50025] font-semibold hover:underline">{brandConfig.grievanceOfficer.email}</a>)</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">9. Governing Law & Jurisdiction</h2>
          <p>
            These Terms of Service and any transactional disputes arising out of your purchases on Vistora shall be governed by the laws of India. All disputes are subject to the exclusive jurisdiction of the <strong>{brandConfig.governingJurisdiction}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}

