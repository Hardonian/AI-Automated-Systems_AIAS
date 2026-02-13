import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Work | AI Automated Systems',
  description:
    'Explore our portfolio of successful automation engagements and client outcomes.',
};

export default function WorkPage() {
  // Redirect to case-studies for now - they're the same content
  redirect('/case-studies');
}
