import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { ReactNode } from "react";

import { FocusVisibleStyles } from "@/components/accessibility/focus-visible";
import { SkipLink } from "@/components/accessibility/skip-link";
import AgentProvider from "@/components/agent/AgentProvider";
import { UTMTracker } from "@/components/analytics/utm-tracker";
import { PerformanceHUD } from "@/components/dev/performance-hud";
import { EnhancedStickyCTA } from "@/components/layout/enhanced-sticky-cta";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WebVitalsTracker } from "@/components/performance/WebVitalsTracker";
import { PerformanceBeacon } from "@/components/performance-beacon";
import { PWARegistration } from "@/components/pwa-registration";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/structured-data";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryProvider } from "@/lib/data/react-query";
import { env, getOptionalEnv } from "@/lib/env";
import { EnhancedErrorBoundary } from "@/lib/error-handling/error-boundary-enhanced";
import { TelemetryProvider } from "@/lib/monitoring/telemetry-provider";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

const siteUrl = env.app.siteUrl || "https://aiautomatedsystems.ca";

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: "AI Automated Systems | Custom AI Platform Development | Transform Your Business",
    description: "We build custom AI platforms — not integrations. See TokPulse and Hardonia Suite. Save 10+ hours/week. 40% ROI increase. From strategy to deployment. Schedule a free strategy call. No credit card required.",
    canonical: "/",
    keywords: [
      "custom AI platforms",
      "AI development",
      "AI Automated Systems",
      "TokPulse",
      "Hardonia Suite",
      "AI automation",
      "workflow automation",
      "custom AI solutions",
      "AI platform development",
      "business automation",
      "Canadian AI development",
      "enterprise AI",
      "AI agents",
      "no-code AI",
      "systems thinking",
      "AI age skills",
      "job market advantage",
      "business success",
      "ROI increase",
      "time savings",
      "PIPEDA compliant",
      "Canadian data residency",
      "enterprise security",
      "99.9% uptime",
      "free trial",
      "no credit card required",
      "systems thinking training",
      "critical thinking skills",
      "holistic problem solving",
      "root cause analysis",
      "multi-perspective thinking",
      "career differentiation",
      "systems thinking methodology",
      "genai content engine",
      "automated website creation",
      "ai blog analysis",
      "website automation",
      "genai website generator",
    ],
  }),
  authors: [{ name: "AI Automated Systems", url: siteUrl }],
  creator: "AI Automated Systems",
  publisher: "AI Automated Systems",
  category: "Technology",
  classification: "Business Software",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    // Note: Additional icon files can be added when available
    // { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
    // { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
    // { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
  ],
  manifest: "/manifest.json",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "en-CA": "/",
    },
  },
  openGraph: {
    title: "AI Automated Systems — Custom AI Platform Development | Canadian-Built",
    description: "We build custom AI platforms — not integrations. See TokPulse and Hardonia Suite. From strategy to deployment. Schedule a strategy call.",
    type: "website",
    url: siteUrl,
    siteName: "AI Automated Systems",
    locale: "en_US",
    alternateLocale: ["en_CA"],
    images: [
      {
        url: `${siteUrl}/api/og?title=${encodeURIComponent("AI Automated Systems")}&description=${encodeURIComponent("Custom AI Platform Development")}`,
        width: 1200,
        height: 630,
        alt: "AI Automated Systems — Custom AI Platform Development",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automated Systems — Custom AI Platform Development",
    description: "We build custom AI platforms — not integrations. See TokPulse and Hardonia Suite. From strategy to deployment.",
    creator: "@aias_platform",
    site: "@aias_platform",
    images: [`${siteUrl}/api/og?title=${encodeURIComponent("AI Automated Systems")}&description=${encodeURIComponent("Custom AI Platform Development")}`],
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
    google: getOptionalEnv('NEXT_PUBLIC_GOOGLE_VERIFICATION'),
    yandex: getOptionalEnv('NEXT_PUBLIC_YANDEX_VERIFICATION'),
    yahoo: getOptionalEnv('NEXT_PUBLIC_YAHOO_VERIFICATION'),
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = "en";
  const isRTL = false;

  return (
    <html suppressHydrationWarning dir={isRTL ? "rtl" : "ltr"} lang={locale}>
      <head>
        {/* Performance: Resource hints */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com" rel="dns-prefetch" />
        <link href="https://fonts.gstatic.com" rel="dns-prefetch" />
        <link href="https://*.supabase.co" rel="dns-prefetch" />
        <link href="https://*.supabase.in" rel="dns-prefetch" />
        
        {/* Preload critical resources */}
        <link as="font" crossOrigin="anonymous" href="/fonts/inter-var.woff2" rel="preload" type="font/woff2" />
        
        {/* Prefetch likely next pages */}
        <link href="/signup" rel="prefetch" />
        <link href="/pricing" rel="prefetch" />
        
        {/* PWA */}
        <link href="/manifest.json" rel="manifest" />
        <meta content="#3b82f6" name="theme-color" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="default" name="apple-mobile-web-app-status-bar-style" />
        <meta content="AI Automated Systems" name="apple-mobile-web-app-title" />
        
        {/* SEO: Enhanced meta tags */}
        <meta content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" name="viewport" />
        <meta content="telephone=no" name="format-detection" />
        <meta content="yes" name="mobile-web-app-capable" />
        <meta content="AI Automated Systems" name="application-name" />
        
        {/* Service Worker - Use Next.js Script component for better security */}
        <script
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
        
        {/* Structured Data */}
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className="min-h-dvh antialiased">
        <FocusVisibleStyles />
        <EnhancedErrorBoundary>
          <ReactQueryProvider>
            <TelemetryProvider>
              <ThemeProvider>
                <SmoothScroll>
                {/* Accessibility: Skip to main content link */}
                <SkipLink />
                <Header />
                <main 
                  aria-label="Main content" 
                  className="min-h-[calc(100vh-8rem)]"
                  id="main"
                  role="main"
                >
                  {children}
                </main>
                <Footer />
                <Analytics />
                <SpeedInsights />
                <EnhancedStickyCTA />
                <Toaster />
                <PWARegistration />
                <PerformanceHUD />
                <PerformanceBeacon />
                <WebVitalsTracker />
                <AgentProvider />
                <UTMTracker />
              </SmoothScroll>
            </ThemeProvider>
          </TelemetryProvider>
          </ReactQueryProvider>
        </EnhancedErrorBoundary>
      </body>
    </html>
  );
}
