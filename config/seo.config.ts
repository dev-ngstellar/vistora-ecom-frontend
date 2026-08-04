import { brandConfig } from './brand.config';

export const seoConfig = {
  titleTemplate: `%s | ${brandConfig.name}`,
  defaultTitle: `${brandConfig.name} | Luxury Fashion eCommerce Platform`,
  defaultDescription: 'Single Vendor Fashion eCommerce Platform — Handcrafted Italian silk gowns, tailored suits, and luxury couture.',
  keywords: ['luxury fashion', 'haute couture', 'menswear', 'womenswear', 'designer fashion', 'ecommerce'],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://vistoracommerce.com',
  jsonLdOrg: {
    name: brandConfig.name,
    telephone: brandConfig.contactPhone,
    areaServed: 'Worldwide',
    languages: ['English', 'Hindi'],
  },
};
