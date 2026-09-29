'use client';

import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { brandConfig } from '@/config';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does dispatch and delivery take?',
      a: `Orders are dispatched within 2–3 business days after payment confirmation. After dispatch, deliveries generally take 2–5 business days across Pan India depending on the destination PIN code.`,
    },
    {
      q: 'Where do you offer Free Delivery?',
      a: 'We provide Free Door Delivery for all orders within Komarapalayam and Bhavani. For other locations, nominal shipping charges are calculated based on weight and PIN code at checkout.',
    },
    {
      q: 'Can I cancel my order?',
      a: 'Yes! You can cancel your order at any time before it is dispatched with zero cancellation fees. Once dispatched with our logistics partner, cancellations cannot be processed.',
    },
    {
      q: 'What is your Return / Replacement policy for Grocery & Grains?',
      a: 'Due to the freshness and food safety of grocery and grains, any damaged, incorrect, missing, expired, or tampered product must be reported within 24 hours of delivery with photo/video proof (or unboxing video for missing items). A replacement or refund will be issued promptly after verification.',
    },
    {
      q: 'How long does a refund take to process?',
      a: 'Approved refunds are initiated within 5–7 business days to your original payment method (Bank/UPI/Card via Razorpay). Reflection in your bank account depends on your issuing bank.',
    },
    {
      q: 'What are your customer support contact details and hours?',
      a: `Our customer support helpline (${brandConfig.contactPhone}) and email (${brandConfig.supportEmail}) are active from ${brandConfig.supportHours} every day.`,
    },
  ];


  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <div className="text-center space-y-3 pt-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500">
          Everything you need to know about shopping, shipping, returns, and payments on Vistora.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-maroon shrink-0" />
              {faq.q}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-3xl p-6 text-center space-y-2 border border-slate-200">
        <p className="text-xs font-bold text-slate-700">Still have questions?</p>
        <Link href="/contact" className="text-xs font-extrabold text-maroon hover:underline">
          Contact Vistora Concierge Support →
        </Link>
      </div>
    </div>
  );
}
