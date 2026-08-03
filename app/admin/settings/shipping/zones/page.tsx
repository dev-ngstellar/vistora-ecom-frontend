'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/config/section-header';
import { Globe, Plus, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

interface Zone {
  id: string;
  name: string;
  regions: string[];
  methodCount: number;
  enabled: boolean;
  color: string;
}

const INITIAL_ZONES: Zone[] = [
  { id: 'north-india', name: 'North India', regions: ['Delhi', 'Punjab', 'Haryana', 'UP', 'Uttarakhand', 'HP', 'J&K'], methodCount: 3, enabled: true, color: 'bg-blue-100 text-blue-800' },
  { id: 'south-india', name: 'South India', regions: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana'], methodCount: 3, enabled: true, color: 'bg-green-100 text-green-800' },
  { id: 'west-india', name: 'West India', regions: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa'], methodCount: 3, enabled: true, color: 'bg-orange-100 text-orange-800' },
  { id: 'east-india', name: 'East India', regions: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'], methodCount: 2, enabled: true, color: 'bg-purple-100 text-purple-800' },
  { id: 'northeast', name: 'Northeast India', regions: ['Assam', 'Meghalaya', 'Manipur', 'Nagaland', 'Sikkim', 'Tripura', 'Arunachal', 'Mizoram'], methodCount: 1, enabled: false, color: 'bg-pink-100 text-pink-800' },
  { id: 'international', name: 'International', regions: ['USA', 'UK', 'UAE', 'Singapore', 'Australia', 'Canada'], methodCount: 1, enabled: false, color: 'bg-slate-100 text-slate-700' },
];

export default function ShippingZonesPage() {
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);

  const toggleZone = (id: string) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, enabled: !z.enabled } : z)));
    toast.success('Zone status updated');
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={Globe}
        label="Shipping Configuration"
        title="Shipping Zones"
        description="Define geographic zones and assign shipping methods and rates to each region."
        onSave={() => toast.success('Zones configuration saved!')}
      >
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition">
          <Plus className="w-4 h-4" />
          Add Zone
        </button>
      </SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`bg-white rounded-3xl p-5 border transition-all duration-200 space-y-4 ${
              zone.enabled ? 'border-indigo-200 shadow-md' : 'border-slate-200/80 shadow-xs opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900">{zone.name}</h3>
                <span className="text-xs text-slate-500">{zone.regions.length} regions</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleZone(zone.id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    zone.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transform transition-transform ${
                      zone.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <button className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {zone.regions.slice(0, 5).map((region) => (
                <span key={region} className={`text-[11px] px-2 py-0.5 rounded-lg font-semibold ${zone.color}`}>
                  {region}
                </span>
              ))}
              {zone.regions.length > 5 && (
                <span className="text-[11px] px-2 py-0.5 rounded-lg font-semibold bg-slate-100 text-slate-500">
                  +{zone.regions.length - 5} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
              <span>{zone.methodCount} shipping method{zone.methodCount !== 1 ? 's' : ''}</span>
              <span className={`font-bold ${zone.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {zone.enabled ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
