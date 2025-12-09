/**
 * Comprehensive SEO Metadata Utilities
 * Centralized SEO configuration for all pages
 */

import { Metadata } from 'next';

import { env } from '@/lib/env';

const siteUrl = env.app.siteUrl || 'https://aiautomatedsystems.ca';
const siteName = 'AI Automated Systems';
const defaultDescription = 'We build custom AI platforms — not integrations. See TokPulse and Hardonia Suite. Save 10+ hours/week. 40% ROI increase. From strategy to deployment. Schedule a free strategy call. No credit card required.';

export interface SEOConfig {
  title: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

/**
 * Generate comprehensive metadata for a page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description = defaultDescription,
    keywords = [],
    canonical,
    ogImage = `${siteUrl}/og-image.jpg`,
    noindex = false,
    nofollow = false,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = 'AI Automated Systems',
    section,
    tags = [],
  } = config;

  const fullTitle = title.includes('|') ? title : `${title} | ${siteName}`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return {
    title: {
      default: fullTitle,
      template: `%s | ${siteName}`,
    },
    description: description.substring(0, 160), // Max 160 chars for SEO
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: author, url: siteUrl }],
    creator: author,
    publisher: siteName,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: type === 'product' ? 'website' : type,
      title: fullTitle,
      description: description.substring(0, 200),
      url: canonicalUrl,
      siteName,
      locale: 'en_US',
      alternateLocale: ['en_CA'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author],
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description.substring(0, 200),
      images: [ogImage],
      creator: '@aiasystems',
      site: '@aiasystems',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    },
    category: 'Technology',
    classification: 'Business Software',
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'mobile-web-app-capable': 'yes',
    },
  };
}

/**
 * Generate structured data (JSON-LD) for rich snippets
 */
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Article' | 'Product', data: Record<string, unknown>) {
  const base = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Organization':
      return {
        ...base,
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        sameAs: [
          'https://twitter.com/aiasystems',
          'https://linkedin.com/company/aiasystems',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-XXX-XXX-XXXX',
          contactType: 'Customer Service',
          areaServed: 'CA',
          availableLanguage: ['English', 'French'],
        },
        ...data,
      };
    case 'WebSite':
      return {
        ...base,
        name: siteName,
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        ...data,
      };
    case 'Article':
      return {
        ...base,
        headline: data.headline,
        description: data.description,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        author: {
          '@type': 'Organization',
          name: siteName,
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.png`,
          },
        },
        ...data,
      };
    case 'Product':
      return {
        ...base,
        name: data.name,
        description: data.description,
        image: data.image,
        brand: {
          '@type': 'Brand',
          name: siteName,
        },
        offers: {
          '@type': 'Offer',
          url: data.url,
          priceCurrency: 'CAD',
          availability: 'https://schema.org/InStock',
          ...(data.offers || {}),
        },
        ...(data || {}),
      };
    default:
      return { ...base, ...data };
  }
}

/**
 * Common SEO keywords by category
 */
export const seoKeywords = {
  primary: [
    'custom AI platforms',
    'AI development',
    'AI Automated Systems',
    'TokPulse',
    'Hardonia Suite',
    'AI automation',
    'workflow automation',
  ],
  benefits: [
    'save time',
    'increase ROI',
    'business automation',
    'productivity tools',
    'efficiency software',
  ],
  location: [
    'Canadian AI development',
    'Canadian data residency',
    'PIPEDA compliant',
    'Toronto AI company',
  ],
  features: [
    'no-code AI',
    'AI agents',
    'custom workflows',
    'enterprise AI',
    'systems thinking',
  ],
  trust: [
    '99.9% uptime',
    'enterprise security',
    'SOC 2 compliant',
    'GDPR compliant',
  ],
};

/**
 * Generate keywords for a page based on categories
 */
export function generateKeywords(categories: (keyof typeof seoKeywords)[]): string[] {
  const keywords = new Set<string>();
  categories.forEach(category => {
    seoKeywords[category].forEach(keyword => keywords.add(keyword));
  });
  return Array.from(keywords);
}
