import type { Metadata } from 'next';

const DEFAULT_SITE_URL = 'https://aiautomatedsystems.ca';
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/og-image.svg`;

interface MetadataConfig {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
}

const toAbsoluteUrl = (canonical: string) => {
  if (canonical.startsWith('http://') || canonical.startsWith('https://')) {
    return canonical;
  }

  return `${DEFAULT_SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;
};

export function generateMetadata(config: MetadataConfig): Metadata {
  const canonical = config.canonical ?? '/';
  const canonicalUrl = toAbsoluteUrl(canonical);

  const metadata: Metadata = {
    title: config.title,
    description: config.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'AI Automated Systems',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };

  if (config.keywords?.length) {
    metadata.keywords = config.keywords;
  }

  return metadata;
}
