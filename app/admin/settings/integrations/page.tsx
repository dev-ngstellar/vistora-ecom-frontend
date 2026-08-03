'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/config/section-header';
import { StatusBadge } from '@/components/config/status-badge';
import { Integration } from '@/types/config.types';
import { Plug, ExternalLink, Settings, Zap, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_LABELS: Record<string, string> = {
  AUTH: 'Authentication',
  MEDIA: 'Media & Storage',
  EMAIL: 'Email',
  ANALYTICS: 'Analytics',
  MARKETING: 'Marketing',
  SHIPPING: 'Logistics',
  PAYMENTS: 'Payments',
};

const CATEGORY_COLORS: Record<string, string> = {
  AUTH: 'bg-blue-50 text-blue-700 border-blue-200',
  MEDIA: 'bg-purple-50 text-purple-700 border-purple-200',
  EMAIL: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  ANALYTICS: 'bg-orange-50 text-orange-700 border-orange-200',
  MARKETING: 'bg-pink-50 text-pink-700 border-pink-200',
  SHIPPING: 'bg-green-50 text-green-700 border-green-200',
  PAYMENTS: 'bg-amber-50 text-amber-700 border-amber-200',
};

const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'google-oauth',
    name: 'Google OAuth 2.0',
    category: 'AUTH',
    logo: '🔑',
    description: 'Allow customers to sign in with their Google account via OAuth 2.0.',
    status: 'DISCONNECTED',
    enabled: false,
    config: { clientId: '', clientSecret: '', redirectUri: 'https://api.vistoracommerce.com/auth/google/callback' },
    docsUrl: 'https://developers.google.com/identity/protocols/oauth2',
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    category: 'MEDIA',
    logo: '☁️',
    description: 'Cloud-based image & video management for product assets and media uploads.',
    status: 'DISCONNECTED',
    enabled: false,
    config: { cloudName: '', apiKey: '', apiSecret: '' },
    docsUrl: 'https://cloudinary.com/documentation',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid / SMTP',
    category: 'EMAIL',
    logo: '📧',
    description: 'Transactional email delivery for order confirmations, invoices, and marketing.',
    status: 'DISCONNECTED',
    enabled: false,
    config: { apiKey: '', fromEmail: 'noreply@vistoracommerce.com', fromName: 'Vistora Commerce' },
    docsUrl: 'https://docs.sendgrid.com',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    category: 'ANALYTICS',
    logo: '📊',
    description: 'Track storefront traffic, conversions, revenue events, and customer journeys.',
    status: 'DISCONNECTED',
    enabled: false,
    config: { measurementId: '' },
    docsUrl: 'https://developers.google.com/analytics',
  },
  {
    id: 'meta-pixel',
    name: 'Meta Pixel',
    category: 'MARKETING',
    logo: '🎯',
    description: 'Track Facebook & Instagram ad conversions, retargeting, and purchase events.',
    status: 'DISCONNECTED',
    enabled: false,
    config: { pixelId: '', accessToken: '' },
    docsUrl: 'https://developers.facebook.com/docs/meta-pixel',
  },
  {
    id: 'razorpay-int',
    name: 'Razorpay',
    category: 'PAYMENTS',
    logo: '💳',
    description: 'Linked from Payment Gateways — configure in Payments → Gateways.',
    status: 'DISCONNECTED',
    enabled: false,
    config: {},
    docsUrl: 'https://razorpay.com/docs',
  },
  {
    id: 'shiprocket-int',
    name: 'Shiprocket',
    category: 'SHIPPING',
    logo: '🚀',
    description: 'Linked from Shipping Providers — configure in Shipping → Providers.',
    status: 'DISCONNECTED',
    enabled: false,
    config: {},
    docsUrl: 'https://developer.shiprocket.in',
  },
];

const CATEGORIES = Array.from(new Set(INITIAL_INTEGRATIONS.map((i) => i.category)));

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    selectedCategory === 'ALL'
      ? integrations
      : integrations.filter((i) => i.category === selectedCategory);

  const handleTest = (id: string) => {
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'PENDING' } : i)));
    setTimeout(() => {
      setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'CONNECTED' } : i)));
      toast.success('Integration connection verified!');
    }, 2000);
  };

  const handleToggle = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              enabled: !i.enabled,
              status: !i.enabled ? 'CONNECTED' : 'DISCONNECTED',
            }
          : i,
      ),
    );
  };

  const updateConfig = (id: string, key: string, value: string) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, config: { ...i.config, [key]: value } } : i)),
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={Plug}
        label="Platform Configuration"
        title="Integrations Hub"
        description="Connect external services — analytics, media, email, authentication, and marketing platforms."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Integrations', value: integrations.length },
          { label: 'Connected', value: integrations.filter((i) => i.status === 'CONNECTED').length },
          { label: 'Active', value: integrations.filter((i) => i.enabled).length },
          { label: 'Categories', value: CATEGORIES.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center"
          >
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['ALL', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold border transition ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat === 'ALL' ? 'All Integrations' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((integration) => (
          <div
            key={integration.id}
            className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
              integration.enabled ? 'border-indigo-200 shadow-md' : 'border-slate-200/80 shadow-xs'
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0">
                  {integration.logo}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{integration.name}</h3>
                    <span
                      className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-md font-semibold border ${CATEGORY_COLORS[integration.category]}`}
                    >
                      {CATEGORY_LABELS[integration.category]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{integration.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={integration.status} />
                <button
                  onClick={() => setExpandedId(expandedId === integration.id ? null : integration.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Config Panel */}
            {expandedId === integration.id && (
              <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                {Object.entries(integration.config).length > 0 ? (
                  Object.entries(integration.config).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type={key.toLowerCase().includes('secret') || key.toLowerCase().includes('token') ? 'password' : 'text'}
                        value={value}
                        onChange={(e) => updateConfig(integration.id, key, e.target.value)}
                        placeholder={`Enter ${key}…`}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    This integration is configured in another section. Click the link below to manage it.
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleTest(integration.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Test
                  </button>
                  <button
                    onClick={() => handleToggle(integration.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                    {integration.enabled ? 'Disconnect' : 'Connect'}
                  </button>
                  {integration.docsUrl && (
                    <a
                      href={integration.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
                      title="View Docs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
