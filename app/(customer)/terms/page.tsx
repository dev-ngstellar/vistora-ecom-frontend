'use client';

import React from 'react';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="py-6">
      <PlaceholderPage
        title="Terms of Service"
        description="Terms and conditions governing the purchase of products, site usage, intellectual property, and buyer-seller obligations on Vistora Commerce."
        module="Customer"
        plannedSprint="Sprint 3"
        icon={FileText}
        quickLinks={[
          { label: 'Privacy Policy', href: '/privacy-policy', primary: true },
          { label: 'Back to Home', href: '/' },
        ]}
      />
    </div>
  );
}
