'use client';

import React from 'react';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  return (
    <div className="py-6">
      <PlaceholderPage
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions regarding orders, shipping policies, returns, sizing guides, and account management."
        module="Customer"
        plannedSprint="Sprint 3"
        icon={HelpCircle}
        quickLinks={[
          { label: 'Contact Support', href: '/contact', primary: true },
          { label: 'Shipping Terms', href: '/terms' },
        ]}
      />
    </div>
  );
}
