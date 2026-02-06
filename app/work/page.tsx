import type { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  Shield,
  Zap,
  Workflow,
  Cpu,
  GitBranch,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Our Work — AI Automated Systems | Case Studies & Projects',
  description:
    'See real automation systems we have built. Workflow blueprints, agent implementations, and operational results.',
};

const caseStudies = [
  {
    id: 'compliance-autopilot',
    title: 'Compliance Documentation Autopilot',
    client: 'Regulated Financial Services',
    industry: 'Finance',
    challenge: 'Manual compliance documentation consuming 40+ hours weekly',
    solution: 'Multi-agent system with human-in-the-loop review gates',
    results: [
      '85% reduction in documentation time',
      'Zero compliance violations post-implementation',
      'Audit trail automatically generated',
      'Staff reallocated to higher-value work',
    ],
    tags: ['Multi-Agent', 'Compliance', 'Documentation', 'HITL'],
    icon: Shield,
    color: 'blue',
  },
  {
    id: 'content-orchestrator',
    title: 'Content Pipeline Orchestrator',
    client: 'Digital Marketing Agency',
    industry: 'Marketing',
    challenge: 'Inconsistent content production across 15+ client accounts',
    solution: 'Workflow automation with quality gates and approval flows',
    results: [
      '3x increase in content output',
      'Consistent brand voice across accounts',
      'Client approval cycle reduced from 5 days to 1 day',
      'Automated performance tracking',
    ],
    tags: ['Content', 'Workflow', 'Quality Gates', 'Analytics'],
    icon: Workflow,
    color: 'emerald',
  },
  {
    id: 'data-integration',
    title: 'Multi-System Data Integration',
    client: 'E-commerce Platform',
    industry: 'Retail',
    challenge: 'Data silos across Shopify, ERP, and analytics platforms',
    solution:
      'Event-driven architecture with connector maps and error handling',
    results: [
      'Real-time inventory synchronization',
      'Order processing errors reduced by 94%',
      'Automatic retry and failure handling',
      'Sub-second data propagation',
    ],
    tags: ['Integration', 'Event-Driven', 'Connectors', 'Reliability'],
    icon: GitBranch,
    color: 'purple',
  },
  {
    id: 'ai-support',
    title: 'Intelligent Support Routing',
    client: 'SaaS Company',
    industry: 'Technology',
    challenge: 'Support tickets misrouted, causing SLA breaches',
    solution: 'Classification agent with confidence scoring and escalation',
    results: [
      '92% routing accuracy',
      'First-response time improved by 60%',
      'Critical issues escalated in < 30 seconds',
      'Agent workload balanced automatically',
    ],
    tags: ['Classification', 'Routing', 'SLA', 'Escalation'],
    icon: Cpu,
    color: 'orange',
  },
];

const deliverablesPreview = [
  {
    title: 'Workflow Blueprint',
    description:
      'State machine definition with triggers, transitions, and guardrails',
    fileType: 'YAML + Mermaid',
  },
  {
    title: 'Agent Runbook',
    description: 'Prompt contracts, output schemas, and evaluation criteria',
    fileType: 'Markdown',
  },
  {
    title: 'Connector Map',
    description: 'API specifications, authentication flows, rate limits',
    fileType: 'OpenAPI + Docs',
  },
  {
    title: 'Observability Config',
    description: 'Dashboards, alerts, error budgets, and SLOs',
    fileType: 'Terraform + JSON',
  },
];

export default function WorkPage() {
  return (
    <main className='min-h-screen'>
      {/* Hero */}
      <section className='border-b border-border bg-gradient-to-b from-background to-muted/20 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <Badge variant='outline' className='mb-6'>
            Verifiable Results
          </Badge>
          <h1 className='mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl'>
            Systems We Have Built
          </h1>
          <p className='mb-8 text-lg leading-relaxed text-muted-foreground md:text-xl'>
            Real automation implementations with measurable outcomes. Every
            project includes complete documentation and knowledge transfer.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href='/contact'>
                Discuss Your Project
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/process'>See Our Process</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              Recent Implementations
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Production systems running today with teams we trained
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {caseStudies.map(study => {
              const Icon = study.icon;
              return (
                <Card
                  key={study.id}
                  className='group border-2 transition-all hover:border-primary/50 hover:shadow-lg'
                >
                  <CardHeader className='pb-4'>
                    <div className='flex items-start justify-between'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20'>
                        <Icon className='h-6 w-6 text-primary' />
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {study.tags.map(tag => (
                          <Badge
                            key={tag}
                            variant='secondary'
                            className='text-xs'
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className='mt-4'>
                      <p className='text-sm font-medium text-muted-foreground'>
                        {study.industry}
                      </p>
                      <h3 className='mt-1 text-xl font-bold'>{study.title}</h3>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='space-y-3'>
                      <div>
                        <h4 className='text-sm font-semibold text-muted-foreground'>
                          Challenge
                        </h4>
                        <p className='text-sm'>{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className='text-sm font-semibold text-muted-foreground'>
                          Solution
                        </h4>
                        <p className='text-sm'>{study.solution}</p>
                      </div>
                    </div>

                    <div className='rounded-lg bg-muted/50 p-4'>
                      <h4 className='mb-3 flex items-center gap-2 text-sm font-semibold'>
                        <Zap className='h-4 w-4 text-primary' />
                        Results
                      </h4>
                      <ul className='space-y-2'>
                        {study.results.map((result, i) => (
                          <li
                            key={i}
                            className='flex items-start gap-2 text-sm'
                          >
                            <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deliverables Preview */}
      <section className='border-y border-border bg-muted/20 px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              What You Receive
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Every engagement produces tangible artifacts your team owns
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {deliverablesPreview.map(item => (
              <Card key={item.title} className='border-2 text-center'>
                <CardContent className='pt-6'>
                  <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                    <FileText className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='mb-2 font-bold'>{item.title}</h3>
                  <p className='mb-3 text-sm text-muted-foreground'>
                    {item.description}
                  </p>
                  <Badge variant='outline' className='text-xs'>
                    {item.fileType}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Verification CTA */}
      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-4xl'>
          <Card className='border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background'>
            <CardContent className='p-8 md:p-12'>
              <div className='text-center'>
                <h2 className='mb-4 text-2xl font-bold md:text-3xl'>
                  Verify Our Approach
                </h2>
                <p className='mb-6 text-muted-foreground'>
                  Clone our repository and run the demo workflows locally. See
                  the patterns we use before committing to an engagement.
                </p>
                <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                  <Button asChild variant='outline'>
                    <a
                      href='https://github.com/shardie-github/aias'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center'
                    >
                      View on GitHub
                      <ExternalLink className='ml-2 h-4 w-4' />
                    </a>
                  </Button>
                  <Button asChild>
                    <Link href='/contact'>Book Technical Review</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className='border-t border-border bg-muted/20 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Ready to Build Your System?
          </h2>
          <p className='mb-8 text-lg text-muted-foreground'>
            Book a discovery call. We will review your context and outline a
            pilot engagement.
          </p>
          <Button asChild size='lg'>
            <Link href='/contact'>
              Book a Discovery Call
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
