'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SalesTrendChartProps {
  data?: Array<{
    date: string;
    revenue: number;
    ordersCount: number;
  }>;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data = [] }) => {
  const chartData =
    data.length > 0
      ? data
      : [
          { date: 'Mon', revenue: 14200, ordersCount: 12 },
          { date: 'Tue', revenue: 21500, ordersCount: 18 },
          { date: 'Wed', revenue: 18900, ordersCount: 15 },
          { date: 'Thu', revenue: 32400, ordersCount: 24 },
          { date: 'Fri', revenue: 28900, ordersCount: 21 },
          { date: 'Sat', revenue: 45200, ordersCount: 35 },
          { date: 'Sun', revenue: 39800, ordersCount: 30 },
        ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-base">Sales & Revenue Velocity</h3>
          <p className="text-xs text-slate-500 font-medium">Daily revenue accumulation and order counts</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
            <Tooltip
              formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#1E293B',
                borderRadius: '16px',
                color: '#FFF',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366F1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
