import type { Metadata } from 'next';
import { Check, ArrowRight, Zap, Shield, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'SaaS Platform — AI Automated Systems | Productized Automation',
  description:
    'Productized offering for teams who already have internal capability. Build and manage automations independently.',
};

const features = [
  {
    icon: Zap,
    title: 'Visual Workflow Builder',
    description:
      'Drag-and-drop interface to design automation workflows without code.',
  },
  {
    icon: Shield,
    title: 'Built-in Guardrails',
    description:
      'PII handling, audit logs, and human-in-the-loop gates included.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Multiple users, role-based access, and shared templates.',
  },
];

const limits = [
  {
    tier: 'Starter',
    workflows: 'Up to 5 workflows',
    runs: '500 active runs/month',
    price: '$49/month',
    description: 'For teams getting started with automation',
  },
  {
    tier: 'Pro',
    workflows: 'Up to 15 workflows',
    runs: '2,500 active runs/month',
    price: '$149/month',
    description: 'For teams with multiple production automations',
  },
  {
    tier: 'Enterprise',
    workflows: 'Custom',
    runs: 'Custom volume',
    price: 'Contact us',
    description: 'For organizations with scale and compliance requirements',
  },
];

export default function SaasPage() {
  return (
    <main className='min-h-screen'>
      <section className='bg-gradient-to-b from-muted/30 via-background to-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <span className='mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary'>
            SaaS Platform
          </span>
          <h1 className='mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl'>
            Build Automations Independently
          </h1>
          <p className='mb-8 text-lg leading-relaxed text-muted-foreground md:text-xl'>
            Productized platform for teams who already have internal capability
            to design and operate agentic automation. Focus on building—we
            handle the infrastructure.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <a href='/signup'>Start Free Trial</a>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <a href='/contact'>Talk to Sales</a>
            </Button>
          </div>
          <p className='mt-4 text-sm text-muted-foreground'>
            14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-extrabold md:text-4xl'>
              Platform Features
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Everything you need to build, deploy, and monitor automations
              reliably.
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {features.map(feature => (
              <Card
                key={feature.title}
                className='border-2 transition-colors hover:border-primary/50'
              >
                <CardContent className='p-6'>
                  <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10'>
                    <feature.icon className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='mb-2 text-lg font-bold'>{feature.title}</h3>
                  <p className='text-muted-foreground'>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-extrabold md:text-4xl'>
              Simple, Transparent Pricing
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Pay for what you use. Upgrade or downgrade anytime.
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
            {limits.map(limit => (
              <Card
                key={limit.tier}
                className={`relative border-2 ${
                  limit.tier === 'Pro'
                    ? 'scale-105 border-primary shadow-lg'
                    : 'hover:border-primary/50'
                }`}
              >
                {limit.tier === 'Pro' && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                    <span className='rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground'>
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className='text-2xl'>{limit.tier}</CardTitle>
                  <CardDescription>{limit.description}</CardDescription>
                  <div className='mt-4'>
                    <span className='text-4xl font-bold'>{limit.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className='mb-6 space-y-3'>
                    <li className='flex items-center gap-2 text-sm'>
                      <Check className='h-4 w-4 flex-shrink-0 text-primary' />
                      {limit.workflows}
                    </li>
                    <li className='flex items-center gap-2 text-sm'>
                      <Check className='h-4 w-4 flex-shrink-0 text-primary' />
                      {limit.runs}
                    </li>
                    <li className='flex items-center gap-2 text-sm'>
                      <Check className='h-4 w-4 flex-shrink-0 text-primary' />
                      Email support
                    </li>
                  </ul>
                  <Button
                    asChild
                    className='w-full'
                    variant={limit.tier === 'Pro' ? 'default' : 'outline'}
                  >
                    <a href='/signup'>
                      {limit.tier === 'Enterprise'
                        ? 'Contact Sales'
                        : 'Start Free Trial'}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-4xl'>
          <div className='rounded-2xl bg-muted/30 p-8 md:p-12'>
            <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2'>
              <div>
                <h2 className='mb-4 text-2xl font-extrabold md:text-3xl'>
                  Need Help Getting Started?
                </h2>
                <p className='mb-6 text-muted-foreground'>
                  Our consulting team can help you design your first workflows,
                  train your team, and establish governance patterns.
                </p>
                <Button asChild variant='outline'>
                  <a href='/process'>
                    Explore Our Consulting Services
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </a>
                </Button>
              </div>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                  <div>
                    <p className='font-medium'>Workshop training available</p>
                    <p className='text-sm text-muted-foreground'>
                      1-2 day bootcamps for your team
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                  <div>
                    <p className='font-medium'>Pair-building sessions</p>
                    <p className='text-sm text-muted-foreground'>
                      Build together with our experts
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                  <div>
                    <p className='font-medium'>Ongoing enablement programs</p>
                    <p className='text-sm text-muted-foreground'>
                      Continuous capability building
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
