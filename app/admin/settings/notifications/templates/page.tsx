'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/config/section-header';
import { FileText, Plus, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Template {
  id: string;
  event: string;
  channel: string;
  subject: string;
  body: string;
  variables: string[];
  enabled: boolean;
}

const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'order-confirmed-email',
    event: 'Order Confirmed',
    channel: 'EMAIL',
    subject: 'Your Vistora Order #{{order_number}} is Confirmed!',
    body: `Hi {{customer_name}},\n\nThank you for your order! We're preparing your luxury items with care.\n\nOrder: #{{order_number}}\nTotal: {{order_total}}\nEstimated Delivery: {{delivery_date}}\n\nYou can track your order at: {{tracking_url}}\n\nWarm Regards,\nVistora Commerce Team`,
    variables: ['customer_name', 'order_number', 'order_total', 'delivery_date', 'tracking_url'],
    enabled: true,
  },
  {
    id: 'order-shipped-email',
    event: 'Order Shipped',
    channel: 'EMAIL',
    subject: 'Your order #{{order_number}} has been shipped! 📦',
    body: `Hi {{customer_name}},\n\nGreat news! Your order is on its way.\n\nTracking ID: {{tracking_id}}\nCarrier: {{carrier_name}}\nExpected Delivery: {{delivery_date}}\n\nTrack here: {{tracking_url}}\n\nVistora Commerce`,
    variables: ['customer_name', 'order_number', 'tracking_id', 'carrier_name', 'delivery_date', 'tracking_url'],
    enabled: true,
  },
  {
    id: 'password-reset-email',
    event: 'Password Reset',
    channel: 'EMAIL',
    subject: 'Reset your Vistora Commerce password',
    body: `Hi {{customer_name}},\n\nWe received a request to reset your password.\n\nClick here to reset: {{reset_url}}\n\nThis link expires in 1 hour. If you did not request this, please ignore this email.\n\nVistora Commerce`,
    variables: ['customer_name', 'reset_url'],
    enabled: true,
  },
  {
    id: 'order-confirmed-sms',
    event: 'Order Confirmed',
    channel: 'SMS',
    subject: '',
    body: 'Vistora: Your order #{{order_number}} of {{order_total}} is confirmed. Delivery by {{delivery_date}}. Track: {{tracking_url}}',
    variables: ['order_number', 'order_total', 'delivery_date', 'tracking_url'],
    enabled: false,
  },
];

export default function NotificationTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_TEMPLATES[0].id);
  const [previewOpen, setPreviewOpen] = useState(false);

  const current = templates.find((t) => t.id === selectedId);

  const updateTemplate = (id: string, data: Partial<Template>) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={FileText}
        label="Notification Configuration"
        title="Notification Templates"
        description="Edit transactional email, SMS, and push notification templates with dynamic variable placeholders."
        onSave={() => toast.success('Templates saved!')}
      >
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition">
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="space-y-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
                selectedId === t.id
                  ? 'bg-indigo-50 border-indigo-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">{t.event}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                  {t.channel}
                </span>
                <span className={`text-[10px] font-semibold ${t.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {t.enabled ? '● Active' : '● Disabled'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Template Editor */}
        {current && (
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">{current.event}</h2>
                <p className="text-xs text-slate-500">Channel: {current.channel}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewOpen(!previewOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => updateTemplate(current.id, { enabled: !current.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    current.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
                      current.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Variables */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Available Variables
              </label>
              <div className="flex flex-wrap gap-1.5">
                {current.variables.map((v) => (
                  <code
                    key={v}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono"
                  >
                    {`{{${v}}}`}
                  </code>
                ))}
              </div>
            </div>

            {/* Subject */}
            {current.channel === 'EMAIL' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  value={current.subject}
                  onChange={(e) => updateTemplate(current.id, { subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Message Body
              </label>
              <textarea
                rows={10}
                value={current.body}
                onChange={(e) => updateTemplate(current.id, { body: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-y"
              />
            </div>

            {/* Preview */}
            {previewOpen && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Preview (Sample Data)</label>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
                  {current.body
                    .replace(/{{customer_name}}/g, 'Aryan Mehta')
                    .replace(/{{order_number}}/g, 'VC-2026-0042')
                    .replace(/{{order_total}}/g, '₹12,499.00')
                    .replace(/{{delivery_date}}/g, 'Aug 4, 2026')
                    .replace(/{{tracking_url}}/g, 'https://track.vistoracommerce.com/VC-0042')
                    .replace(/{{tracking_id}}/g, 'SR1234567890IN')
                    .replace(/{{carrier_name}}/g, 'Shiprocket')
                    .replace(/{{reset_url}}/g, 'https://vistoracommerce.com/auth/reset-password?token=xxx')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
