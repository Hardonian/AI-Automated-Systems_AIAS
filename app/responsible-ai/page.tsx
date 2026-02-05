import type { Metadata } from 'next';
import {
  Shield,
  Lock,
  Eye,
  Users,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Target,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Responsible AI — AI Automated Systems | Governance & Safety',
  description:
    'How we build responsible agentic automation: guardrails, safety patterns, and governance frameworks.',
};

const guardrails = [
  {
    title: 'Least Privilege Access',
    description:
      'Agents access only the minimum permissions required to complete their tasks.',
    details: [
      'Role-based access control for each workflow',
      'Separate credentials per integration',
      'No standing admin privileges',
      'Permission grants reviewed quarterly',
    ],
  },
  {
    title: 'PII Handling',
    description:
      'Sensitive personal information is properly masked, logged, and protected.',
    details: [
      'Automatic detection and masking of PII',
      'Encryption at rest and in transit',
      'Data retention policies enforced',
      'Audit logs for all data access',
    ],
  },
  {
    title: 'Audit Trails',
    description: 'Every action is traceable for compliance and debugging.',
    details: [
      'Immutable action logs',
      'Timestamped events with context',
      'User attribution for all changes',
      'Exportable for compliance reviews',
    ],
  },
  {
    title: 'Human-in-the-Loop Gates',
    description: 'Critical decisions always involve human judgment.',
    details: [
      'Escalation paths for edge cases',
      'Approval workflows for sensitive actions',
      'Override capabilities for all automated decisions',
      'Human sign-off requirements configurable',
    ],
  },
];

const reliability = [
  {
    title: 'Retries + Backoff',
    description: 'Graceful degradation when services are unavailable.',
    details: [
      'Exponential backoff with jitter',
      'Maximum retry limits enforced',
      'Circuit breaker patterns',
      'Fallback behaviors defined',
    ],
  },
  {
    title: 'Idempotency Keys',
    description: 'Safe retry without duplicate actions.',
    details: [
      'Unique keys per workflow run',
      'Deduplication checks',
      'State persistence across retries',
      'Compensation actions for rollbacks',
    ],
  },
  {
    title: 'Observability',
    description: 'Full visibility into workflow execution.',
    details: [
      'Structured logging',
      'Metrics and dashboards',
      'Alerting on errors and latency',
      'Distributed tracing',
    ],
  },
];

const safety = [
  {
    title: 'Prompt Injection Defense',
    description:
      'Protection against malicious input attempting to manipulate agent behavior.',
    details: [
      'Input sanitization',
      'Prompt validation',
      'Sandboxed execution where possible',
      'Monitoring for anomalous patterns',
    ],
  },
  {
    title: 'Tool Permissioning',
    description: 'Fine-grained control over what tools agents can invoke.',
    details: [
      'Allowlist of permitted tools',
      'Rate limits per tool',
      'Parameter validation',
      'Tool execution auditing',
    ],
  },
  {
    title: 'Red Team Testing',
    description: 'Proactive security testing to find vulnerabilities.',
    details: [
      'Regular penetration testing',
      'Adversarial scenario演练',
      'Bug bounty program',
      'Third-party security audits',
    ],
  },
];

export default function ResponsibleAIPage() {
  return (
    <main className='min-h-screen'>
      <section className='bg-gradient-to-b from-muted/30 via-background to-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <span className='mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary'>
            Responsible AI
          </span>
          <h1 className='mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl'>
            Automation That Earns Trust
          </h1>
          <p className='mb-8 text-lg leading-relaxed text-muted-foreground md:text-xl'>
            Every engagement includes built-in guardrails, safety patterns, and
            governance frameworks. We design automation you can operate with
            confidence.
          </p>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-12 text-center'>
            <Shield className='mx-auto mb-4 h-12 w-12 text-primary' />
            <h2 className='mb-4 text-3xl font-extrabold md:text-4xl'>
              Core Guardrails
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Fundamental protections built into every automation we deploy.
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {guardrails.map(item => (
              <Card key={item.title} className='border-2'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-3'>
                    <Lock className='h-5 w-5 text-primary' />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='mb-4 text-muted-foreground'>
                    {item.description}
                  </p>
                  <ul className='space-y-2'>
                    {item.details.map((detail, i) => (
                      <li key={i} className='flex items-start gap-2 text-sm'>
                        <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-12 text-center'>
            <Target className='mx-auto mb-4 h-12 w-12 text-primary' />
            <h2 className='mb-4 text-3xl font-extrabold md:text-4xl'>
              Reliability Engineering
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Patterns to keep automations running smoothly under real-world
              conditions.
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {reliability.map(item => (
              <Card key={item.title} className='border-2'>
                <CardContent className='p-6'>
                  <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10'>
                    <Eye className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='mb-2 text-lg font-bold'>{item.title}</h3>
                  <p className='mb-4 text-muted-foreground'>
                    {item.description}
                  </p>
                  <ul className='space-y-2'>
                    {item.details.map((detail, i) => (
                      <li key={i} className='flex items-start gap-2 text-sm'>
                        <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-12 text-center'>
            <AlertTriangle className='mx-auto mb-4 h-12 w-12 text-primary' />
            <h2 className='mb-4 text-3xl font-extrabold md:text-4xl'>
              Safety & Security
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Proactive measures to prevent, detect, and respond to security
              concerns.
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {safety.map(item => (
              <Card key={item.title} className='border-2'>
                <CardContent className='p-6'>
                  <h3 className='mb-2 text-lg font-bold'>{item.title}</h3>
                  <p className='mb-4 text-muted-foreground'>
                    {item.description}
                  </p>
                  <ul className='space-y-2'>
                    {item.details.map((detail, i) => (
                      <li key={i} className='flex items-start gap-2 text-sm'>
                        <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='mb-6 text-3xl font-extrabold md:text-4xl'>
            Compliance & Governance
          </h2>
          <p className='mb-8 text-lg text-muted-foreground'>
            We help organizations meet their regulatory requirements with
            built-in compliance patterns and audit capabilities.
          </p>
          <div className='grid grid-cols-1 gap-6 text-left md:grid-cols-3'>
            <Card className='border-2'>
              <CardContent className='p-6'>
                <FileText className='mb-4 h-8 w-8 text-primary' />
                <h3 className='mb-2 font-bold'>Data Retention</h3>
                <p className='text-sm text-muted-foreground'>
                  Configurable retention policies aligned with regulatory
                  requirements.
                </p>
              </CardContent>
            </Card>
            <Card className='border-2'>
              <CardContent className='p-6'>
                <Users className='mb-4 h-8 w-8 text-primary' />
                <h3 className='mb-2 font-bold'>Access Control</h3>
                <p className='text-sm text-muted-foreground'>
                  Role-based access patterns with audit trails for all actions.
                </p>
              </CardContent>
            </Card>
            <Card className='border-2'>
              <CardContent className='p-6'>
                <Eye className='mb-4 h-8 w-8 text-primary' />
                <h3 className='mb-2 font-bold'>Audit Readiness</h3>
                <p className='text-sm text-muted-foreground'>
                  Exportable logs and reports for compliance reviews.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='mb-6 text-3xl font-extrabold md:text-4xl'>
            Ready to Build Responsible Automation?
          </h2>
          <p className='mb-8 text-lg text-muted-foreground'>
            Let us help you design automation that is safe, reliable, and
            compliant.
          </p>
          <Button asChild size='lg'>
            <a href='/contact'>Book a Discovery Call</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
