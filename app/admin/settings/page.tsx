'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/config/section-header';
import { StoreSettings } from '@/types/config.types';
import {
  Settings,
  Store,
  DollarSign,
  Receipt,
  Shield,
  WrenchIcon,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Vistora Commerce',
  storeDescription: 'Premium Luxury Fashion & Lifestyle Brand',
  storeEmail: 'hello@vistoracommerce.com',
  storePhone: '+91 98765 43210',
  storeAddress: '42, Luxury Mile, Bandra West',
  storeCity: 'Mumbai',
  storeState: 'Maharashtra',
  storeCountry: 'India',
  storePostalCode: '400050',
  logoUrl: '',
  faviconUrl: '',
  currencyCode: 'INR',
  currencySymbol: '₹',
  dateFormat: 'DD/MM/YYYY',
  timezone: 'Asia/Kolkata',
  language: 'en-IN',
  gstNumber: '27AABCV1234A1Z5',
  taxRate: 18,
  taxInclusive: false,
  taxLabel: 'GST',
  orderPrefix: 'VC-',
  invoicePrefix: 'INV-',
  invoiceFooterText: 'Thank you for shopping with Vistora Commerce. All sales are final.',
  termsUrl: '/terms',
  sessionTimeoutMinutes: 60,
  twoFactorEnabled: false,
  passwordMinLength: 8,
  requireSpecialChars: true,
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.',
};

type Tab = 'store' | 'currency' | 'tax' | 'invoice' | 'security' | 'maintenance';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'store', label: 'Store Info', icon: <Store className="w-4 h-4" /> },
  { id: 'currency', label: 'Currency & Locale', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'tax', label: 'Tax & GST', icon: <Receipt className="w-4 h-4" /> },
  { id: 'invoice', label: 'Invoice Settings', icon: <Receipt className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  { id: 'maintenance', label: 'Maintenance', icon: <WrenchIcon className="w-4 h-4" /> },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [activeTab, setActiveTab] = useState<Tab>('store');
  const [isSaving, setIsSaving] = useState(false);

  const update = (data: Partial<StoreSettings>) => setSettings((prev) => ({ ...prev, ...data }));

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully!');
    }, 1200);
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const labelClass = 'text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5';

  const renderTab = () => {
    switch (activeTab) {
      case 'store':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Store Name</label>
                <input className={inputClass} value={settings.storeName} onChange={(e) => update({ storeName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Store Email</label>
                <input type="email" className={inputClass} value={settings.storeEmail} onChange={(e) => update({ storeEmail: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input className={inputClass} value={settings.storePhone} onChange={(e) => update({ storePhone: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Postal Code</label>
                <input className={inputClass} value={settings.storePostalCode} onChange={(e) => update({ storePostalCode: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea rows={2} className={inputClass} value={settings.storeDescription} onChange={(e) => update({ storeDescription: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input className={inputClass} value={settings.storeCity} onChange={(e) => update({ storeCity: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input className={inputClass} value={settings.storeState} onChange={(e) => update({ storeState: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input className={inputClass} value={settings.storeCountry} onChange={(e) => update({ storeCountry: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Full Address</label>
              <input className={inputClass} value={settings.storeAddress} onChange={(e) => update({ storeAddress: e.target.value })} />
            </div>
          </div>
        );

      case 'currency':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Currency Code</label>
                <select className={inputClass} value={settings.currencyCode} onChange={(e) => update({ currencyCode: e.target.value })}>
                  <option value="INR">INR — Indian Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="AED">AED — UAE Dirham</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Currency Symbol</label>
                <input className={inputClass} value={settings.currencySymbol} onChange={(e) => update({ currencySymbol: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Timezone</label>
                <select className={inputClass} value={settings.timezone} onChange={(e) => update({ timezone: e.target.value })}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Date Format</label>
                <select className={inputClass} value={settings.dateFormat} onChange={(e) => update({ dateFormat: e.target.value })}>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'tax':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>GST Number</label>
                <input className={`${inputClass} font-mono uppercase`} value={settings.gstNumber} onChange={(e) => update({ gstNumber: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Tax Rate (%)</label>
                <input type="number" min={0} max={100} className={inputClass} value={settings.taxRate} onChange={(e) => update({ taxRate: Number(e.target.value) })} />
              </div>
              <div>
                <label className={labelClass}>Tax Label</label>
                <input className={inputClass} value={settings.taxLabel} onChange={(e) => update({ taxLabel: e.target.value })} placeholder="e.g. GST, VAT, Sales Tax" />
              </div>
            </div>
            <div className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-sm font-bold text-slate-900">Tax-Inclusive Pricing</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  When enabled, displayed product prices already include tax. When disabled, tax is added at checkout.
                </div>
              </div>
              <button
                onClick={() => update({ taxInclusive: !settings.taxInclusive })}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors mt-0.5 ${settings.taxInclusive ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.taxInclusive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        );

      case 'invoice':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Order Number Prefix</label>
                <input className={`${inputClass} font-mono`} value={settings.orderPrefix} onChange={(e) => update({ orderPrefix: e.target.value })} placeholder="e.g. VC-" />
                <p className="text-xs text-slate-400 mt-1">Orders will be numbered like: {settings.orderPrefix}2026-0001</p>
              </div>
              <div>
                <label className={labelClass}>Invoice Number Prefix</label>
                <input className={`${inputClass} font-mono`} value={settings.invoicePrefix} onChange={(e) => update({ invoicePrefix: e.target.value })} placeholder="e.g. INV-" />
                <p className="text-xs text-slate-400 mt-1">Invoices will be numbered like: {settings.invoicePrefix}2026-0001</p>
              </div>
            </div>
            <div>
              <label className={labelClass}>Terms & Conditions URL</label>
              <input className={inputClass} value={settings.termsUrl} onChange={(e) => update({ termsUrl: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Invoice Footer Text</label>
              <textarea rows={3} className={inputClass} value={settings.invoiceFooterText} onChange={(e) => update({ invoiceFooterText: e.target.value })} />
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Session Timeout (Minutes)</label>
                <input type="number" min={15} max={1440} className={inputClass} value={settings.sessionTimeoutMinutes} onChange={(e) => update({ sessionTimeoutMinutes: Number(e.target.value) })} />
              </div>
              <div>
                <label className={labelClass}>Minimum Password Length</label>
                <input type="number" min={6} max={32} className={inputClass} value={settings.passwordMinLength} onChange={(e) => update({ passwordMinLength: Number(e.target.value) })} />
              </div>
            </div>

            {[
              {
                key: 'twoFactorEnabled' as const,
                title: 'Two-Factor Authentication (2FA)',
                description: 'Require 2FA for all admin panel logins.',
              },
              {
                key: 'requireSpecialChars' as const,
                title: 'Require Special Characters in Passwords',
                description: 'Enforce passwords contain at least one special character (!@#$%).',
              },
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-sm font-bold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                </div>
                <button
                  onClick={() => update({ [item.key]: !settings[item.key] })}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors mt-0.5 ${settings[item.key] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-5">
            <div
              className={`p-5 rounded-2xl border transition-all ${
                settings.maintenanceMode
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-black text-slate-900">Maintenance Mode</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {settings.maintenanceMode
                      ? '⚠ Your store is currently in Maintenance Mode. Customers will see the maintenance message.'
                      : 'Enable to take the storefront offline for maintenance or updates.'}
                  </div>
                </div>
                <button
                  onClick={() => update({ maintenanceMode: !settings.maintenanceMode })}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors mt-1 ${settings.maintenanceMode ? 'bg-amber-500' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Maintenance Message</label>
              <textarea
                rows={4}
                className={inputClass}
                value={settings.maintenanceMessage}
                onChange={(e) => update({ maintenanceMessage: e.target.value })}
                placeholder="Message displayed to customers during maintenance…"
              />
            </div>

            {settings.maintenanceMode && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 font-semibold">
                🔴 MAINTENANCE MODE IS ACTIVE — Your storefront is currently unavailable to customers. Admins can still log in normally.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={Settings}
        label="Platform Configuration"
        title="Store Settings"
        description="Configure your store profile, currency, tax rates, invoice settings, security policies, and maintenance mode."
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-2xl border text-center transition-all space-y-2 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <div className="flex justify-center">{tab.icon}</div>
            <div className="text-xs font-bold leading-tight">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Settings Form Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 font-black text-sm mb-6 pb-4 border-b border-slate-100">
          {TABS.find((t) => t.id === activeTab)?.icon}
          <span>{TABS.find((t) => t.id === activeTab)?.label}</span>
          <ChevronRight className="w-4 h-4 text-slate-400 ml-1" />
        </div>
        {renderTab()}
      </div>
    </div>
  );
}
