import type { Metadata } from 'next';

import { SurveyFlow } from '@/components/survey/SurveyFlow';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Survey | AI Automated Systems',
  description: 'Share your automation challenges and requirements so AIAS can scope a practical, tailored engagement.',
  canonical: '/survey',
});

export default function SurveyPage() {
  return <SurveyFlow />;
}
