'use client';

import { Building2, Rocket, Users, Globe } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getSectionClasses,
  getContainerClasses,
  TYPOGRAPHY,
  GRID_GAPS,
} from '@/lib/design-tokens';

const segments = [
  {
    icon: Building2,
    title: 'Enterprise Leaders',
    description:
      'Scale operations without headcount. Custom automation architectures that integrate with your ERP, CRM, and legacy systems.',
    benefits: [
      'Risk-free scalability',
      'Operational efficiency',
      'Data security & compliance',
    ],
  },
  {
    icon: Rocket,
    title: 'High-Growth Founders',
    description:
      'Accelerate product velocity. We build the custom AI features and platforms that would take your in-house team months.',
    benefits: [
      'Faster time-to-market',
      'Lower burn rate',
      'Technical competitive advantage',
    ],
  },
  {
    icon: Users,
    title: 'Agency Owners',
    description:
      'Productize your services. We turn manual client deliverables into automated, white-labeled AI platforms.',
    benefits: [
      'New revenue streams',
      'Higher margins',
      'Sticky client relationships',
    ],
  },
  {
    icon: Globe,
    title: 'E-Commerce Operators',
    description:
      'Automate the boring stuff. Multi-channel inventory, customer support, and order processing on autopilot.',
    benefits: ['24/7 operations', 'Reduced errors', 'Global expansion ready'],
  },
];

export function WhoWeHelp() {
  return (
    <section className={getSectionClasses('default', 'muted')}>
      <div className={getContainerClasses('default')}>
        <div className='mb-16 text-center'>
          <h2 className={`${TYPOGRAPHY.h3} mb-4`}>Who We Work With</h2>
          <p
            className={`${TYPOGRAPHY.body} mx-auto max-w-2xl text-muted-foreground`}
          >
            We partner with visionary leaders who want to leverage AI for
            structural competitive advantage, not just incremental gains.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${GRID_GAPS.default}`}
        >
          {segments.map(segment => {
            const Icon = segment.icon;
            return (
              <Card
                key={segment.title}
                className='border-none bg-background shadow-sm transition-all hover:shadow-md'
              >
                <CardHeader>
                  <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                    <Icon className='h-6 w-6 text-primary' />
                  </div>
                  <CardTitle className='text-xl'>{segment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`mb-6 leading-relaxed text-muted-foreground ${TYPOGRAPHY.bodySmall}`}
                  >
                    {segment.description}
                  </p>
                  <ul className='space-y-2'>
                    {segment.benefits.map(benefit => (
                      <li
                        key={benefit}
                        className={`flex items-center gap-2 ${TYPOGRAPHY.badge}`}
                      >
                        <span className='h-1.5 w-1.5 rounded-full bg-primary' />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
