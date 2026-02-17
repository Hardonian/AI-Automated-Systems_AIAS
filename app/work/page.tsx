import type { Metadata } from 'next';

import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { redirect } from 'next/navigation';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Work | AI Automated Systems',
  description:
    'Explore our portfolio of successful automation engagements and client outcomes.',
  canonical: '/work',
});

export default function WorkPage() {
  // Redirect to case-studies for now - they're the same content
  redirect('/case-studies');
}
