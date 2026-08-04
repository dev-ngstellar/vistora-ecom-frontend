'use client';

import React from 'react';

import { brandConfig, seoConfig, socialConfig } from '@/config';

interface JsonLdProps {
  type?: 'Organization' | 'Product';
  data?: Record<string, any>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ type = 'Organization', data }) => {
  const baseUrl = seoConfig.siteUrl;

  const defaultOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brandConfig.name,
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    sameAs: Object.values(socialConfig.links).filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: seoConfig.jsonLdOrg.telephone,
      contactType: 'customer service',
      areaServed: seoConfig.jsonLdOrg.areaServed,
      availableLanguage: seoConfig.jsonLdOrg.languages,
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
