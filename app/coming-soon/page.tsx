import { Metadata } from 'next';
import { ComingSoonContent } from '@/components/coming-soon/coming-soon-content';
import { brandConfig } from '@/config';

export const metadata: Metadata = {
  title: `We'll Be Back Soon | ${brandConfig.shortName}`,
  description: `${brandConfig.name} is currently undergoing scheduled maintenance and system updates. We will be back shortly.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComingSoonPage() {
  return <ComingSoonContent />;
}
