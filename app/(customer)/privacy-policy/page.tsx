'use client';

import React from 'react';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-6">
      <PlaceholderPage
        title="Privacy Policy"
        description="Information on how Vistora Commerce collects, uses, protects, and stores user personal data and cookies in compliance with privacy regulations."
        module="Customer"
        plannedSprint="Sprint 3"
        icon={ShieldCheck}
        quickLinks={[
          { label: 'Terms of Service', href: '/terms', primary: true },
          { label: 'Back to Home', href: '/' },
        ]}
      />
    </div>
  );
}
