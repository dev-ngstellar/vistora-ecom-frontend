'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/config/section-header';
import { RefundSettings } from '@/types/config.types';
import { RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL: RefundSettings = {
  autoRefundEnabled: false,
  refundWindow: 7,
  partialRefundEnabled: true,
  restockOnRefund: true,
  refundNotificationEmail: 'finance@vistoracommerce.com',
};

export default function RefundSettingsPage() {
  const [settings, setSettings] = useState<RefundSettings>(INITIAL);

  const handleSave = () => {
    toast.success('Refund settings saved!');
  };

  const toggle = (key: keyof RefundSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={RotateCcw}
        label="Payments Configuration"
        title="Refund & Return Settings"
        description="Define refund windows, auto-refund rules, partial refund policies, and inventory restocking behaviour."
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Refund Policy */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">Refund Policy Rules</h2>

          {[
            {
              key: 'autoRefundEnabled' as const,
              title: 'Automatic Refund Processing',
              description: 'Automatically initiate refunds for eligible returned orders without manual approval.',
            },
            {
              key: 'partialRefundEnabled' as const,
              title: 'Partial Refund Support',
              description: 'Allow partial refunds for orders where only some items are returned.',
            },
            {
              key: 'restockOnRefund' as const,
              title: 'Restock Inventory on Refund',
              description: 'Automatically restock inventory quantities when refund orders are processed.',
            },
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between gap-4 py-2">
              <div>
                <div className="text-xs font-bold text-slate-900">{item.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
              </div>
              <button
                onClick={() => toggle(item.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors mt-0.5 ${
                  settings[item.key] ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Time Windows */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">Time Windows & Notifications</h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Refund Eligibility Window (Days)
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={settings.refundWindow}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, refundWindow: Number(e.target.value) }))
                }
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-400">
                Customers can only request refunds within this window after delivery.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Refund Notification Email
              </label>
              <input
                type="email"
                value={settings.refundNotificationEmail}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, refundNotificationEmail: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-400">Finance team receives refund request notifications.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
