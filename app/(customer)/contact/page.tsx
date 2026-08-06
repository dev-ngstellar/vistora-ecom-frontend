'use client';

import React, { useState } from 'react';
import { brandConfig } from '@/config';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Thank you! Your message has been sent to Vistora Customer Support.');
  };

  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      <div className="text-center space-y-3 pt-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact Vistora Support
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Have questions about your order, shipping, or products? We are here to help 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-maroon-light text-maroon shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Email Us</span>
              <span className="text-xs font-bold text-slate-900">{brandConfig.supportEmail}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-maroon-light text-maroon shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Call Toll Free</span>
              <span className="text-xs font-bold text-slate-900">{brandConfig.contactPhone}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-maroon-light text-maroon shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Headquarters</span>
              <span className="text-xs font-bold text-slate-900 leading-snug block">Vistora Commerce Tower, High Street, India</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Our support team will review your inquiry and respond within 24 business hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-maroon"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-maroon"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Order Inquiry, Product Information..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-maroon"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-maroon"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-maroon hover:bg-maroon-dark text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
