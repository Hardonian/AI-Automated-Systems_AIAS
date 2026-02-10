'use client';
import { Card, CardContent } from '@/components/ui/card';
import FadeIn from '@/components/motion/fade-in';
import {
  CheckCircle2,
  Shield,
  Award,
  Users,
  TrendingUp,
  Clock,
} from 'lucide-react';

const metrics = [
  {
    icon: CheckCircle2,
    value: '100%',
    label: 'Projects Delivered On Time',
    description: 'Every custom platform delivered as promised',
  },
  {
    icon: TrendingUp,
    value: '40%',
    label: 'Average ROI Increase',
    description: 'Clients see measurable business impact',
  },
  {
    icon: Users,
    value: '50+',
    label: 'Enterprise Clients',
    description: 'Trusted by brands worldwide',
  },
  {
    icon: Clock,
    value: '8-16',
    label: 'Weeks Average Timeline',
    description: 'From strategy to deployment',
  },
];

const certifications = [
  {
    name: 'PIPEDA Compliant',
    icon: Shield,
    description: 'Canadian privacy law compliance',
  },
  {
    name: 'SOC 2 Ready',
    icon: Shield,
    description: 'Enterprise security standards',
  },
  {
    name: 'ISO 27001 Aligned',
    icon: Award,
    description: 'Information security management',
  },
];

const clientTypes = [
  'E-Commerce Brands',
  'Marketing Agencies',
  'Enterprise Companies',
  'SaaS Platforms',
  'Healthcare Organizations',
  'Financial Services',
];

export function TrustSignals() {
  return (
    <section className='bg-background py-20'>
      <FadeIn>
        <div className='container mx-auto max-w-6xl'>
          {/* Metrics */}
          <div className='mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {metrics.map(metric => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label} className='text-center'>
                  <CardContent className='pt-6'>
                    <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                      <Icon className='h-6 w-6 text-primary' />
                    </div>
                    <div className='mb-2 text-4xl font-bold text-primary'>
                      {metric.value}
                    </div>
                    <div className='mb-1 font-semibold'>{metric.label}</div>
                    <div className='text-sm text-muted-foreground'>
                      {metric.description}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Certifications */}
          <div className='mb-16'>
            <h3 className='mb-8 text-center text-2xl font-bold'>
              Security & Compliance
            </h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              {certifications.map(cert => {
                const Icon = cert.icon;
                return (
                  <Card key={cert.name}>
                    <CardContent className='pt-6'>
                      <div className='flex items-center gap-4'>
                        <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                          <Icon className='h-6 w-6 text-primary' />
                        </div>
                        <div>
                          <div className='mb-1 font-semibold'>{cert.name}</div>
                          <div className='text-sm text-muted-foreground'>
                            {cert.description}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Client Types */}
          <div className='text-center'>
            <h3 className='mb-6 text-2xl font-bold'>Trusted By</h3>
            <div className='flex flex-wrap items-center justify-center gap-4'>
              {clientTypes.map(type => (
                <div
                  key={type}
                  className='rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium'
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
