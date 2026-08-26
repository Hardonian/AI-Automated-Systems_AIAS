"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/structured-data";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
}

export function Breadcrumbs({
  items,
  showHomeIcon = true,
  className = "",
}: BreadcrumbsProps) {
  // Build schema items with full URLs
  const baseUrl = "https://aiautomatedsystems.ca";
  const allItems = [{ label: "Home", href: "/" }, ...items];

  const schemaItems = allItems.map((item) => ({
    name: item.label,
    url: item.href
      ? item.href.startsWith("http")
        ? item.href
        : `${baseUrl}${item.href}`
      : baseUrl,
  }));

  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center overflow-x-auto py-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground ${className}`}
      >
        <ol className="flex items-center space-x-1.5 min-w-0" role="list">
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-1 transition-colors hover:text-primary"
              aria-label="AIAS Home"
            >
              {showHomeIcon ? <Home className="h-3.5 w-3.5" /> : "HOME"}
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center space-x-1.5 min-w-0">
                <ChevronRight
                  className="h-3 w-3 shrink-0 text-muted-foreground/60"
                  aria-hidden="true"
                />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="truncate transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="truncate text-foreground font-black"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
