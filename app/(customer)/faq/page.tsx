'use client';

import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { brandConfig } from '@/config';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does shipping take for Vistora orders?',
      a: `Standard shipping takes 3-5 business days nationwide. Express delivery arrives within 1-2 business days. Orders over ${brandConfig.currency.symbol}150 qualify for FREE Express Shipping.`,
    },
    {
      q: 'Can I shop and add items to cart without logging in?',
      a: 'Yes! Vistora offers a 100% public shopping experience. You can browse, search, view product details, and manage your cart freely as a guest visitor.',
    },
    {
      q: 'When is login required?',
      a: 'Authentication is only requested when performing protected actions such as Proceeding to Checkout, viewing My Orders, or accessing Saved Addresses.',
    },
    {
      q: 'What is Vistora’s return policy?',
      a: 'We offer a 30-day hassle-free return and exchange policy on all eligible items. Items must be in original condition with tags attached.',
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept all major credit/debit cards (Visa, MasterCard, American Express), Net Banking, UPI, Cash on Delivery (COD), and digital wallets.',
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
