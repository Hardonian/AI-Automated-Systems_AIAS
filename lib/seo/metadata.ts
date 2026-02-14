import type { Metadata } from 'next';

interface MetadataConfig {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
}

export function generateMetadata(config: MetadataConfig): Metadata {
  const metadata: Metadata = {
    title: config.title,
    description: config.description,
  };

  if (config.keywords?.length) {
    metadata.keywords = config.keywords;
  }

  if (config.canonical) {
    metadata.alternates = {
      canonical: config.canonical,
    };
  }

  return metadata;
}
