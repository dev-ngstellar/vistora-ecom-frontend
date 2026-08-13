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
    <div className="bg-white/85 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-250/60 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-base">Category Product Distribution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inventory count by fashion department</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'rgba(148, 163, 184, 0.8)' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'rgba(148, 163, 184, 0.8)' }} />
            <Tooltip
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
            <Bar dataKey="count" radius={[10, 10, 0, 0]}>
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
