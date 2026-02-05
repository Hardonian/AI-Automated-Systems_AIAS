'use client';
import { ArrowRight, Rocket } from 'lucide-react';
import Link from 'next/link';

import FadeIn from '@/components/motion/fade-in';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const featuredCaseStudies = [
  {
    title: 'TokPulse — TikTok Analytics Platform',
    company: 'Built by AIAS Consultancy',
    location: 'Canada',
    flag: '🇨🇦',
    type: 'consultancy',
    description:
      'Custom analytics platform with AI-powered insights for TikTok campaign management. Complete platform architecture and deployment.',
  },
  {
    title: 'Hardonia Suite — E-Commerce Automation',
    company: 'Built by AIAS Consultancy',
    location: 'Canada',
    flag: '🇨🇦',
    type: 'consultancy',
    description:
      'End-to-end automation ecosystem for inventory management, order processing, and multi-channel operations.',
  },
  {
    title: 'Enterprise Workflow Automation',
    company: 'Fortune 500 Client',
    location: 'North America',
    flag: '🇺🇸',
    type: 'client',
    description:
      'Implemented support triage, invoice reconciliation, and compliance scanning workflows with human-in-the-loop gates.',
  },
];

export function CaseStudyPreview() {
  return (
    <section className='bg-muted/30 py-20'>
      <FadeIn>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-12 text-center'>
            <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
              <Rocket className='h-4 w-4' />
              Platforms Built by AIAS Consultancy
            </div>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              Custom AI Platforms We've Built
            </h2>
            <p className='mx-auto max-w-3xl text-lg text-muted-foreground'>
              These aren't integrations — they're complete platforms we
              architected and built. See TokPulse (TikTok analytics) and
              Hardonia Suite (e-commerce automation), plus client success
              stories.
            </p>
          </div>

          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
            {featuredCaseStudies.map(study => (
              <Card key={study.title} className='h-full'>
                <CardHeader>
                  <div className='mb-2 flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='mb-1 text-xl'>
                        {study.title}
                      </CardTitle>
                      <CardDescription className='flex items-center gap-1'>
                        {study.company} • {study.location} {study.flag}
                      </CardDescription>
                    </div>
                    {study.type === 'consultancy' && (
                      <Badge className='ml-2' variant='default'>
                        Consultancy Build
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='mb-4 text-sm text-muted-foreground'>
                    {study.description}
                  </p>
                  <Button asChild className='w-full' variant='outline'>
                    <Link
                      href={
                        study.type === 'consultancy'
                          ? '/showcase'
                          : '/case-studies'
                      }
                    >
                      {study.type === 'consultancy'
                        ? 'View Build Details'
                        : 'View Case Study'}{' '}
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='space-y-4 text-center'>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Button asChild size='lg' variant='outline'>
                <Link href='/case-studies'>
                  View All Case Studies <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button asChild size='lg' variant='outline'>
                <Link href='/showcase'>
                  See Upcoming Builds <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>
            <p className='text-sm text-muted-foreground'>
              AIAS Consultancy: Custom builds • AIAS Platform: Business
              automation
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
