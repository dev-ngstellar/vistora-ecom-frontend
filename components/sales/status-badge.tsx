import React from 'react';
import { Tag } from 'antd';

export type StatusCategory = 'order' | 'payment' | 'shipment' | 'account' | 'coupon' | 'review';

interface StatusBadgeProps {
  status: string;
  category: StatusCategory;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, category }) => {
  const getBadgeConfig = () => {
    const s = status.toUpperCase();

    if (category === 'order') {
      switch (s) {
        case 'DELIVERED':
          return { color: 'green', label: 'Delivered' };
        case 'SHIPPED':
        case 'OUT_FOR_DELIVERY':
          return { color: 'blue', label: 'In Transit' };
        case 'CONFIRMED':
        case 'PROCESSING':
        case 'PACKED':
          return { color: 'cyan', label: s };
        case 'PENDING':
          return { color: 'gold', label: 'Pending' };
        case 'CANCELLED':
          return { color: 'red', label: 'Cancelled' };
        case 'RETURNED':
        case 'REFUNDED':
          return { color: 'purple', label: s };
        default:
          return { color: 'default', label: status };
      }
    }

    if (category === 'payment') {
      switch (s) {
        case 'PAID':
          return { color: 'success', label: 'Paid' };
        case 'PENDING':
          return { color: 'warning', label: 'Pending' };
        case 'FAILED':
          return { color: 'error', label: 'Failed' };
        case 'CANCELLED':
          return { color: 'default', label: 'Cancelled' };
        case 'REFUNDED':
        case 'PARTIALLY_REFUNDED':
          return { color: 'purple', label: 'Refunded' };
        default:
          return { color: 'default', label: status };
      }
    }

    if (category === 'shipment') {
      switch (s) {
        case 'DELIVERED':
          return { color: 'green', label: 'Delivered' };
        case 'SHIPPED':
        case 'IN_TRANSIT':
        case 'OUT_FOR_DELIVERY':
          return { color: 'processing', label: 'Shipped' };
        case 'READY_TO_SHIP':
        case 'PENDING':
          return { color: 'warning', label: 'Pending' };
        case 'FAILED':
        case 'RETURNED':
          return { color: 'error', label: s };
        default:
          return { color: 'default', label: status };
      }
    }

    if (category === 'account') {
      switch (s) {
        case 'ACTIVE':
          return { color: 'green', label: 'Active' };
        case 'SUSPENDED':
          return { color: 'volcano', label: 'Suspended' };
        case 'PENDING':
          return { color: 'gold', label: 'Pending' };
        case 'BLOCKED':
        case 'DELETED':
          return { color: 'red', label: s };
        default:
          return { color: 'default', label: status };
      }
    }

    if (category === 'coupon') {
      switch (s) {
        case 'ACTIVE':
          return { color: 'green', label: 'Active' };
        case 'INACTIVE':
          return { color: 'orange', label: 'Inactive' };
        case 'EXPIRED':
          return { color: 'red', label: 'Expired' };
        default:
          return { color: 'default', label: status };
      }
    }

    if (category === 'review') {
      switch (s) {
        case 'APPROVED':
          return { color: 'green', label: 'Approved' };
        case 'PENDING':
          return { color: 'gold', label: 'Pending' };
        case 'REJECTED':
          return { color: 'red', label: 'Rejected' };
        default:
          return { color: 'default', label: status };
      }
    }

    return { color: 'default', label: status };
  };

  const config = getBadgeConfig();

  return (
    <Tag color={config.color} className="font-semibold px-2.5 py-0.5 rounded-lg border-0 text-xs">
      {config.label}
    </Tag>
  );
};
