import Script from "next/script";

interface ProfessionalServiceSchemaProps {
  name?: string;
  url?: string;
  description?: string;
  priceRange?: string;
}

export function ProfessionalServiceSchema({
  name = "AI Automated Systems Consultancy",
  url = "https://aiautomatedsystems.ca",
  description = "Enterprise AI strategy, custom platform development, and workflow automation consultancy.",
  priceRange = "$$$",
}: ProfessionalServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name,
    url,
    description,
    priceRange,
    address: {
      "@type": "PostalAddress",
      addressCountry: "CA",
      addressLocality: "Toronto",
      addressRegion: "ON"
    },
    openingHours: "Mo,Tu,We,Th,Fr 09:00-17:00",
    telephone: "+1-800-AIAS-HELP",
    sameAs: [
      "https://github.com/shardie-github/aias",
      "https://linkedin.com/company/aias-platform"
    ]
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
  phone?: string;
}

export function OrganizationSchema({
  name = "AI Automated Systems",
  url = "https://aiautomatedsystems.ca",
  logo = "https://aiautomatedsystems.ca/logo.png",
  email = "support@aiautomatedsystems.ca",
  phone = "+1-800-AIAS-HELP",
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    email,
    telephone: phone,
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

interface SoftwareApplicationSchemaProps {
  name?: string;
  description?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
  };
}

export function SoftwareApplicationSchema({
  name = "AIAS Platform",
  description = "AI automation that speaks Canadian business. Save 10+ hours/week with no-code AI agents.",
  applicationCategory = "BusinessApplication",
  operatingSystem = "Web",
  offers = {
    price: "49",
    priceCurrency: "CAD",
  },
}: SoftwareApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "500",
    },
  };

  return (
    <Script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="software-application-schema"
      type="application/ld+json"
    />
  );
}

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
}

export function WebSiteSchema({
  name = "AI Automated Systems",
  url = "https://aiautomatedsystems.ca",
  description = "Custom AI platform development and automation solutions. Built in Canada, serving the world.",
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
}

export function ServiceSchema({
  name = "Custom AI Platform Development",
  description = "We architect and build custom AI platforms from the ground up",
  provider = {
    name: "AI Automated Systems",
    url: "https://aiautomatedsystems.ca",
  },
  areaServed = "Worldwide",
  serviceType = "Consulting",
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
      id="service-schema"
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
