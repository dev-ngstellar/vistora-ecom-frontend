'use client';

import React from 'react';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
import { Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-6">
      <PlaceholderPage
        title="About Vistora Commerce"
        description="Learn about our brand history, craftsmanship values, luxury design philosophy, and commitment to sustainable fashion innovation."
        module="Customer"
        plannedSprint="Sprint 3"
        icon={Sparkles}
        quickLinks={[
          { label: 'Explore Shop', href: '/shop', primary: true },
          { label: 'Contact Us', href: '/contact' },
        ]}
      />
    </div>
  );
}
