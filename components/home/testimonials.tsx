'use client';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Target, CheckCircle2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getSectionClasses,
  getContainerClasses,
  TYPOGRAPHY,
  GRID_GAPS,
} from '@/lib/design-tokens';

const workflows = [
  {
    title: 'Support Triage Agent',
    systems: 'Zendesk / Gmail / Slack',
    steps: [
      'New ticket arrives via email or ticketing system',
      'Agent classifies: urgent / routine / low priority',
      'Drafts response based on knowledge base',
      'Escalates urgent items to human reviewer',
    ],
    checkpoint: 'Human reviews all urgent and escalated tickets',
    deliverable: 'Runbook + escalation rules + knowledge base integration',
  },
  {
    title: 'Finance Ops: Invoice Reconciliation',
    systems: 'ERP / Email / Approval Queue',
    steps: [
      'Invoice received via email or portal',
      'Agent matches against purchase orders',
      'Reconciles line items and amounts',
      'Routes to exception queue for discrepancies',
    ],
    checkpoint: 'Finance team reviews exception queue',
    deliverable: 'Matching logic + exception rules + approval workflow',
  },
  {
    title: 'Sales Ops: Lead Enrichment',
    systems: 'CRM / Enrichment API / Email',
    steps: [
      'New lead enters CRM from any source',
      'Agent enriches data: company info, social links',
      'Scores and routes to appropriate rep',
      'Drafts personalized follow-up email',
    ],
    checkpoint: 'Sales rep reviews enriched lead profile',
    deliverable: 'Enrichment pipeline + scoring criteria + email templates',
  },
  {
    title: 'HR Ops: Onboarding',
    systems: 'HRIS / IT Ticketing / Slack',
    steps: [
      'New hire paperwork completed',
      'Agent creates accounts across systems',
      'Requests access provisioning from IT',
      'Sends welcome package and checklist',
    ],
    checkpoint: 'HR and IT both review access provisioning requests',
    deliverable: 'Provisioning checklist + access matrix + SLA tracking',
  },
  {
    title: 'Compliance: Policy Scan',
    systems: 'Document Store / Review Queue',
    steps: [
      'New document uploaded to shared drive',
      'Agent scans for required compliance flags',
      'Extracts key data points',
      'Creates evidence packet for reviewer',
    ],
    checkpoint: 'Compliance officer reviews flagged items',
    deliverable: 'Scan rules + evidence packet template + audit trail',
  },
  {
    title: 'Engineering: PR Review Assistant',
    systems: 'GitHub / CI / Documentation',
    steps: [
      'Pull request opened',
      'Agent runs linting and test suite',
      'Checks for common issues',
      'Drafts release notes summary',
    ],
    checkpoint: 'Developer reviews automated feedback',
    deliverable: 'Lint rules + test harness + release notes template',
  },
];

export function Testimonials() {
  return (
    <section className='relative overflow-hidden bg-muted/20 py-20'>
      <div className={getContainerClasses('wide')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({ className: 'text-center mb-12' } as any)}
        >
          <span className='rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary'>
            Example Workflows
          </span>
          <h2 className={`${TYPOGRAPHY.h2} mb-4 mt-6`}>
            Practical Patterns That Ship
          </h2>
          <p
            className={`${TYPOGRAPHY.body} mx-auto max-w-3xl text-muted-foreground`}
          >
            Six concrete workflow patterns we deploy regularly. Each includes
            step-by-step logic, human checkpoints, and tangible deliverables.
          </p>
        </motion.div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${GRID_GAPS.default}`}
        >
          {workflows.map((workflow, index) => (
            <motion.div
              key={workflow.title}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className='h-full border-2 transition-all hover:border-primary/50 hover:shadow-lg'>
                <CardContent className='px-6 pb-6 pt-6'>
                  <div className='mb-4 flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                      <Target className='h-5 w-5 text-primary' />
                    </div>
                    <h3 className={`${TYPOGRAPHY.h4}`}>{workflow.title}</h3>
                  </div>

                  <div className='mb-4'>
                    <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                      Systems
                    </span>
                    <p className='mt-1 text-sm'>{workflow.systems}</p>
                  </div>

                  <div className='mb-4'>
                    <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                      Steps
                    </span>
                    <ol className='mt-1 space-y-1 text-sm'>
                      {workflow.steps.map((step, i) => (
                        <li key={i} className='flex items-start gap-2'>
                          <span className='mt-0.5 text-primary'>•</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className='mb-4 rounded-lg bg-muted/50 p-3'>
                    <div className='flex items-start gap-2'>
                      <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                      <div>
                        <span className='text-xs font-semibold'>
                          Human Checkpoint
                        </span>
                        <p className='mt-0.5 text-xs text-muted-foreground'>
                          {workflow.checkpoint}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='border-t border-border pt-4'>
                    <div className='flex items-start gap-2'>
                      <FileText className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                      <span className='text-xs text-muted-foreground'>
                        {workflow.deliverable}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({ className: 'text-center mt-12' } as any)}
        >
          <Button asChild size='lg'>
            <a href='/use-cases'>
              View All Use Cases
              <ArrowRight className='ml-2 h-4 w-4' />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
