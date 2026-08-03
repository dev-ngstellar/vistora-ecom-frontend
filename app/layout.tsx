import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { JsonLd } from '@/components/seo/json-ld';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Vistora Commerce | Luxury Fashion eCommerce Platform',
    template: '%s | Vistora Commerce',
  },
  description: 'Single Vendor Fashion eCommerce Platform — Handcrafted Italian silk gowns, tailored suits, and luxury couture.',
  keywords: ['luxury fashion', 'haute couture', 'vistora commerce', 'menswear', 'womenswear', 'designer fashion'],
  authors: [{ name: 'Vistora Studio' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vistoracommerce.com'),
  openGraph: {
    title: 'Vistora Commerce | Luxury Fashion eCommerce Platform',
    description: 'Bespoke tailoring, handcrafted silk gowns, and luxury fashion outerwear.',
    url: 'https://vistoracommerce.com',
    siteName: 'Vistora Commerce',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Vistora Commerce Luxury Fashion',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vistora Commerce | Luxury Fashion eCommerce Platform',
    description: 'Bespoke tailoring, handcrafted silk gowns, and luxury fashion outerwear.',
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
