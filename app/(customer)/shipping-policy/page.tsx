'use client';

import React from 'react';
import { brandConfig } from '@/config';
import { Truck, Clock, MapPin, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPolicyPage() {
  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pt-6 border-b border-slate-200 pb-6">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#E66001] bg-[#FFF0E6] px-3 py-1 rounded-full">
          Logistics & Fulfillment
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto">
          {brandConfig.merchantLegalName} • Direct Fulfillment & Pan India Delivery
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] text-[#A50025] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Dispatch SLA</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Orders are dispatched within <strong>2–3 business days</strong> after payment confirmation.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#E66001] flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Delivery Timeline</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Delivered within <strong>2–5 business days</strong> post-dispatch depending on your location.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Local Free Delivery</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Free door delivery</strong> is available across <strong>Komarapalayam and Bhavani</strong>.
          </p>
        </div>
      </div>

      {/* Policy Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
            Serviceable Areas
          </h2>
          <p>
            <strong>{brandConfig.merchantLegalName}</strong> accepts and delivers orders <strong>Pan India</strong>, subject to courier and logistics serviceability of the customer's PIN code. During checkout, entering your 6-digit postal PIN code will verify delivery availability in your area.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
            Order Dispatch SLA
          </h2>
          <p>
            All confirmed orders are processed, packaged in tamper-evident food-grade containers, and dispatched within <strong>2–3 business days</strong> from our central processing facility. Orders placed on Sundays or public holidays are scheduled for dispatch on the next working day.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">3</span>
            Delivery Timelines
          </h2>
          <p>
            Once dispatched, orders are generally delivered within <strong>2–5 business days</strong>. While we partner with tier-1 logistics providers for prompt transit, delivery times may be subject to unforeseen local courier disruptions, weather anomalies, or remote zone constraints.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">4</span>
            Delivery Fees & Free Shipping Policy
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Free Door Delivery:</strong> Available for all orders destined within <strong>Komarapalayam and Bhavani</strong> regions.
            </li>
            <li>
              <strong>Standard Delivery Fee:</strong> For all other locations across Tamil Nadu and Pan India, shipping charges are dynamically calculated based on package deadweight/volumetric weight, destination PIN code, and order total, transparently displayed prior to final payment at checkout.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">5</span>
            Order Tracking & Live Status
          </h2>
          <p>
            Once your order is handed over to our shipping partner, you will receive an automated tracking notification with an active tracking link via SMS/Email. You can also monitor real-time order progression in the <Link href="/orders" className="text-[#A50025] font-bold hover:underline">My Orders</Link> section.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
            Merchant & Shipping Support
          </h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <p><strong>Merchant:</strong> {brandConfig.merchantLegalName}</p>
            <p><strong>Fulfillment Center:</strong> {brandConfig.officialAddress}</p>
            <p><strong>Support Email:</strong> <a href={`mailto:${brandConfig.supportEmail}`} className="text-[#A50025] font-semibold hover:underline">{brandConfig.supportEmail}</a></p>
            <p><strong>Customer Helpline:</strong> <a href={`tel:${brandConfig.supportPhone}`} className="text-[#A50025] font-semibold hover:underline">{brandConfig.contactPhone}</a> ({brandConfig.supportHours})</p>
          </div>
        </section>
      </div>
    </div>
  );
}
