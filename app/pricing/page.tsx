import { Check } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { MobileStickyCTA } from '@/components/layout/mobile-sticky-cta';
import { PricingAnalytics } from '@/components/pricing/PricingAnalytics';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Pricing — AI Automated Systems | Engagement Packages',
  description:
    'Practical engagement packages for automation consulting. Pilot, Scale, and Enable phases.',
};

const plans = [
  {
    name: 'Pilot',
    price: 'From $15,000',
    period: 'project',
    tagline: 'Ship your first automation',
    description:
      'Focused 2-4 week engagement to design, build, and deploy your first production workflow.',
    features: [
      '1-2 production workflows shipped',
      'Complete documentation and runbooks',
      'Observability and monitoring setup',
      'Governance baseline configuration',
      'Knowledge transfer session',
    ],
    cta: 'Start a Pilot',
    href: '/contact',
    popular: true,
  },
  {
    name: 'Scale',
    price: 'From $50,000',
    period: 'project',
    tagline: 'Expand across workflows',
    description:
      '6-12 week engagement to expand automation to additional workflows and systems.',
    features: [
      '3-8 production workflows',
      'Integration with enterprise systems',
      'Advanced observability and alerting',
      'Cross-workflow orchestration',
      'Internal capability building',
    ],
    cta: 'Discuss Scale',
    href: '/contact',
    popular: false,
  },
  {
    name: 'Enable',
    price: 'From $5,000',
    period: 'month',
    tagline: 'Ongoing partnership',
    description:
      'Continuous support to train your team and iterate on automations.',
    features: [
      'Monthly workshop training',
      'Office hours (4 hours/month)',
      'Pattern documentation support',
      'Priority response for issues',
      'Quarterly capability review',
    ],
    cta: 'Start Enable',
    href: '/contact',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className='container px-4 py-12 md:py-16'>
      <MobileStickyCTA primaryHref='/contact' primaryLabel='Book a Call' />
      <PricingAnalytics />
      <div className='mb-12 px-4 text-center'>
        <h1 className='mb-6 text-4xl font-extrabold md:text-5xl lg:text-6xl'>
          Engagement Packages
        </h1>
        <p className='mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl'>
          Practical consulting engagements to design, deploy, and train your
          team on reliable agentic automation.
        </p>
        <div className='mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary md:px-6 md:py-3 md:text-base'>
          <span>🇨🇦 Canadian Operations</span>
          <span>•</span>
          <span>Systems Thinking Approach</span>
          <span>•</span>
          <span>Practical Delivery</span>
        </div>
        <div className='mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:text-base'>
          <span className='flex items-center gap-2'>
            <Check aria-hidden='true' className='h-4 w-4 text-green-500' />
            No fake metrics
          </span>
          <span className='flex items-center gap-2'>
            <Check aria-hidden='true' className='h-4 w-4 text-green-500' />
            Tangible deliverables
          </span>
          <span className='flex items-center gap-2'>
            <Check aria-hidden='true' className='h-4 w-4 text-green-500' />
            Teams trained
          </span>
        </div>
      </div>

      <div className='mx-auto mb-12 grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3 md:gap-8'>
        {plans.map(plan => (
          <Card
            key={plan.name}
            className={`relative transition-all hover:shadow-xl ${
              plan.popular
                ? 'scale-105 border-2 border-primary bg-gradient-to-br from-primary/5 to-transparent shadow-2xl md:scale-110'
                : 'border-2 hover:border-primary/50'
            }`}
          >
            {plan.popular && (
              <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                <span className='rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground'>
                  Most Common Starting Point
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className='text-2xl'>{plan.name}</CardTitle>
              <CardDescription className='mt-1 text-sm font-medium text-primary'>
                {plan.tagline}
              </CardDescription>
              <div className='mt-4'>
                <span className='text-4xl font-bold'>{plan.price}</span>
                <span className='text-muted-foreground'>/{plan.period}</span>
              </div>
              <CardDescription className='mt-3 text-sm leading-relaxed'>
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-6'>
              <ul className='mb-8 space-y-3'>
                {plan.features.map(feature => (
                  <li key={feature} className='flex items-start gap-2'>
                    <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                    <span className='text-sm'>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className='h-12 w-full text-base font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl md:h-14 md:text-lg'
                size='lg'
                variant={plan.popular ? 'default' : 'outline'}
              >
                <Link
                  aria-label={`${plan.cta} - ${plan.name}`}
                  href={plan.href}
                >
                  {plan.cta}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='mx-auto max-w-3xl space-y-6 px-4'>
        <div className='mb-8 text-center'>
          <h2 className='mb-4 text-2xl font-bold md:text-3xl'>
            What&apos;s Included
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Every Engagement Includes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {[
                'Complete source code ownership',
                'Documentation and runbooks',
                'Observability and monitoring',
                'Governance framework',
                'Knowledge transfer sessions',
                'Post-launch support window',
              ].map(item => (
                <li key={item} className='flex items-center gap-2 text-sm'>
                  <Check className='h-4 w-4 flex-shrink-0 text-primary' />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Not Included</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>
                • Ongoing hosting or infrastructure costs (billed directly by
                providers)
              </li>
              <li>• Third-party API costs (billed by respective services)</li>
              <li>
                • Legal or compliance review (your legal team&apos;s
                responsibility)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className='mt-12 text-center'>
        <p className='mb-4 text-muted-foreground'>
          Want a productized offering for teams with internal capability?
        </p>
        <Button asChild variant='outline'>
          <Link href='/saas'>View SaaS Options</Link>
        </Button>
      </div>
    </div>
  );
}
