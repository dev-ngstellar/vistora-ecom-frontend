'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="py-6">
        <PlaceholderPage
          title="Checkout & Payment"
          description="Secure multi-step checkout process with delivery address selection, order review, Razorpay / Stripe gateway integration, and order placement."
          module="Customer"
          plannedSprint="Sprint 4"
          icon={CreditCard}
          quickLinks={[
            { label: 'Review Cart', href: '/cart', primary: true },
            { label: 'Continue Shopping', href: '/shop' },
          ]}
        />
      </div>
    </ProtectedRoute>
  );
}
