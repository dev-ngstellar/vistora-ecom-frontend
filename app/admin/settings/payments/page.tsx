'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/config/section-header';
import { ProviderCard } from '@/components/config/provider-card';
import { PaymentGateway } from '@/types/config.types';
import { CreditCard, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_GATEWAYS: PaymentGateway[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    logo: '💳',
    description: 'India\'s leading payment gateway. UPI, Cards, Netbanking, EMI & Wallets.',
    enabled: false,
    apiKey: '',
    apiSecret: '',
    webhookSecret: '',
    environment: 'SANDBOX',
    status: 'DISCONNECTED',
    webhookUrl: 'https://api.vistoracommerce.com/webhooks/razorpay',
    supportedCurrencies: ['INR'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '💜',
    description: 'Global payment processing. 135+ currencies, recurring billing & fraud detection.',
    enabled: false,
    apiKey: '',
    apiSecret: '',
    webhookSecret: '',
    environment: 'SANDBOX',
    status: 'DISCONNECTED',
    webhookUrl: 'https://api.vistoracommerce.com/webhooks/stripe',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'AUD'],
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    logo: '💵',
    description: 'Collect payment at the time of delivery. No API keys required.',
    enabled: true,
    apiKey: '',
    apiSecret: '',
    webhookSecret: '',
    environment: 'PRODUCTION',
    status: 'CONNECTED',
    webhookUrl: '',
    supportedCurrencies: ['INR'],
  },
  {
    id: 'payu',
    name: 'PayU',
    logo: '🔵',
    description: 'Coming soon — PayU Biz for India-first payment acceptance.',
    enabled: false,
    apiKey: '',
    apiSecret: '',
    webhookSecret: '',
    environment: 'SANDBOX',
    status: 'DISCONNECTED',
    webhookUrl: '',
    supportedCurrencies: ['INR'],
  },
];

export default function PaymentGatewaysPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>(INITIAL_GATEWAYS);

  const handleToggle = (id: string, enabled: boolean) => {
    setGateways((prev) => prev.map((g) => (g.id === id ? { ...g, enabled } : g)));
    toast.success(enabled ? 'Gateway enabled' : 'Gateway disabled');
  };

  const handleTest = (id: string) => {
    setGateways((prev) => prev.map((g) => (g.id === id ? { ...g, status: 'TESTING' } : g)));
    setTimeout(() => {
      setGateways((prev) => prev.map((g) => (g.id === id ? { ...g, status: 'CONNECTED' } : g)));
      toast.success('Payment gateway connection verified!');
    }, 2000);
  };

  const handleSave = (id: string, data: Partial<PaymentGateway>) => {
    setGateways((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
    toast.success('Gateway credentials saved!');
  };

  const activeCount = gateways.filter((g) => g.enabled).length;
  const liveCount = gateways.filter((g) => g.environment === 'PRODUCTION' && g.enabled).length;

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={CreditCard}
        label="Payments Configuration"
        title="Payment Gateways"
        description="Configure payment gateways, manage API keys, webhook secrets, and environment settings for your storefront."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Gateways', value: gateways.length },
          { label: 'Active', value: activeCount },
          { label: 'Live (Production)', value: liveCount },
          { label: 'Test Mode', value: gateways.filter(g => g.environment === 'SANDBOX').length },
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

      {/* Webhook URL Notice */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 font-medium">
        <IndianRupee className="w-4 h-4 text-indigo-600 shrink-0" />
        <div>
          <span className="font-bold">Webhook Endpoint: </span>
          Register your gateway webhooks to:{' '}
          <code className="font-mono bg-indigo-100 px-2 py-0.5 rounded-lg">
            https://api.vistoracommerce.com/webhooks/&#123;gateway-id&#125;
          </code>
        </div>
      </div>

      {/* Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gateways.map((gateway) => (
          <ProviderCard
            key={gateway.id}
            {...gateway}
            onToggle={handleToggle}
            onTest={handleTest}
            onSave={(id, data) => handleSave(id, data)}
            extraFields={
              gateway.id !== 'cod' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Webhook Secret</label>
                  <input
                    type="password"
                    defaultValue={gateway.webhookSecret}
                    placeholder="Webhook signing secret…"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              ) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
