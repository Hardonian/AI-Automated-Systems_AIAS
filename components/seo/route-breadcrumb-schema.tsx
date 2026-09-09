"use client";

import { usePathname } from "next/navigation";

import { SITE_URL } from "@/lib/seo/metadata";

const titleCase = (value: string) =>
  decodeURIComponent(value)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

/** Emits exactly one BreadcrumbList for every route, including static slugs. */
export function RouteBreadcrumbSchema() {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    ...segments.map((segment, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: titleCase(segment),
      item: `${SITE_URL}/${segments.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement,
        }),
      }}
      id="route-breadcrumb-schema"
      type="application/ld+json"
    />
  );
}
