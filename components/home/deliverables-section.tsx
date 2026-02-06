'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const deliverables = [
  {
    title: 'Custom AI Agents',
    description:
      'Purpose-built agents trained on your data and workflows. Not generic chatbots.',
    icon: '🤖',
  },
  {
    title: 'Workflow Automation',
    description:
      'End-to-end automation with human-in-the-loop gates for critical decisions.',
    icon: '⚡',
  },
  {
    title: 'Integration Layer',
    description:
      'Connectors for your existing tools: CRM, database, Slack, email, and more.',
    icon: '🔗',
  },
  {
    title: 'Documentation Pack',
    description:
      'Complete runbooks, architecture diagrams, and operational procedures.',
    icon: '📋',
  },
  {
    title: 'Training & Handoff',
    description:
      'Knowledge transfer so your team can extend and maintain the systems.',
    icon: '🎓',
  },
  {
    title: 'Ongoing Support',
    description:
      'Monitoring, bug fixes, and optimization. We stay with you after launch.',
    icon: '🛡️',
  },
];

export function DeliverablesSection() {
  return (
    <section className='bg-muted/30 px-4 py-20' id='what-we-build'>
      <div className='container mx-auto max-w-6xl'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>What We Build</h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            Complete automation systems, not just integrations. Everything you
            need to operate independently.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
          {deliverables.map((item, index) => (
            <Card
              key={index}
              className='transition-all hover:border-primary/50 hover:shadow-md'
            >
              <CardContent className='p-6'>
                <div className='mb-4 text-3xl'>{item.icon}</div>
                <h3 className='mb-2 text-lg font-semibold'>{item.title}</h3>
                <p className='text-sm text-muted-foreground'>
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
