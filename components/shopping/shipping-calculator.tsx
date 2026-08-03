'use client';

import React, { useState } from 'react';
import { useShippingEstimate } from '@/hooks/use-shopping';
import { Truck, Calculator, CheckCircle2 } from 'lucide-react';

interface ShippingCalculatorProps {
  subtotal: number;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({ subtotal }) => {
  const [postalCode, setPostalCode] = useState<string>('10001');
  const [country, setCountry] = useState<string>('United States');

  const { data: estimate, isLoading } = useShippingEstimate(subtotal, postalCode, country);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
        <Calculator className="w-4 h-4 text-indigo-600" />
        <span>Estimate Shipping & Delivery ETA</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <input
          type="text"
          placeholder="Postal / Zip Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isLoading ? (
        <div className="text-xs text-slate-400 animate-pulse py-2">Calculating shipping rates...</div>
      ) : estimate ? (
        <div className="space-y-2 pt-1 border-t border-slate-100">
          {estimate.methods.map((method) => (
            <div
              key={method.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{method.name}</span>
                </div>
                <p className="text-[11px] text-slate-500">{method.description}</p>
              </div>

              <div className="text-right shrink-0">
                {method.isFree ? (
                  <span className="font-extrabold text-emerald-600 uppercase">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">${method.cost.toFixed(2)}</span>
                )}
                <span className="text-[10px] text-slate-400 block">{method.estimatedDays}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
