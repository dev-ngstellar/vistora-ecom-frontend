'use client';

import React from 'react';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { Boxes } from 'lucide-react';

export default function AdminInventoryPage() {
  return (
    <div className="py-4">
      <PlaceholderPage
        title="Inventory & Stock Movements"
        description="Monitor real-time warehouse stock levels, conduct stock adjustments, set low stock thresholds, and log stock-in / stock-out transactions."
        module="Admin"
        plannedSprint="Sprint 3"
        icon={Boxes}
        quickLinks={[
          { label: 'Products Catalog', href: '/admin/products', primary: true },
          { label: 'Dashboard', href: '/admin/dashboard' },
        ]}
      />
    </div>
  );
}
