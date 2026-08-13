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

  const totalOrders = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white/45 dark:bg-slate-900/30 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full">
      <div>
        <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight">Order Fulfillment Pipeline</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Status distribution across active store orders</p>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={85}
              paddingAngle={4}
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            
            {/* Center Donut Labels */}
            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-400 dark:fill-slate-500 font-extrabold text-[9px] uppercase tracking-widest"
            >
              Total Orders
            </text>
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-900 dark:fill-white font-black text-2xl tracking-tight"
            >
              {totalOrders}
            </text>

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
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
