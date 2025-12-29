import type { Metadata } from "next";

interface SEOOptions {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
  type?: "website" | "article" | "product";
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aiautomatedsystems.ca";

export function generateEnhancedMetadata(options: SEOOptions): Metadata {
  const {
    title,
    description,
    canonical = "/",
    keywords = [],
    ogImage,
    noindex = false,
    type = "website",
  } = options;

  const fullTitle = title.includes("AI Automated Systems") 
    ? title 
    : `${title} | AI Automated Systems`;

  const defaultOgImage = ogImage || `${siteUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonical.startsWith("http") ? canonical : `${siteUrl}${canonical}`,
    },
    openGraph: {
      title: fullTitle,
      description,
      type,
      url: `${siteUrl}${canonical}`,
      siteName: "AI Automated Systems",
      locale: "en_US",
      alternateLocale: ["en_CA"],
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: "@aias_platform",
      site: "@aias_platform",
      images: [defaultOgImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
