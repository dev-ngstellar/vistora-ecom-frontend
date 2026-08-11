import React from 'react';
import { Tag } from 'antd';

export type StatusCategory = 'order' | 'payment' | 'shipment' | 'account' | 'coupon' | 'review';

interface StatusBadgeProps {
  status: string;
  category: StatusCategory;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, category }) => {
  const getBadgeConfig = () => {
    const s = (status || '').toUpperCase();

    if (category === 'order') {
      switch (s) {
        case 'DELIVERED':
          return { color: 'green', label: 'Delivered' };
        case 'OUT_FOR_DELIVERY':
          return { color: 'orange', label: 'Out for Delivery' };
        case 'SHIPPED':
        case 'IN_TRANSIT':
          return { color: 'blue', label: 'Shipped' };
        case 'PACKED':
          return { color: 'purple', label: 'Packed' };
        case 'PROCESSING':
          return { color: 'cyan', label: 'Processing' };
        case 'CONFIRMED':
          return { color: 'geekblue', label: 'Confirmed' };
        case 'PENDING':
          return { color: 'gold', label: 'Pending' };
        case 'CANCELLED':
          return { color: 'red', label: 'Cancelled' };
        case 'RETURNED':
          return { color: 'magenta', label: 'Returned' };
        case 'REFUNDED':
          return { color: 'purple', label: 'Refunded' };
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
        case 'OUT_FOR_DELIVERY':
          return { color: 'orange', label: 'Out for Delivery' };
        case 'SHIPPED':
        case 'IN_TRANSIT':
          return { color: 'blue', label: 'Shipped' };
        case 'PACKED':
        case 'READY_TO_SHIP':
          return { color: 'purple', label: 'Packed' };
        case 'PENDING':
          return { color: 'gold', label: 'Pending' };
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
        case 'PUBLISHED':
        case 'APPROVED':
          return { color: 'green', label: 'Published' };
        case 'PENDING':
          return { color: 'gold', label: 'Pending Review' };
        case 'REJECTED':
          return { color: 'red', label: 'Rejected' };
        default:
          return { color: 'default', label: status };
      }
    }

    return { color: 'default', label: status };
  };

  const { color, label } = getBadgeConfig();

  return (
    <Tag color={color} className="font-semibold text-xs rounded-full px-2.5 py-0.5 border-0 shadow-2xs">
      {label}
    </Tag>
  );
};
