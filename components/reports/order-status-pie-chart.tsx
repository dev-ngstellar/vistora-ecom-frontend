'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface OrderStatusPieChartProps {
  data?: Array<{
    name: string;
    count: number;
    color: string;
  }>;
}

export const OrderStatusPieChart: React.FC<OrderStatusPieChartProps> = ({ data = [] }) => {
  const chartData =
    data.length > 0
      ? data
      : [
          { name: 'Delivered', count: 124, color: '#10B981' },
          { name: 'Pending', count: 18, color: '#F59E0B' },
          { name: 'Cancelled', count: 8, color: '#EF4444' },
          { name: 'Returned', count: 4, color: '#8B5CF6' },
        ];

  return (
    <div className="bg-white/85 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-250/60 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] flex flex-col justify-between">
      <div>
        <h3 className="font-black text-slate-900 dark:text-white text-base">Order Fulfillment Pipeline</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status distribution across active store orders</p>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-650 dark:text-slate-400">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
