'use client';

import React from 'react';
import { brandConfig } from '@/config';
import { RotateCcw, XCircle, AlertTriangle, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CancellationRefundPage() {
  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pt-6 border-b border-slate-200 pb-6">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#A50025] bg-[#FFF0F3] px-3 py-1 rounded-full">
          Customer Protection & Policies
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Cancellation, Return & Refund Policy
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto">
          {brandConfig.merchantLegalName} • Transparent, Fair & Customer-First Commitments
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Pre-Dispatch Cancellation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cancel any order <strong>before dispatch with zero cancellation charges</strong>.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] text-[#A50025] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">24-Hour Return Window</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Report quality, transit damages, or missing grocery items within <strong>24 hours of delivery</strong>.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#E66001] flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Refund SLA: 5–7 Days</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Approved refunds are credited back to your original payment method in <strong>5–7 business days</strong>.
          </p>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-7 text-xs text-slate-600 leading-relaxed">
        
        {/* Section 1: Order Cancellation */}
        <section className="space-y-3">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#A50025] text-white flex items-center justify-center text-xs">1</span>
            Order Cancellation Policy
          </h2>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <p>
              • <strong>Before Dispatch:</strong> Customers can cancel their orders at any time <em>before the order is dispatched</em> directly through the <Link href="/orders" className="text-[#A50025] font-bold hover:underline">My Orders</Link> dashboard or by reaching our customer care team. <strong>No cancellation charges</strong> will apply for cancellations made before dispatch, and full payments will be refunded immediately.
            </p>
            <p>
              • <strong>After Dispatch:</strong> Once an order has been handed over to the courier and dispatched from our facility, <strong>cancellation is not permitted</strong>.
            </p>
          </div>
        </section>

        {/* Section 2: Return / Replacement Window for Grocery & Grains */}
        <section className="space-y-3">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#A50025] text-white flex items-center justify-center text-xs">2</span>
            Return & Replacement Window for Grocery & Grains (24-Hour Policy)
          </h2>
          <p>
            Due to the perishable and hygiene-sensitive nature of organic grains, millets, spices, and groceries, customers must report any damaged, incorrect, missing, expired, tampered, or quality-related issues within <strong>24 hours of delivery</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h4 className="font-extrabold text-slate-900">Wrong Product Received</h4>
              <p className="text-slate-600">
                Customers must report the issue within 24 hours of delivery and provide a clear photo/video for verification. A replacement item will be dispatched immediately after verification.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h4 className="font-extrabold text-slate-900">Missing Product / Item</h4>
              <p className="text-slate-600">
                Customers must report the missing item within 24 hours of delivery and provide a clear <strong>unboxing video</strong> showing the parcel outer label and package contents for verification.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h4 className="font-extrabold text-slate-900">Expired Product</h4>
              <p className="text-slate-600">
                Customers must report the issue within 24 hours of delivery and provide a clear photo displaying the batch number and expiry date print.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <h4 className="font-extrabold text-slate-900">Damaged / Tampered Packaging</h4>
              <p className="text-slate-600">
                Customers must report the issue within 24 hours of delivery and provide clear photo/video proof showing the seal tampering or transit damage.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900">
            <strong>Opened / Used Products:</strong> Returns or replacements will generally not be accepted if the food package has been opened or consumed, except in verified cases of internal quality or safety defects.
          </div>
        </section>

        {/* Section 3: Refund Processing SLA */}
        <section className="space-y-3">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#A50025] text-white flex items-center justify-center text-xs">3</span>
            Refund Processing SLA
          </h2>
          <p>
            Approved refunds will be processed within <strong>5–7 business days</strong> after approval by our quality inspection team.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Online Payments (UPI, Cards, NetBanking via Razorpay):</strong> The refund amount is automatically credited back to the original funding account. The exact reflection timeline in your bank statement may vary between 3 to 7 banking days depending on your issuing bank.</li>
            <li><strong>Cash on Delivery (COD) Orders:</strong> In case of eligible COD returns, the customer will be requested to provide bank account / UPI details for a secure NEFT/IMPS bank transfer within 5–7 business days.</li>
          </ul>
        </section>

        {/* Section 4: How to Request a Return or Refund */}
        <section className="space-y-3">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#A50025] text-white flex items-center justify-center text-xs">4</span>
            How to File a Return / Replacement Request
          </h2>
          <p>
            To initiate a claim within the 24-hour delivery window, please contact our support team with your <strong>Order Number</strong>, <strong>Description of the Issue</strong>, and <strong>Photo/Unboxing Video evidence</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">Email Support</span>
              <a href={`mailto:${brandConfig.supportEmail}`} className="font-bold text-[#A50025] hover:underline">
                {brandConfig.supportEmail}
              </a>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">Customer Helpline</span>
              <a href={`tel:${brandConfig.supportPhone}`} className="font-bold text-[#A50025] hover:underline">
                {brandConfig.contactPhone} ({brandConfig.supportHours})
              </a>
            </div>
          </div>
        </section>

        {/* Section 5: Grievance Redressal & Jurisdiction */}
        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
            Grievance Redressal & Legal Jurisdiction
          </h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-slate-700">
            <p><strong>Merchant Entity:</strong> {brandConfig.merchantLegalName}</p>
            <p><strong>Registered Address:</strong> {brandConfig.officialAddress}</p>
            <p><strong>Grievance Officer:</strong> {brandConfig.grievanceOfficer.name}</p>
            <p><strong>Grievance Email:</strong> <a href={`mailto:${brandConfig.grievanceOfficer.email}`} className="text-[#A50025] font-semibold hover:underline">{brandConfig.grievanceOfficer.email}</a></p>
            <p><strong>Governing Jurisdiction:</strong> {brandConfig.governingJurisdiction}</p>
          </div>
        </section>

      </div>
    </div>
  );
}
