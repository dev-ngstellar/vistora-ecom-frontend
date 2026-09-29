import { brandConfig } from './brand.config';

export const seoConfig = {
  titleTemplate: `%s | ${brandConfig.shortName}`,
  defaultTitle: `${brandConfig.shortName} | Pure Grains, Millets, Spices & Traditional Grocery`,
  defaultDescription: 'Buy pure organic grains, traditional millets, stone-ground spices, and health mixes online from VISTORA TRADING PRIVATE LIMITED. Fast Pan India Delivery.',
  keywords: ['organic grains', 'traditional millets', 'spices', 'health mix', 'grocery delivery', 'vistora', 'vistora trading'],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://vistoracommerce.com',
  jsonLdOrg: {
    name: brandConfig.name,
    legalName: brandConfig.merchantLegalName,
    telephone: brandConfig.contactPhone,
    email: brandConfig.supportEmail,
    address: brandConfig.officialAddress,
    areaServed: 'Pan India',
    languages: ['English', 'Tamil', 'Hindi'],
  },
};

