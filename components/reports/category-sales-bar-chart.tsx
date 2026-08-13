'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface CategorySalesBarChartProps {
  data?: Array<{ name: string; count: number }>;
}

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

export const CategorySalesBarChart: React.FC<CategorySalesBarChartProps> = ({ data = [] }) => {
  const chartData =
    data.length > 0
      ? data
      : [
          { name: 'Haute Couture', count: 42 },
          { name: 'Silk Gowns', count: 35 },
          { name: 'Cashmere Coats', count: 28 },
          { name: 'Footwear', count: 22 },
          { name: 'Handbags', count: 18 },
        ];

  return (
    <div className="bg-white/45 dark:bg-slate-900/30 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight">Category Product Distribution</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Inventory count by fashion department</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'rgba(148, 163, 184, 0.6)' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'rgba(148, 163, 184, 0.6)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                color: '#FFF',
                fontSize: '11px',
                fontWeight: 'bold',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
