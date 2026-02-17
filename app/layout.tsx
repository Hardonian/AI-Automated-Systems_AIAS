import './globals.css';
import Script from 'next/script';
import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import {
  OrganizationSchema,
  ProfessionalServiceSchema,
  WebSiteSchema,
} from '@/components/seo/structured-data';
import { ThemeProvider } from '@/components/theme-provider';
import { AnalyticsRuntime } from '@/components/analytics/analytics-runtime';

import { Toaster } from '@/components/ui/toaster';
import { getOptionalEnv } from '@/lib/env';
import { EnhancedErrorBoundary } from '@/lib/error-handling/error-boundary-enhanced';
import { generateMetadata as generateSEOMetadata, SITE_URL } from '@/lib/seo/metadata';

const ogImageUrl = `${SITE_URL}/og-image.svg`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: 'AI Automated Systems | Agentic Automation Consultancy',
    description:
      'We help organizations design, deploy, and operate reliable agentic automations while training teams to run them safely and productively. Pilot → Scale → Enable engagement model.',
    canonical: '/',
    keywords: [
      'agentic automation',
      'AI consultancy',
      'workflow automation',
      'AI agents',
      'automation training',
      'systems thinking',
      'human-in-the-loop',
      'operational reliability',
      'Canadian AI consultancy',
      'enterprise automation',
      'governance and guardrails',
    ],
  }),
  authors: [{ name: 'AI Automated Systems', url: SITE_URL }],
  creator: 'AI Automated Systems',
  publisher: 'AI Automated Systems',
  applicationName: 'AI Automated Systems',
  category: 'Technology',
  classification: 'Business Software',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
  ],
  manifest: '/manifest.json',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'en-CA': '/',
    },
  },
  openGraph: {
    title: 'AI Automated Systems | Agentic Automation Consultancy',
    description:
      'We help organizations design, deploy, and operate reliable agentic automations while training teams to run them safely and productively.',
    type: 'website',
    url: SITE_URL,
    siteName: 'AI Automated Systems',
    locale: 'en_US',
    alternateLocale: ['en_CA'],
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'AI Automated Systems | Agentic Automation Consultancy',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automated Systems | Agentic Automation Consultancy',
    description:
      'We help organizations design, deploy, and operate reliable agentic automations while training teams to run them safely and productively.',
    creator: '@aias_platform',
    site: '@aias_platform',
    images: [
      ogImageUrl,
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: getOptionalEnv('NEXT_PUBLIC_GOOGLE_VERIFICATION'),
    yandex: getOptionalEnv('NEXT_PUBLIC_YANDEX_VERIFICATION'),
    yahoo: getOptionalEnv('NEXT_PUBLIC_YAHOO_VERIFICATION'),
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI Automated Systems',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = 'en';
  const isRTL = false;

  return (
    <html suppressHydrationWarning dir={isRTL ? 'rtl' : 'ltr'} lang={locale}>
      <head>
        <link href='https://fonts.googleapis.com' rel='preconnect' />
        <link
          crossOrigin='anonymous'
          href='https://fonts.gstatic.com'
          rel='preconnect'
        />
        <link href='https://fonts.googleapis.com' rel='dns-prefetch' />
        <link href='https://fonts.gstatic.com' rel='dns-prefetch' />
        <link href='/manifest.json' rel='manifest' />




        <OrganizationSchema />
        <ProfessionalServiceSchema />
        <WebSiteSchema />
      </head>
      <body className='min-h-dvh antialiased'>
        <EnhancedErrorBoundary>
          <ThemeProvider>
            <Header />
            <main
              aria-label='Main content'
              className='min-h-[calc(100vh-8rem)]'
              id='main'
              role='main'
            >
              {children}
            </main>
            <Footer />
            <AnalyticsRuntime />
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
              id='service-worker-registration'
            />
          </ThemeProvider>
        </EnhancedErrorBoundary>
      </body>
    </html>
  );
}
