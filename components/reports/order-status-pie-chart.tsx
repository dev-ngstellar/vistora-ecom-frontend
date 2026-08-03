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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="font-black text-slate-900 dark:text-white text-base">Order Fulfillment Pipeline</h3>
        <p className="text-xs text-slate-500 font-medium">Status distribution across active store orders</p>
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
                backgroundColor: '#0F172A',
                borderColor: '#1E293B',
                borderRadius: '16px',
                color: '#FFF',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
