'use client';

import React from 'react';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-6">
      <PlaceholderPage
        title="Contact Us & Support"
        description="Reach our concierge customer service team, submit support tickets, view store locations, or initiate live chat."
        module="Customer"
        plannedSprint="Sprint 3"
        icon={Mail}
        quickLinks={[
          { label: 'View FAQ', href: '/faq', primary: true },
          { label: 'Back to Home', href: '/' },
        ]}
      />
    </div>
  );
}
