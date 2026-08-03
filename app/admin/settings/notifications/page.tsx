'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/config/section-header';
import { StatusBadge } from '@/components/config/status-badge';
import { NotificationChannel, NotificationChannelType } from '@/types/config.types';
import { Bell, Mail, MessageSquare, Smartphone, MonitorDot, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const CHANNEL_ICONS: Record<NotificationChannelType, React.ReactNode> = {
  EMAIL: <Mail className="w-5 h-5" />,
  SMS: <MessageSquare className="w-5 h-5" />,
  PUSH: <Smartphone className="w-5 h-5" />,
  IN_APP: <MonitorDot className="w-5 h-5" />,
};

const CHANNEL_COLORS: Record<NotificationChannelType, string> = {
  EMAIL: 'bg-blue-50 text-blue-600 border-blue-200',
  SMS: 'bg-green-50 text-green-600 border-green-200',
  PUSH: 'bg-purple-50 text-purple-600 border-purple-200',
  IN_APP: 'bg-amber-50 text-amber-600 border-amber-200',
};

const INITIAL_CHANNELS: NotificationChannel[] = [
  {
    id: 'email-smtp',
    type: 'EMAIL',
    provider: 'SendGrid',
    enabled: false,
    status: 'INACTIVE',
    apiKey: '',
    apiSecret: '',
    fromAddress: 'noreply@vistoracommerce.com',
    fromName: 'Vistora Commerce',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpSecure: true,
  },
  {
    id: 'sms-twilio',
    type: 'SMS',
    provider: 'Twilio',
    enabled: false,
    status: 'INACTIVE',
    apiKey: '',
    apiSecret: '',
  },
  {
    id: 'push-fcm',
    type: 'PUSH',
    provider: 'Firebase FCM',
    enabled: false,
    status: 'INACTIVE',
    apiKey: '',
    apiSecret: '',
  },
  {
    id: 'in-app',
    type: 'IN_APP',
    provider: 'Built-in',
    enabled: true,
    status: 'ACTIVE',
    apiKey: '',
    apiSecret: '',
  },
];

export default function NotificationsPage() {
  const [channels, setChannels] = useState<NotificationChannel[]>(INITIAL_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<string>('email-smtp');
  const [showSecret, setShowSecret] = useState(false);

  const current = channels.find((c) => c.id === selectedChannel);

  const updateChannel = (id: string, data: Partial<NotificationChannel>) => {
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const toggleChannel = (id: string) => {
    const ch = channels.find((c) => c.id === id);
    if (!ch) return;
    const enabled = !ch.enabled;
    updateChannel(id, { enabled, status: enabled ? 'ACTIVE' : 'INACTIVE' });
    toast.success(enabled ? 'Channel enabled' : 'Channel disabled');
  };

  const handleSave = () => {
    toast.success('Notification settings saved!');
  };

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        icon={Bell}
        label="Notification Configuration"
        title="Notification Channels"
        description="Configure Email, SMS, Push, and In-App notification providers and credentials."
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Selector */}
        <div className="space-y-3">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`w-full flex items-center justify-between gap-3 p-4 rounded-2xl border text-left transition ${
                selectedChannel === channel.id
                  ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border ${CHANNEL_COLORS[channel.type]}`}
                >
                  {CHANNEL_ICONS[channel.type]}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{channel.type}</div>
                  <div className="text-xs text-slate-500">{channel.provider}</div>
                </div>
              </div>
              <StatusBadge status={channel.status} />
            </button>
          ))}
        </div>

        {/* Configuration Panel */}
        {current && (
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">{current.type} — {current.provider}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Configure credentials and sender details</p>
              </div>
              <button
                onClick={() => toggleChannel(current.id)}
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

            <div className="space-y-4">
              {/* API Key */}
              {current.type !== 'IN_APP' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {current.type === 'EMAIL' ? 'API Key / App Password' : 'Account SID / API Key'}
                    </label>
                    <input
                      type="text"
                      value={current.apiKey}
                      onChange={(e) => updateChannel(current.id, { apiKey: e.target.value })}
                      placeholder="Enter API key…"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">API Secret / Auth Token</label>
                    <div className="relative">
                      <input
                        type={showSecret ? 'text' : 'password'}
                        value={current.apiSecret}
                        onChange={(e) => updateChannel(current.id, { apiSecret: e.target.value })}
                        placeholder="Enter secret…"
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Email-specific fields */}
              {current.type === 'EMAIL' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">From Name</label>
                      <input
                        type="text"
                        value={current.fromName || ''}
                        onChange={(e) => updateChannel(current.id, { fromName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">From Email</label>
                      <input
                        type="email"
                        value={current.fromAddress || ''}
                        onChange={(e) => updateChannel(current.id, { fromAddress: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">SMTP Host</label>
                      <input
                        type="text"
                        value={current.smtpHost || ''}
                        onChange={(e) => updateChannel(current.id, { smtpHost: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">SMTP Port</label>
                      <input
                        type="number"
                        value={current.smtpPort || 587}
                        onChange={(e) => updateChannel(current.id, { smtpPort: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {current.type === 'IN_APP' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  ✅ Built-in In-App notifications are always available — no API keys required.
                  Manage notification categories and templates in the Templates section.
                </div>
              )}

              {/* Preview button */}
              <button
                onClick={() => toast.success(`Test ${current.type} notification sent!`)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
              >
                Send Test Notification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
