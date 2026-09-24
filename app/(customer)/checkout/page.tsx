'use client';

import React from 'react';
import { CheckoutView } from '@/components/shopping/checkout-view';
import { ProtectedRoute } from '@/components/protected-route';

export default function CheckoutPage() {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <CheckoutView />
    </ProtectedRoute>
  );
}
