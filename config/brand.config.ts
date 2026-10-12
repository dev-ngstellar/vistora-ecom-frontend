export const brandConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'VISTORA TRADING PRIVATE LIMITED',
  tradeName: 'Vistora',
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT_NAME || 'VISTORA',
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'One Destination. Endless Choices...',
  logoLetter: process.env.NEXT_PUBLIC_BRAND_LOGO_LETTER || 'V',
  logoUrl: 'https://res.cloudinary.com/ggvs7siw/image/upload/v1789622236/logo.png',
  
  // Temporary Maintenance / Hold Mode (Set to true to hold site with Coming Soon screen, false to restore normal)
  isMaintenanceHold: true,
  
  // Official Merchant Details (Razorpay & Legal Compliance)
  merchantLegalName: 'VISTORA TRADING PRIVATE LIMITED',
  officialAddress: '31 H1, Ayyampalayam, Edapadi Road, Komarapalayam - 638183, Tamil Nadu, India',
  supportPhone: '9344447088',
  contactPhone: '+91 93444 47088',
  supportEmail: 'vistoraoffice123@gmail.com',
  supportHours: '9:00 AM – 9:00 PM (All 7 days)',
  
  // Grievance Redressal
  grievanceOfficer: {
    name: 'L. A. D. Palanisamy',
    email: 'vistoraoffice123@gmail.com',
  },
  
  // Policies & SLAs
  dispatchSla: '2–3 business days after order confirmation and payment',
  deliveryTimeline: '2–5 business days after dispatch depending on location',
  serviceableArea: 'Pan India (Subject to PIN code serviceability)',
  freeDeliveryZones: ['Komarapalayam', 'Bhavani'],
  returnReplacementWindow: '24 hours from delivery for Grocery & Grains',
  refundSla: '5–7 business days after approval',
  governingJurisdiction: 'Courts of Namakkal District, Tamil Nadu',
  
  copyright: `© ${new Date().getFullYear()} VISTORA TRADING PRIVATE LIMITED. All rights reserved.`,
  currency: {
    symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹',
    code: process.env.NEXT_PUBLIC_CURRENCY_CODE || 'INR',
  },
};

