'use client';

import React, { use } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { Truck } from 'lucide-react';

interface OrderDetailsProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsProps) {
  const resolvedParams = use(params);

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="py-6">
        <PlaceholderPage
          title={`Order Details — #${resolvedParams.id}`}
          description={`Comprehensive tracking and item breakdown for order #${resolvedParams.id}, including live courier tracking, invoice summary, and order status.`}
          module="Customer"
          plannedSprint="Sprint 4"
          icon={Truck}
          quickLinks={[
            { label: 'Back to Orders List', href: '/orders', primary: true },
            { label: 'Continue Shopping', href: '/shop' },
          ]}
        />
      </div>
    </ProtectedRoute>
  );
}
