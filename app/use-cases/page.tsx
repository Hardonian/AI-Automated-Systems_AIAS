import type { Metadata } from 'next';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Use Cases - AI Automated Systems',
  description: 'Practical automation patterns for enterprise workflows',
};

const useCases = [
  {
    title: 'Support Triage Agent',
    problem:
      'Support teams spend hours manually categorizing tickets. High priority issues get buried.',
    systems: ['Ticketing System', 'Email', 'Slack'],
    steps: [
      'New ticket arrives via email or API',
      'Agent extracts intent and classifies priority',
      'Drafts response using knowledge base',
      'Routes urgent items to escalation queue',
    ],
    checkpoint: 'Human reviews all urgent tickets before sending',
    deliverables: [
      'Classification rules and training data',
      'Response templates for common issues',
      'Escalation matrix',
    ],
    risks: [
      {
        risk: 'Agent misclassifies urgent ticket',
        mitigation: 'Human in the loop on urgent classifications',
      },
      {
        risk: 'Draft response contains inaccurate info',
        mitigation: 'Human review required for all drafted responses',
      },
    ],
  },
  {
    title: 'Finance Invoice Reconciliation',
    problem:
      'Manual invoice matching is time consuming and error prone at scale.',
    systems: ['ERP', 'Email', 'Approval Queue'],
    steps: [
      'Invoice received via email or portal',
      'Agent matches against purchase orders',
      'Reconciles line items and amounts',
      'Routes exceptions to human review',
    ],
    checkpoint: 'Finance team reviews all flagged items before payment',
    deliverables: [
      'Matching logic documentation',
      'Exception classification rules',
      'Approval workflow configuration',
    ],
    risks: [
      {
        risk: 'Invoice fraud goes undetected',
        mitigation: 'Multi factor verification and vendor allowlist',
      },
    ],
  },
  {
    title: 'Sales Lead Enrichment',
    problem: 'Sales reps spend too much time on research instead of selling.',
    systems: ['CRM', 'Enrichment API', 'Email'],
    steps: [
      'New lead enters CRM from any source',
      'Agent enriches data with company info',
      'Scores and routes to appropriate rep',
      'Drafts personalized follow up email',
    ],
    checkpoint: 'Sales rep reviews enriched lead profile',
    deliverables: [
      'Enrichment pipeline configuration',
      'Scoring criteria documentation',
      'Email template library',
    ],
    risks: [
      {
        risk: 'Enrichment data is stale',
        mitigation: 'Source citation and human verification for key accounts',
      },
    ],
  },
  {
    title: 'HR Onboarding Automation',
    problem: 'New hire onboarding involves multiple systems and causes delays.',
    systems: ['HRIS', 'IT Ticketing', 'Slack'],
    steps: [
      'New hire paperwork completed',
      'Agent creates accounts across systems',
      'Requests access provisioning from IT',
      'Sends welcome package and checklist',
    ],
    checkpoint: 'HR and IT review access provisioning requests',
    deliverables: [
      'Provisioning checklist by role',
      'Access matrix documentation',
      'SLA tracking dashboard',
    ],
    risks: [
      {
        risk: 'Over provisioning access',
        mitigation: 'Role based access matrix enforced',
      },
    ],
  },
  {
    title: 'Compliance Policy Scan',
    problem: 'Ensuring documents meet compliance is labor intensive.',
    systems: ['Document Store', 'Review Queue'],
    steps: [
      'New document uploaded to shared drive',
      'Agent scans for compliance flags',
      'Extracts key data points',
      'Creates evidence packet for reviewer',
    ],
    checkpoint: 'Compliance officer reviews flagged documents',
    deliverables: [
      'Scan rule configuration',
      'Evidence packet template',
      'Audit trail export',
    ],
    risks: [
      {
        risk: 'Agent misses a compliance issue',
        mitigation: 'Human review for all flagged items',
      },
    ],
  },
  {
    title: 'Engineering PR Review Assistant',
    problem: 'Code reviews are time consuming and CI feedback comes too late.',
    systems: ['GitHub', 'CI', 'Documentation'],
    steps: [
      'Pull request opened',
      'Agent runs linting and tests',
      'Checks for common issues',
      'Drafts release notes summary',
    ],
    checkpoint: 'Developer reviews automated feedback',
    deliverables: [
      'Lint rule configuration',
      'Test harness setup',
      'Release notes template',
    ],
    risks: [
      {
        risk: 'Agent blocks valid PRs with noisy feedback',
        mitigation: 'Confidence thresholds and developer override',
      },
    ],
  },
];

export default function UseCasesPage() {
  return (
    <main className='min-h-screen'>
      <section className='bg-gradient-to-b from-muted/30 via-background to-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h1 className='mb-6 text-4xl font-extrabold md:text-5xl'>
            Use Cases
          </h1>
          <p className='mb-8 text-lg text-muted-foreground'>
            Practical automation patterns for common enterprise workflows.
          </p>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl space-y-20'>
          {useCases.map(useCase => (
            <div
              key={useCase.title}
              className='grid grid-cols-1 gap-8 lg:grid-cols-3'
            >
              <div className='lg:col-span-1'>
                <h2 className='mb-4 text-2xl font-bold'>{useCase.title}</h2>
                <p className='mb-6 text-muted-foreground'>{useCase.problem}</p>
              </div>
              <div className='space-y-6 lg:col-span-2'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <Target className='h-5 w-5 text-primary' />
                      Workflow Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className='space-y-3'>
                      {useCase.steps.map((step, i) => (
                        <li key={i} className='flex items-start gap-3'>
                          <span className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary'>
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <CheckCircle2 className='h-5 w-5 text-primary' />
                      Human Checkpoint
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>
                      {useCase.checkpoint}
                    </p>
                  </CardContent>
                </Card>

                <Card className='border-orange-200'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg text-orange-600'>
                      <AlertTriangle className='h-5 w-5' />
                      Risks and Mitigations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {useCase.risks.map((r, i) => (
                      <div key={i} className='rounded-lg bg-orange-50 p-4'>
                        <p className='font-medium'>Risk: {r.risk}</p>
                        <p className='text-sm text-muted-foreground'>
                          Mitigation: {r.mitigation}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='mb-4 text-3xl font-extrabold'>
            Need a Custom Workflow
          </h2>
          <p className='mb-8 text-lg text-muted-foreground'>
            We design automation patterns for your specific context.
          </p>
          <Button asChild size='lg'>
            <a href='/contact'>Book a Discovery Call</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
