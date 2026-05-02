import React from 'react';

/**
 * ── JsonLd Component ──
 * Injects Schema.org structured data for SEO.
 * Supports Website, Organization, and LocalBusiness schemas.
 */
const JsonLd = ({ type = 'Organization', data = {} }) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    "name": "Flyajwa Travel & Tourism",
    "url": "https://flyajwa.com",
    "logo": "https://flyajwa.com/logo.png",
    "sameAs": [
      "https://facebook.com/flyajwa",
      "https://instagram.com/fly_ajwa"
    ],
    ...data
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseData) }}
    />
  );
};

export default JsonLd;
