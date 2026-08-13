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
import dayjs from 'dayjs';

interface SalesTrendChartProps {
  data?: Array<{
    date: string;
    revenue: number;
    ordersCount: number;
  }>;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data = [] }) => {
  const chartData = (data.length > 0 ? data : [
    { date: dayjs().subtract(6, 'day').format('YYYY-MM-DD'), revenue: 0, ordersCount: 0 },
    { date: dayjs().subtract(5, 'day').format('YYYY-MM-DD'), revenue: 0, ordersCount: 0 },
    { date: dayjs().subtract(4, 'day').format('YYYY-MM-DD'), revenue: 0, ordersCount: 0 },
    { date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'), revenue: 0, ordersCount: 0 },
    { date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'), revenue: 0, ordersCount: 0 },
    { date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), revenue: 0, ordersCount: 0 },
    { date: dayjs().format('YYYY-MM-DD'), revenue: 0, ordersCount: 0 },
  ]).map((item) => ({
    ...item,
    formattedDate: dayjs(item.date).isValid() ? dayjs(item.date).format('MMM D') : item.date,
  }));

  return (
    <div className="bg-white/85 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-250/60 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-base">Sales & Revenue Velocity</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily revenue accumulation and order counts (in INR ₹)</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A50025" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#A50025" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis dataKey="formattedDate" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'rgba(148, 163, 184, 0.8)' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'rgba(148, 163, 184, 0.8)' }} tickFormatter={(v) => `₹${v}`} />
            <Tooltip
              formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(8px)',
                borderColor: 'rgba(148, 163, 184, 0.2)',
                borderRadius: '14px',
                color: '#FFF',
                fontSize: '11px',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#A50025"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
