import Script from "next/script";

import { MESSAGING_CONTRACT } from "@/content/constants";

interface ProfessionalServiceSchemaProps {
  name?: string;
  url?: string;
  description?: string;
}

export function ProfessionalServiceSchema({
  name = "AI Automated Systems Consultancy",
  url = "https://aiautomatedsystems.ca",
  description = MESSAGING_CONTRACT.metadataDescription,
}: ProfessionalServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name,
    url,
    description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "CA",
      addressLocality: "Toronto",
      addressRegion: "ON",
    },
    sameAs: [
      "https://github.com/shardie-github/aias",
      "https://linkedin.com/company/aias-platform",
    ],
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="professional-service-schema"
      type="application/ld+json"
    />
  );
}

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  email?: string;
}

export function OrganizationSchema({
  name = "AI Automated Systems",
  url = "https://aiautomatedsystems.ca",
  logo = "https://aiautomatedsystems.ca/logo.png",
  email = "inquiries@aiautomatedsystems.ca",
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "CA",
    },
    sameAs: [
      "https://github.com/shardie-github/aias",
      "https://twitter.com/aias_platform",
      "https://linkedin.com/company/aias-platform",
    ],
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="organization-schema"
      type="application/ld+json"
    />
  );
}

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
  hasSiteSearch?: boolean;
}

export function WebSiteSchema({
  name = "AI Automated Systems",
  url = "https://aiautomatedsystems.ca",
  description = MESSAGING_CONTRACT.metadataDescription,
  hasSiteSearch = false,
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    ...(hasSiteSearch
      ? {
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${url}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }
      : {}),
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="website-schema"
      type="application/ld+json"
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="breadcrumb-schema"
      type="application/ld+json"
    />
  );
}

interface ServiceSchemaProps {
  name?: string;
  description?: string;
  provider?: { name: string; url: string };
  areaServed?: string;
  serviceType?: string;
  idSuffix?: string;
}

export function ServiceSchema({
  name = "Deterministic Automation Systems Design",
  description = MESSAGING_CONTRACT.metadataDescription,
  provider = {
    name: "AI Automated Systems",
    url: "https://aiautomatedsystems.ca",
  },
  areaServed = "Worldwide",
  serviceType = "Consulting",
  idSuffix = "default",
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider.name,
      url: provider.url,
    },
    areaServed: {
      "@type": "Country",
      name: areaServed,
    },
    serviceType,
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id={`service-schema-${idSuffix}`}
      type="application/ld+json"
    />
  );
}

interface ServiceListSchemaProps {
  services: Array<{ name: string; description: string; serviceType: string }>;
}

export function ServiceListSchema({ services }: ServiceListSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": services.map((service) => ({
      "@type": "Service",
      name: service.name,
      description: service.description,
      serviceType: service.serviceType,
      provider: {
        "@type": "Organization",
        name: "AI Automated Systems",
        url: "https://aiautomatedsystems.ca",
      },
      areaServed: {
        "@type": "Country",
        name: "Canada",
      },
    })),
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="service-list-schema"
      type="application/ld+json"
    />
  );
}

interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="faq-schema"
      type="application/ld+json"
    />
  );
}

interface BlogCollectionSchemaProps {
  url?: string;
  name?: string;
  description?: string;
}

export function BlogCollectionSchema({
  url = "https://aiautomatedsystems.ca/blog",
  name = "AI Automated Systems Blog",
  description = "Daily articles on systems thinking, AI automation, and business success.",
}: BlogCollectionSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name,
    description,
    url,
    publisher: {
      "@type": "Organization",
      name: "AI Automated Systems",
      url: "https://aiautomatedsystems.ca",
    },
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="blog-collection-schema"
      type="application/ld+json"
    />
  );
}

interface CaseStudySchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
}

export function CaseStudySchema({
  title,
  description,
  url,
  datePublished = "2024-01-01",
}: CaseStudySchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    author: {
      "@type": "Organization",
      name: "AI Automated Systems",
      url: "https://aiautomatedsystems.ca",
    },
    publisher: {
      "@type": "Organization",
      name: "AI Automated Systems",
      logo: {
        "@type": "ImageObject",
        url: "https://aiautomatedsystems.ca/logo.png",
      },
    },
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id={`case-study-schema-${title.toLowerCase().replace(/\s+/g, "-")}`}
      type="application/ld+json"
    />
  );
}

interface WebApplicationSchemaProps {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  operatingSystem?: string;
}

export function WebApplicationSchema({
  name,
  description,
  url,
  applicationCategory = "BusinessApplication",
  operatingSystem = "All",
}: WebApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "AI Automated Systems",
      url: "https://aiautomatedsystems.ca",
    },
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id={`web-app-schema-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
      type="application/ld+json"
    />
  );
}
