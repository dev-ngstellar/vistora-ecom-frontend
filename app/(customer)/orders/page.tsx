'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="py-6">
        <PlaceholderPage
          title="Order History"
          description="View all active and past orders, check real-time shipment status, download invoices, and request returns or refunds."
          module="Customer"
          plannedSprint="Sprint 4"
          icon={Package}
          quickLinks={[
            { label: 'Browse Products', href: '/shop', primary: true },
            { label: 'My Profile', href: '/profile' },
          ]}
        />
      </div>
    </ProtectedRoute>
  );
}
