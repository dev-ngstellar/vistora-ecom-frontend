'use client';

import React from 'react';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { Search } from 'lucide-react';

export default function SearchPage() {
  return (
    <div className="py-6">
      <PlaceholderPage
        title="Search Results"
        description="Search results with instant keyword match, faceted filters, and sorting parameters will display products matching your search term."
        module="Customer"
        plannedSprint="Sprint 3"
        icon={Search}
        quickLinks={[
          { label: 'Browse All Products', href: '/shop', primary: true },
          { label: 'Back to Home', href: '/' },
        ]}
      />
    </div>
  );
}
