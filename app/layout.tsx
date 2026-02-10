import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import {
  OrganizationSchema,
  WebSiteSchema,
} from '@/components/seo/structured-data';
import { ThemeProvider } from '@/components/theme-provider';

import { Toaster } from '@/components/ui/toaster';
import { env, getOptionalEnv } from '@/lib/env';
import { EnhancedErrorBoundary } from '@/lib/error-handling/error-boundary-enhanced';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

const siteUrl = env.app.siteUrl || 'https://aiautomatedsystems.ca';

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
  authors: [{ name: 'AI Automated Systems', url: siteUrl }],
  creator: 'AI Automated Systems',
  publisher: 'AI Automated Systems',
  category: 'Technology',
  classification: 'Business Software',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
  ],
  manifest: '/manifest.json',
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    siteName: 'AI Automated Systems',
    locale: 'en_US',
    alternateLocale: ['en_CA'],
    images: [
      {
        url: `${siteUrl}/api/og?title=${encodeURIComponent('AI Automated Systems')}&description=${encodeURIComponent('Agentic Automation Consultancy')}`,
        width: 1200,
        height: 630,
        alt: 'AI Automated Systems | Agentic Automation Consultancy',
        type: 'image/png',
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
      `${siteUrl}/api/og?title=${encodeURIComponent('AI Automated Systems')}&description=${encodeURIComponent('Agentic Automation Consultancy')}`,
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
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
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

        <link
          as='font'
          crossOrigin='anonymous'
          href='/fonts/inter-var.woff2'
          rel='preload'
          type='font/woff2'
        />

        <link href='/signup' rel='prefetch' />
        <link href='/pricing' rel='prefetch' />

        <link href='/manifest.json' rel='manifest' />
        <meta content='#3b82f6' name='theme-color' />
        <meta content='yes' name='apple-mobile-web-app-capable' />
        <meta content='default' name='apple-mobile-web-app-status-bar-style' />
        <meta
          content='AI Automated Systems'
          name='apple-mobile-web-app-title'
        />

        <meta
          content='width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover'
          name='viewport'
        />
        <meta content='telephone=no' name='format-detection' />
        <meta content='yes' name='mobile-web-app-capable' />
        <meta content='AI Automated Systems' name='application-name' />

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
          id='service-worker-registration'
        />

        <OrganizationSchema />
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
            <Analytics />
            <SpeedInsights />
            <Toaster />
          </ThemeProvider>
        </EnhancedErrorBoundary>
      </body>
    </html>
  );
}
