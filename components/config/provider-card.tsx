'use client';

import React, { useState } from 'react';
import { StatusBadge } from './status-badge';
import { Environment } from '@/types/config.types';
import { ChevronDown, ChevronUp, Zap, Eye, EyeOff } from 'lucide-react';

interface ProviderCardProps {
  id: string;
  name: string;
  logo: string;
  description: string;
  enabled: boolean;
  status: 'CONNECTED' | 'DISCONNECTED' | 'TESTING' | 'ERROR';
  apiKey: string;
  apiSecret: string;
  environment: Environment;
  priority?: number;
  onToggle: (id: string, enabled: boolean) => void;
  onTest: (id: string) => void;
  onSave: (id: string, data: { apiKey: string; apiSecret: string; environment: Environment }) => void;
  extraFields?: React.ReactNode;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  id,
  name,
  logo,
  description,
  enabled,
  status,
  apiKey: initialApiKey,
  apiSecret: initialApiSecret,
  environment: initialEnvironment,
  onToggle,
  onTest,
  onSave,
  extraFields,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [apiSecret, setApiSecret] = useState(initialApiSecret);
  const [environment, setEnvironment] = useState<Environment>(initialEnvironment);
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
        enabled ? 'border-indigo-200 shadow-md' : 'border-slate-200/80 shadow-xs'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg font-black text-slate-700 shrink-0 select-none">
            {logo}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 truncate">{name}</h3>
            <p className="text-xs text-slate-500 truncate">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={status} />

          {/* Enable Toggle */}
          <button
            onClick={() => onToggle(id, !enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enabled ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
            title={enabled ? 'Disable' : 'Enable'}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>

          {/* Expand Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Config Section */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
          {/* Environment Selector */}
          <div className="flex gap-2">
            {(['SANDBOX', 'PRODUCTION'] as Environment[]).map((env) => (
              <button
                key={env}
                onClick={() => setEnvironment(env)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                  environment === env
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {env === 'SANDBOX' ? '🧪 Sandbox' : '🚀 Production'}
              </button>
            ))}
          </div>

          {/* API Key */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API Key…"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* API Secret */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">API Secret</label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Enter API Secret…"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Extra Fields */}
          {extraFields}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onTest(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Test Connection
            </button>
            <button
              onClick={() => onSave(id, { apiKey, apiSecret, environment })}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
