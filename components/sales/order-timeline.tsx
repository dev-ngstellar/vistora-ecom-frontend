import React from 'react';
import { OrderStatusHistory } from '@/types/sales.types';
import { Clock, CheckCircle2, AlertCircle, Truck, Package, XCircle } from 'lucide-react';
import dayjs from 'dayjs';

interface OrderTimelineProps {
  history?: OrderStatusHistory[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        No status history recorded yet.
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return <Truck className="w-4 h-4 text-indigo-500" />;
      case 'PROCESSING':
      case 'PACKED':
      case 'CONFIRMED':
        return <Package className="w-4 h-4 text-cyan-500" />;
      case 'CANCELLED':
      case 'RETURNED':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {history.map((item, index) => (
        <div key={item.id || index} className="relative flex items-start gap-4">
          <div className="absolute -left-6 top-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-full border border-slate-200 dark:border-slate-800">
            {getStatusIcon(item.status)}
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {item.status.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {dayjs(item.createdAt).format('MMM D, YYYY • h:mm A')}
              </span>
            </div>

            {item.remarks && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                {item.remarks}
              </p>
            )}

            {item.updatedBy && (
              <p className="text-[11px] text-slate-400 mt-2">
                By: <span className="font-semibold">{item.updatedBy}</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
