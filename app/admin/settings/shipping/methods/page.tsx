'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/config/section-header';
import { ShippingMethod } from '@/types/config.types';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    code: 'STANDARD',
    description: 'Regular courier delivery across India',
    carrier: 'Shiprocket',
    baseRate: 50,
    freeThreshold: 999,
    estimatedDays: '3-5 Business Days',
    enabled: true,
  },
  {
    id: 'express',
    name: 'Express Delivery',
    code: 'EXPRESS',
    description: 'Faster delivery for premium orders',
    carrier: 'Blue Dart',
    baseRate: 150,
    freeThreshold: null,
    estimatedDays: '1-2 Business Days',
    enabled: true,
  },
  {
    id: 'same-day',
    name: 'Same-Day Delivery',
    code: 'SAME_DAY',
    description: 'Metro cities only — delivered today',
    carrier: 'Delhivery',
    baseRate: 299,
    freeThreshold: null,
    estimatedDays: 'Same Business Day',
    enabled: false,
  },
  {
    id: 'pickup',
    name: 'Click & Collect',
    code: 'PICKUP',
    description: 'Customer picks up from nearest store',
    carrier: 'In-Store',
    baseRate: 0,
    freeThreshold: null,
    estimatedDays: 'Ready in 2 hours',
    enabled: false,
  },
];

export default function ShippingMethodsPage() {
  const [methods, setMethods] = useState<ShippingMethod[]>(INITIAL_METHODS);

  const toggleMethod = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)),
    );
    toast.success('Shipping method updated');
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={Package}
        label="Shipping Configuration"
        title="Shipping Methods"
        description="Define and manage available delivery methods, carriers, base rates, and free shipping thresholds."
        onSave={() => toast.success('Shipping methods saved!')}
      >
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition">
          <Plus className="w-4 h-4" />
          Add Method
        </button>
      </SectionHeader>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <th className="text-left px-6 py-4">Method</th>
                <th className="text-left px-6 py-4">Carrier</th>
                <th className="text-left px-6 py-4">Base Rate</th>
                <th className="text-left px-6 py-4">Free Threshold</th>
                <th className="text-left px-6 py-4">ETA</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {methods.map((method) => (
                <tr key={method.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-slate-900">{method.name}</div>
                      <div className="text-xs text-slate-500">{method.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {method.carrier}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">
                    {method.baseRate === 0 ? 'FREE' : `₹${method.baseRate}`}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {method.freeThreshold ? `₹${method.freeThreshold}+` : '—'}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">{method.estimatedDays}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleMethod(method.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        method.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transform transition-transform ${
                          method.enabled ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
