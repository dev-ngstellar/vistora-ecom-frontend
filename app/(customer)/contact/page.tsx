'use client';

import React, { useState } from 'react';
import { brandConfig } from '@/config';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '@/services/contact.service';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateContactForm = () => {
    const errs: Record<string, string> = {};
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      errs.name = 'Full name is required';
    } else if (/\d/.test(trimmedName)) {
      errs.name = 'Name cannot contain numbers';
    } else if (trimmedName.length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    const trimmedSubject = form.subject.trim();
    if (!trimmedSubject) {
      errs.subject = 'Subject is required';
    } else if (trimmedSubject.length < 3) {
      errs.subject = 'Subject must be at least 3 characters';
    }

    const trimmedMessage = form.message.trim();
    if (!trimmedMessage) {
      errs.message = 'Message is required';
    } else if (trimmedMessage.length < 10) {
      errs.message = 'Please provide a message of at least 10 characters';
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContactForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const first = Object.values(errs)[0];
      toast.error(first || 'Please fill in all required fields correctly');
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    try {
      await contactService.submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSubmitted(true);
      toast.success('Thank you! Your message has been sent to Vistora Customer Support.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send message. Please try again or call our support.');
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="p-3 rounded-2xl bg-[#FFF0F3] text-[#A50025] shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Email Support</span>
              <a href={`mailto:${brandConfig.supportEmail}`} className="text-xs font-bold text-[#A50025] hover:underline block">
                {brandConfig.supportEmail}
              </a>
              <span className="text-[11px] text-slate-500">Replies within 24 business hours</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#FFF0F3] text-[#A50025] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Customer Helpline</span>
              <a href={`tel:${brandConfig.supportPhone}`} className="text-xs font-bold text-slate-900 block">
                {brandConfig.contactPhone}
              </a>
              <span className="text-[11px] text-slate-500">{brandConfig.supportHours}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#FFF0F3] text-[#A50025] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Registered Address</span>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                {brandConfig.merchantLegalName}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                {brandConfig.officialAddress}
              </p>
            </div>
          </div>

          {/* Grievance Redressal Card */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1.5 text-xs">
            <span className="text-[10px] font-extrabold text-[#E66001] uppercase tracking-wider block">
              Grievance Redressal Officer
            </span>
            <p className="font-extrabold text-slate-900">{brandConfig.grievanceOfficer.name}</p>
            <p className="text-slate-600">
              Email: <a href={`mailto:${brandConfig.grievanceOfficer.email}`} className="text-[#A50025] font-semibold hover:underline">{brandConfig.grievanceOfficer.email}</a>
            </p>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              Jurisdiction: {brandConfig.governingJurisdiction}
            </p>
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
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors((prev) => { const u = { ...prev }; delete u.name; return u; });
                    }}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-2.5 rounded-2xl border text-xs font-semibold text-slate-900 transition focus:outline-none ${
                      errors.name
                        ? 'bg-rose-50/30 border-rose-400 focus:border-rose-500 ring-1 ring-rose-400'
                        : 'bg-slate-50 border-slate-200 focus:border-maroon'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1">⚠ {errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors((prev) => { const u = { ...prev }; delete u.email; return u; });
                    }}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-2.5 rounded-2xl border text-xs font-semibold text-slate-900 transition focus:outline-none ${
                      errors.email
                        ? 'bg-rose-50/30 border-rose-400 focus:border-rose-500 ring-1 ring-rose-400'
                        : 'bg-slate-50 border-slate-200 focus:border-maroon'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1">⚠ {errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject *</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => {
                    setForm({ ...form, subject: e.target.value });
                    if (errors.subject) setErrors((prev) => { const u = { ...prev }; delete u.subject; return u; });
                  }}
                  placeholder="Order Inquiry, Product Information..."
                  className={`w-full px-4 py-2.5 rounded-2xl border text-xs font-semibold text-slate-900 transition focus:outline-none ${
                    errors.subject
                      ? 'bg-rose-50/30 border-rose-400 focus:border-rose-500 ring-1 ring-rose-400'
                      : 'bg-slate-50 border-slate-200 focus:border-maroon'
                  }`}
                />
                {errors.subject && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1">⚠ {errors.subject}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message *</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    if (errors.message) setErrors((prev) => { const u = { ...prev }; delete u.message; return u; });
                  }}
                  placeholder="Write your message here (min 10 characters)..."
                  className={`w-full px-4 py-2.5 rounded-2xl border text-xs font-semibold text-slate-900 transition focus:outline-none ${
                    errors.message
                      ? 'bg-rose-50/30 border-rose-400 focus:border-rose-500 ring-1 ring-rose-400'
                      : 'bg-slate-50 border-slate-200 focus:border-maroon'
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1">⚠ {errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-maroon hover:bg-maroon-dark disabled:opacity-70 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending to Vistora Support...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
