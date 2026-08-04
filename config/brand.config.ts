export const brandConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'Vistora Commerce',
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT_NAME || 'VISTORA',
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Luxury Apparel & Bespoke Fashion Platform',
  logoLetter: process.env.NEXT_PUBLIC_BRAND_LOGO_LETTER || 'V',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@vistoracommerce.com',
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1 (800) 200-9000',
  copyright: `© ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Vistora Commerce, Inc.'} All rights reserved.`,
  currency: {
    symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$',
    code: process.env.NEXT_PUBLIC_CURRENCY_CODE || 'USD',
  },
};
