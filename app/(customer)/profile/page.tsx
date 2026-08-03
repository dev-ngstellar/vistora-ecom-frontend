'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="py-6">
        <PlaceholderPage
          title="Customer Profile & Settings"
          description="Manage your account details, edit personal info, update shipping addresses, change passwords, and manage notification preferences."
          module="Customer"
          plannedSprint="Sprint 3"
          icon={User}
          quickLinks={[
            { label: 'View My Orders', href: '/orders', primary: true },
            { label: 'Back to Home', href: '/' },
          ]}
        />
      </div>
    </ProtectedRoute>
  );
}
