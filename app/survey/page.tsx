import type { Metadata } from 'next';
import { SurveyFlow } from '@/components/survey/SurveyFlow';

export const metadata: Metadata = {
  title: 'Survey | AI Automated Systems',
  description: 'Share your automation challenges and requirements. Help us understand your needs for a tailored engagement.',
};

export default function SurveyPage() {
  return <SurveyFlow />;
}
