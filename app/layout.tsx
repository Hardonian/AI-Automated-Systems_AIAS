import "./globals.css";
import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const fontHeading = Space_Grotesk({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-heading",
});

const fontBody = JetBrains_Mono({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-body",
});

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import {
  OrganizationSchema,
  ProfessionalServiceSchema,
  WebSiteSchema,
} from "@/components/seo/structured-data";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsRuntime } from "@/components/analytics/analytics-runtime";
import { PerformanceRuntime } from "@/components/analytics/performance-runtime";
import { RouteBreadcrumbSchema } from "@/components/seo/route-breadcrumb-schema";
import { Toaster } from "@/components/ui/toaster";
import { MobileStickyCTA } from "@/components/layout/mobile-sticky-cta";
import { ExperienceControls } from "@/components/layout/experience-controls";
import { getOptionalEnv } from "@/lib/env";
import { EnhancedErrorBoundary } from "@/lib/error-handling/error-boundary-enhanced";
import {
  generateMetadata as generateSEOMetadata,
  SITE_URL,
} from "@/lib/seo/metadata";
import {
  MESSAGING_CONTRACT,
  TAGLINE_TITLE_TEMPLATE,
} from "@/content/constants";

const ogImageUrl = `${SITE_URL}/og-image.png`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#070A12",
};

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: TAGLINE_TITLE_TEMPLATE,
    description: MESSAGING_CONTRACT.metadataDescription,
    canonical: "/",
    keywords: [
      "agentic automation",
      "agentic automation consultancy",
      "workflow automation",
      "AI agents",
      "automation training",
      "systems thinking",
      "human-in-the-loop",
      "operational reliability",
      "deterministic automation systems",
      "enterprise automation",
      "governance and guardrails",
    ],
  }),
  authors: [{ name: "AI Automated Systems", url: SITE_URL }],
  creator: "AI Automated Systems",
  publisher: "AI Automated Systems",
  applicationName: "AI Automated Systems",
  category: "Technology",
  classification: "Business Software",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "en-CA": "/",
    },
  },
  openGraph: {
    title: TAGLINE_TITLE_TEMPLATE,
    description: MESSAGING_CONTRACT.metadataDescription,
    type: "website",
    url: SITE_URL,
    siteName: "AI Automated Systems",
    locale: "en_US",
    alternateLocale: ["en_CA"],
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: TAGLINE_TITLE_TEMPLATE,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TAGLINE_TITLE_TEMPLATE,
    description: MESSAGING_CONTRACT.metadataDescription,
    images: [ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: getOptionalEnv("NEXT_PUBLIC_GOOGLE_VERIFICATION"),
    yandex: getOptionalEnv("NEXT_PUBLIC_YANDEX_VERIFICATION"),
    yahoo: getOptionalEnv("NEXT_PUBLIC_YAHOO_VERIFICATION"),
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Automated Systems",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = "en";
  const isRTL = false;

  return (
    <html
      className="dark"
      data-scroll-behavior="smooth"
      dir={isRTL ? "rtl" : "ltr"}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <link href="/manifest.json" rel="manifest" />
        <link
          href="/rss.xml"
          rel="alternate"
          title="AIAS RSS"
          type="application/rss+xml"
        />
        <link
          href="/atom.xml"
          rel="alternate"
          title="AIAS Atom"
          type="application/atom+xml"
        />

        <OrganizationSchema />
        <ProfessionalServiceSchema />
        <WebSiteSchema hasSiteSearch={false} />
      </head>
      <body
        className={`min-h-dvh antialiased ${fontHeading.variable} ${fontBody.variable}`}
      >
        <EnhancedErrorBoundary>
          <ThemeProvider>
            {/* Item 33: Skip navigation (WCAG 2.4.1) */}
            <nav aria-label="Skip links">
              <a
                className="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:border-2 focus:border-primary focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-bold focus:uppercase focus:text-primary focus:shadow-[4px_4px_0px_0px_hsl(var(--text))]"
                href="#main"
              >
                [ Skip to Main Content ]
              </a>
            </nav>
            <RouteBreadcrumbSchema />
            <Header />
            <main
              aria-label="Main content"
              className="min-h-[calc(100vh-8rem)]"
              id="main"
              role="main"
              tabIndex={-1}
            >
              {children}
            </main>
            <Footer />
            <AnalyticsRuntime />
            <PerformanceRuntime />
            <MobileStickyCTA />
            <ExperienceControls />
            <Toaster />
            <Script
              dangerouslySetInnerHTML={{
                __html: `
              if('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('Service Worker registration failed:', err);
                  });
                });
              }
            `,
              }}
              id="service-worker-registration"
            />
          </ThemeProvider>
        </EnhancedErrorBoundary>
      </body>
    </html>
  );
}
