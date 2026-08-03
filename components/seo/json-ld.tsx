'use client';

import React from 'react';

interface JsonLdProps {
  type?: 'Organization' | 'Product';
  data?: Record<string, any>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ type = 'Organization', data }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vistoracommerce.com';

  const defaultOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vistora Commerce',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    sameAs: [
      'https://instagram.com/vistoracommerce',
      'https://facebook.com/vistoracommerce',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-1800-200-9000',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  const schema = data ? { '@context': 'https://schema.org', '@type': type, ...data } : defaultOrgSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
