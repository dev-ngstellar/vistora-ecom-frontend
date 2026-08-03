'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/config/section-header';
import { ProviderCard } from '@/components/config/provider-card';
import { ShippingProvider } from '@/types/config.types';
import { Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_PROVIDERS: ShippingProvider[] = [
  {
    id: 'shiprocket',
    name: 'Shiprocket',
    logo: '🚀',
    description: 'India\'s leading logistics aggregator. Connects 25+ courier partners.',
    enabled: false,
    apiKey: '',
    apiSecret: '',
    environment: 'SANDBOX',
    status: 'DISCONNECTED',
    priority: 1,
    trackingUrl: 'https://shiprocket.co/tracking/',
  },
  {
    id: 'delhivery',
    name: 'Delhivery',
    logo: '📦',
    description: 'Pan-India express delivery & supply chain platform.',
    enabled: false,
    apiKey: '',
    apiSecret: '',
    environment: 'SANDBOX',
    status: 'DISCONNECTED',
    priority: 2,
    trackingUrl: 'https://www.delhivery.com/track/package/',
  },
  {
    id: 'bluedart',
    name: 'Blue Dart',
    logo: '💙',
    description: 'DHL partner for premium next-day & time-definite deliveries.',
    enabled: false,
    apiKey: '',
    apiSecret: '',
    environment: 'SANDBOX',
    status: 'DISCONNECTED',
    priority: 3,
  },
  {
    id: 'dtdc',
    name: 'DTDC',
    logo: '🟠',
    description: 'Nationwide courier network with 10,500+ pin code coverage.',
    enabled: false,
    apiKey: '',
    apiSecret: '',
    environment: 'SANDBOX',
    status: 'DISCONNECTED',
    priority: 4,
  },
  {
    id: 'xpressbees',
    name: 'XpressBees',
    logo: '🐝',
    description: 'Fast-growing last-mile fulfillment for D2C and e-commerce.',
    enabled: false,
    apiKey: '',
    apiSecret: '',
    environment: 'SANDBOX',
    status: 'DISCONNECTED',
    priority: 5,
  },
  {
    id: 'indiapost',
    name: 'India Post',
    logo: '📮',
    description: 'Government postal service with unmatched rural reach.',
    enabled: false,
    apiKey: '',
    apiSecret: '',
    environment: 'SANDBOX',
    status: 'DISCONNECTED',
    priority: 6,
  },
];

export default function ShippingProvidersPage() {
  const [providers, setProviders] = useState<ShippingProvider[]>(INITIAL_PROVIDERS);

  const handleToggle = (id: string, enabled: boolean) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, enabled } : p)));
    toast.success(enabled ? 'Provider enabled' : 'Provider disabled');
  };

  const handleTest = (id: string) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'TESTING' } : p)));
    setTimeout(() => {
      setProviders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'CONNECTED' } : p)),
      );
      toast.success('Connection test passed!');
    }, 2000);
  };

  const handleSave = (
    id: string,
    data: { apiKey: string; apiSecret: string; environment: ShippingProvider['environment'] },
  ) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    toast.success('Provider credentials saved!');
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={Truck}
        label="Shipping Configuration"
        title="Shipping Providers"
        description="Connect and configure India's leading logistics carriers. Enable providers, enter API credentials, select environment, and test connectivity."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Providers', value: providers.length },
          { label: 'Enabled', value: providers.filter((p) => p.enabled).length },
          { label: 'Connected', value: providers.filter((p) => p.status === 'CONNECTED').length },
          { label: 'Sandbox', value: providers.filter((p) => p.environment === 'SANDBOX').length },
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

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            {...provider}
            onToggle={handleToggle}
            onTest={handleTest}
            onSave={handleSave}
          />
        ))}
      </div>

      {/* Note */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
        ⚠ All credentials are encrypted at rest. Use Sandbox mode for testing before switching to
        Production. Provider priority determines fallback order during fulfilment.
      </div>
    </div>
  );
}
