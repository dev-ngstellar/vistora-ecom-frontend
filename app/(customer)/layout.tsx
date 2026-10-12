import React from 'react';
import { CustomerHeader } from '@/components/layout/customer-header';
import { CustomerFooter } from '@/components/layout/customer-footer';
import { DynamicBreadcrumb } from '@/components/navigation/breadcrumb';
import { ComingSoonContent } from '@/components/coming-soon/coming-soon-content';
import { brandConfig } from '@/config';

export default function CustomerGlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If site is on temporary hold, show isolated Coming Soon page without site links or header/footer
  if (brandConfig.isMaintenanceHold) {
    return <ComingSoonContent />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      <CustomerHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-2">
        <DynamicBreadcrumb />
      </div>
      <main className="flex-1 w-full">{children}</main>
      <CustomerFooter />
    </div>
  );
};
