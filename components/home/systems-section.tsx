'use client';

import { motion } from 'framer-motion';
import {
  Gauge,
  Shield,
  Layers,
  Zap,
  GitBranch,
  Lock,
  Cpu,
  Server,
  Database,
  Globe,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const systems = [
  {
    icon: Gauge,
    title: 'Control Planes',
    description:
      'State machine-based workflows with deterministic behavior. Every state has defined transitions, error handlers, and recovery procedures.',
    features: [
      'Visual state machine designer',
      'Built-in retry and circuit breaker',
      'Manual override switches',
      'Real-time state visualization',
    ],
  },
  {
    icon: Zap,
    title: 'Autopilot Systems',
    description:
      'Autonomous agents that handle routine decisions under human oversight. ML-enhanced but human-governed.',
    features: [
      'Confidence thresholds',
      'Batch human review queues',
      'A/B testing framework',
      'Continuous learning pipeline',
    ],
  },
  {
    icon: Shield,
    title: 'Governance & Guardrails',
    description:
      'Comprehensive safety systems that prevent drift and enforce policies. Audit trails for every action.',
    features: [
      'Policy engine with version control',
      'Role-based action permissions',
      'Automated compliance checking',
      'Complete audit logs',
    ],
  },
  {
    icon: GitBranch,
    title: 'Connector Maps',
    description:
      'Pre-built and custom integrations with your existing tools. API-first design with webhook support.',
    features: [
      '50+ pre-built connectors',
      'Custom API framework',
      'Webhook event routing',
      'Rate limiting and quotas',
    ],
  },
];

const infrastructure = [
  {
    icon: Server,
    title: 'Self-Hosted Options',
    description:
      'Deploy on your infrastructure. Docker, Kubernetes, or bare metal.',
  },
  {
    icon: Database,
    title: 'Data Residency',
    description:
      'Your data stays where you want it. Canadian servers available.',
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Edge deployment for low latency worldwide.',
  },
];

export function SystemsSection() {
  return (
    <section
      aria-label='Systems and capabilities'
      className='bg-muted/30 px-4 py-20'
      id='systems'
    >
      <div className='container mx-auto max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='mb-16 text-center'
        >
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Systems We Build
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            Enterprise-grade automation infrastructure. Reliable, auditable, and
            extensible.
          </p>
        </motion.div>

        <div className='mb-16 grid gap-8 md:grid-cols-2'>
          {systems.map((system, index) => {
            const Icon = system.icon;
            return (
              <motion.div
                key={system.title}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className='h-full transition-all hover:border-primary/50 hover:shadow-lg'>
                  <CardHeader>
                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                      <Icon className='h-6 w-6 text-primary' />
                    </div>
                    <CardTitle className='text-xl'>{system.title}</CardTitle>
                    <p className='text-sm text-muted-foreground'>
                      {system.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className='space-y-2'>
                      {system.features.map(feature => (
                        <li
                          key={feature}
                          className='flex items-start gap-2 text-sm'
                        >
                          <svg
                            className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='rounded-xl border bg-card p-8'
        >
          <h3 className='mb-6 text-center text-xl font-bold'>
            Infrastructure Options
          </h3>
          <div className='grid gap-6 md:grid-cols-3'>
            {infrastructure.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className='flex items-start gap-4 rounded-lg bg-muted/50 p-4'
                >
                  <Icon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                  <div>
                    <p className='font-medium'>{item.title}</p>
                    <p className='text-sm text-muted-foreground'>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='mt-12 text-center'
        >
          <Button asChild size='lg' variant='outline'>
            <Link href='/services'>View All Services</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
