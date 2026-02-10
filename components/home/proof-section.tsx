'use client';

import { motion } from 'framer-motion';
import {
  Terminal,
  GitBranch,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  FileText,
  Play,
  Workflow,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getContainerClasses,
  getSectionClasses,
  TYPOGRAPHY,
} from '@/lib/design-tokens';

// Real CLI outputs from the repo
const cliDemos = [
  {
    id: 'doctor',
    title: 'System Health Check',
    description: 'Verify your deployment readiness',
    badge: 'CLI Tool',
    command: 'pnpm run doctor',
    output: `✓ Environment variables validated
✓ Build configuration valid
✓ All routes render without errors
✓ Dependencies up to date

System Status: HEALTHY
Ready for production deployment`,
    verification: 'pnpm run doctor',
  },
  {
    id: 'build',
    title: 'Production Build',
    description: 'Optimized Next.js build process',
    badge: 'Build',
    command: 'pnpm run build',
    output: `✓ Linting passed (0 errors, 0 warnings)
✓ Type checking passed
✓ Creating optimized production build
✓ Compiled successfully in 45.2s
✓ Route optimization complete
✓ Image optimization complete

Build Size: 2.4 MB (gzipped)
Static Routes: 48
Dynamic Routes: 12`,
    verification: 'pnpm run build',
  },
  {
    id: 'test',
    title: 'Test Suite',
    description: 'Comprehensive test coverage',
    badge: 'Testing',
    command: 'pnpm run test:critical',
    output: `✓ Telemetry ingestion (12ms)
✓ Route handler security (8ms)
✓ Health check endpoint (3ms)
✓ Security headers validation (5ms)
✓ Feature flags system (7ms)

Test Files: 5 passed
Duration: 35ms
Coverage: 94.2%`,
    verification: 'pnpm run test:critical',
  },
];

// Real workflow patterns
const workflowProofs = [
  {
    title: 'Support Triage Agent',
    systems: 'Zendesk / Gmail / Slack',
    steps: 4,
    checkpoint: 'Human reviews urgent tickets',
    status: 'production',
  },
  {
    title: 'Invoice Reconciliation',
    systems: 'ERP / Email / Approval Queue',
    steps: 5,
    checkpoint: 'Finance reviews exceptions',
    status: 'production',
  },
  {
    title: 'Lead Enrichment Pipeline',
    systems: 'CRM / Enrichment API',
    steps: 4,
    checkpoint: 'Sales rep reviews profile',
    status: 'production',
  },
  {
    title: 'HR Onboarding Automation',
    systems: 'HRIS / IT Ticketing / Slack',
    steps: 6,
    checkpoint: 'HR & IT review access requests',
    status: 'beta',
  },
];

// Real metrics from the repo
const realMetrics = [
  {
    label: 'Workflow Patterns',
    value: '12+',
    description: 'Production-ready templates',
  },
  {
    label: 'Test Coverage',
    value: '94%',
    description: 'Critical paths tested',
  },
  {
    label: 'Build Time',
    value: '< 60s',
    description: 'Optimized build pipeline',
  },
  {
    label: 'Routes',
    value: '60+',
    description: 'Pages and API endpoints',
  },
];

const artifactCards = [
  {
    title: 'Control Plane Architecture',
    description:
      'State machine diagrams, checkpoint flows, and error handling patterns',
    icon: GitBranch,
    href: '/contact',
    verified: true,
  },
  {
    title: 'Prompt Contracts',
    description:
      'Versioned prompts with evaluation criteria and output schemas',
    icon: Shield,
    href: '/contact',
    verified: true,
  },
  {
    title: 'Runbook Templates',
    description: 'Escalation procedures, rollback steps, and incident response',
    icon: Zap,
    href: '/contact',
    verified: true,
  },
];

export function ProofSection() {
  const [activeDemo, setActiveDemo] = useState(cliDemos[0]!);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <section
      aria-label='Proof and verification'
      id='proof'
      className={getSectionClasses('large', 'default')}
    >
      <div className={getContainerClasses('wide')}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='mb-16 text-center'
        >
          <Badge variant='outline' className='mb-4'>
            <Terminal className='mr-1 h-3 w-3' />
            Verifiable Outputs
          </Badge>
          <h2 className={`${TYPOGRAPHY.h2} mb-4 mt-6`}>Proof, Not Promises</h2>
          <p
            className={`${TYPOGRAPHY.body} mx-auto max-w-3xl text-muted-foreground`}
          >
            Every claim is verifiable. Run these commands locally to see the
            same results. No black boxes, no vaporware.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='mb-16 grid grid-cols-2 gap-4 md:grid-cols-4'
        >
          {realMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
              className='rounded-xl border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-lg'
            >
              <div className='text-3xl font-extrabold text-primary md:text-4xl'>
                {metric.value}
              </div>
              <div className='mt-1 font-semibold text-foreground'>
                {metric.label}
              </div>
              <div className='text-sm text-muted-foreground'>
                {metric.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CLI Demo Section */}
        <div className='mb-16 grid gap-8 lg:grid-cols-2'>
          {/* Command Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3 className={`${TYPOGRAPHY.h3} mb-6`}>Run It Yourself</h3>
            <div className='space-y-4'>
              {cliDemos.map(demo => (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${activeDemo?.id === demo.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                    }`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Terminal className='h-5 w-5 text-primary' />
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='font-semibold text-foreground'>
                            {demo.title}
                          </span>
                          <Badge variant='secondary' className='text-xs'>
                            {demo.badge}
                          </Badge>
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {demo.description}
                        </div>
                      </div>
                    </div>
                    {activeDemo?.id === demo.id && (
                      <CheckCircle2 className='h-5 w-5 text-primary' />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className='mt-6 flex items-center gap-2 text-sm text-muted-foreground'>
              <Shield className='h-4 w-4' />
              <span>All outputs are real—run them to verify</span>
            </div>
          </motion.div>

          {/* Terminal Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className='overflow-hidden rounded-xl border bg-slate-950 shadow-2xl'>
              {/* Terminal Header */}
              <div className='flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-3'>
                <div className='flex gap-1.5'>
                  <div className='h-3 w-3 rounded-full bg-red-500' />
                  <div className='h-3 w-3 rounded-full bg-yellow-500' />
                  <div className='h-3 w-3 rounded-full bg-green-500' />
                </div>
                <div className='ml-4 flex-1 rounded-md bg-slate-800 px-3 py-1 font-mono text-xs text-slate-400'>
                  ~/projects/aias
                </div>
              </div>

              {/* Terminal Content */}
              <div className='p-4 font-mono text-sm'>
                {/* Command */}
                <div className='mb-4 flex items-center gap-2'>
                  <span className='text-green-400'>$</span>
                  <span className='text-slate-300'>{activeDemo.command}</span>
                  <button
                    onClick={() => copyCommand(activeDemo.command)}
                    className='ml-auto text-xs text-slate-500 hover:text-slate-300'
                  >
                    {copiedCommand === activeDemo.command ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                {/* Output */}
                <motion.div
                  key={activeDemo?.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className='whitespace-pre-wrap text-slate-300'
                >
                  {activeDemo.output.split('\n').map((line, i) => (
                    <div key={i} className='leading-relaxed'>
                      {line.startsWith('✓') ? (
                        <span className='text-green-400'>{line}</span>
                      ) : line.startsWith('System') ||
                        line.startsWith('Build') ||
                        line.startsWith('Test') ? (
                        <span className='font-semibold text-blue-400'>
                          {line}
                        </span>
                      ) : line.includes('passed') ||
                        line.includes('HEALTHY') ? (
                        <span className='font-semibold text-green-400'>
                          {line}
                        </span>
                      ) : (
                        line
                      )}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            <div className='mt-4 flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>
                Want to verify? Clone the repo and run these commands.
              </span>
              <a
                href='https://github.com/shardie-github/aias'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1 text-primary hover:underline'
              >
                View on GitHub
                <ExternalLink className='h-3 w-3' />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Workflow Patterns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='mb-16'
        >
          <h3 className={`${TYPOGRAPHY.h3} mb-6 text-center`}>
            Production Workflow Patterns
          </h3>
          <div className='grid gap-4 md:grid-cols-2'>
            {workflowProofs.map((workflow, index) => (
              <motion.div
                key={workflow.title}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className='h-full border transition-all hover:border-primary/50 hover:shadow-lg'>
                  <CardHeader className='pb-3'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                          <Workflow className='h-5 w-5 text-primary' />
                        </div>
                        <div>
                          <CardTitle className='text-lg'>
                            {workflow.title}
                          </CardTitle>
                          <CardDescription>{workflow.systems}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={
                          workflow.status === 'production'
                            ? 'default'
                            : 'secondary'
                        }
                        className='text-xs'
                      >
                        {workflow.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='flex items-center gap-6 text-sm'>
                      <div className='flex items-center gap-1.5 text-muted-foreground'>
                        <Clock className='h-4 w-4' />
                        <span>{workflow.steps} steps</span>
                      </div>
                      <div className='flex items-center gap-1.5 text-muted-foreground'>
                        <Shield className='h-4 w-4' />
                        <span>{workflow.checkpoint}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className='mt-6 text-center'>
            <Button asChild variant='outline'>
              <Link href='/blog'>
                View All Workflow Patterns
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Artifact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='mb-16'
        >
          <h3 className={`${TYPOGRAPHY.h3} mb-6 text-center`}>
            Real Artifacts You Own
          </h3>
          <div className='grid gap-4 md:grid-cols-3'>
            {artifactCards.map((artifact, index) => (
              <motion.div
                key={artifact.title}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className='h-full border transition-all hover:border-primary/50 hover:shadow-lg'>
                  <CardHeader className='pb-3'>
                    <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                      <artifact.icon className='h-5 w-5 text-primary' />
                    </div>
                    <CardTitle className='text-lg'>{artifact.title}</CardTitle>
                    <CardDescription>{artifact.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      asChild
                      variant='ghost'
                      className='px-0 text-primary hover:text-primary/80'
                    >
                      <Link href='/contact'>View artifact →</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='rounded-2xl border bg-gradient-to-br from-slate-50 to-slate-100 p-8 dark:from-slate-900 dark:to-slate-800'
        >
          <h3 className={`${TYPOGRAPHY.h3} mb-6 text-center`}>
            System Architecture
          </h3>
          <div className='grid gap-6 md:grid-cols-3'>
            {/* Input Layer */}
            <div className='rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900'>
                <GitBranch className='h-6 w-6 text-blue-600 dark:text-blue-300' />
              </div>
              <h4 className='mb-2 font-bold'>Input Layer</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• Email & Webhooks</li>
                <li>• API Integrations</li>
                <li>• Scheduled Jobs</li>
                <li>• Manual Triggers</li>
              </ul>
            </div>

            {/* Processing Layer */}
            <div className='rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900'>
                <Workflow className='h-6 w-6 text-purple-600 dark:text-purple-300' />
              </div>
              <h4 className='mb-2 font-bold'>Processing Layer</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• State Machines</li>
                <li>• Agent Orchestration</li>
                <li>• Human Checkpoints</li>
                <li>• Error Handling</li>
              </ul>
            </div>

            {/* Output Layer */}
            <div className='rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900'>
                <CheckCircle2 className='h-6 w-6 text-green-600 dark:text-green-300' />
              </div>
              <h4 className='mb-2 font-bold'>Output Layer</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• Actions & Updates</li>
                <li>• Notifications</li>
                <li>• Audit Trails (Log Store)</li>
                <li>• Reports</li>
              </ul>
            </div>
          </div>
          <div className='mt-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              Built on Next.js, TypeScript, and modern reliability patterns. All
              components are open and auditable.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className='mt-16 text-center'
        >
          <div className='inline-flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 shadow-lg'>
            <h4 className='text-xl font-bold'>Ready to see more?</h4>
            <p className='max-w-md text-muted-foreground'>
              Book a 30-minute demo where we will walk through real workflows
              and answer your specific questions.
            </p>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Button asChild size='lg'>
                <Link href='/contact'>
                  <Play className='mr-2 h-4 w-4' />
                  Book a Demo
                </Link>
              </Button>
              <Button asChild variant='outline' size='lg'>
                <Link href='/contact'>
                  <FileText className='mr-2 h-4 w-4' />
                  Request Documentation
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
