import type { Metadata } from 'next';

import { CaseStudyDashboard } from '@/components/sales/case-study-dashboard';

export const metadata: Metadata = {
  title: 'Case Studies — Admin | AI Automated Systems',
  description: 'Manage customer success stories for sales and marketing',
};

export default function CaseStudiesPage() {
  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <h1 className='mb-2 text-3xl font-bold'>Case Studies</h1>
        <p className='text-muted-foreground'>
          Manage customer success stories. Target: 3 case studies
        </p>
      </div>
      <CaseStudyDashboard />
    </div>
  );
}
