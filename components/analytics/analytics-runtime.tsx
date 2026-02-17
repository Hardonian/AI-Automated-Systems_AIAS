'use client';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export function AnalyticsRuntime() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? 'none';

  if (provider !== 'vercel') {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
