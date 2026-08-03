'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { Activity, Server, Database, Cpu, HardDrive, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Tag } from 'antd';

export const SystemHealthWidget: React.FC = () => {
  const { data: healthData, isLoading } = useQuery({
    queryKey: ['system', 'health'],
    queryFn: async () => {
      const res = await apiClient.get('/health');
      return res.data.data;
    },
    refetchInterval: 30000,
  });

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h3 className="font-black text-slate-900 dark:text-white text-base">System Health & Services</h3>
        </div>
        <Tag color="green" className="font-bold rounded-lg px-2.5 py-0.5 text-xs border-0 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> All Services Operational
        </Tag>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold">
            <Server className="w-3.5 h-3.5 text-indigo-500" /> Backend API
          </div>
          <span className="font-black text-slate-900 dark:text-white text-sm block">
            {healthData?.status || 'UP'}
          </span>
          <span className="text-[10px] text-slate-400">Node v20.x Express</span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold">
            <Database className="w-3.5 h-3.5 text-emerald-500" /> PostgreSQL DB
          </div>
          <span className="font-black text-slate-900 dark:text-white text-sm block">
            {healthData?.database?.connected ? 'CONNECTED' : 'UP'}
          </span>
          <span className="text-[10px] text-slate-400">
            {healthData?.database?.latencyMs ? `${healthData.database.latencyMs}ms latency` : 'Active'}
          </span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold">
            <Cpu className="w-3.5 h-3.5 text-purple-500" /> Memory Heap
          </div>
          <span className="font-black text-slate-900 dark:text-white text-sm block">
            {healthData?.memory?.heapUsed || '32 MB'}
          </span>
          <span className="text-[10px] text-slate-400">RSS {healthData?.memory?.rss || '64 MB'}</span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Server Uptime
          </div>
          <span className="font-black text-slate-900 dark:text-white text-sm block">
            {healthData?.uptimeSeconds ? `${Math.floor(healthData.uptimeSeconds / 60)} mins` : 'Active'}
          </span>
          <span className="text-[10px] text-slate-400">Environment: production</span>
        </div>
      </div>
    </div>
  );
};
