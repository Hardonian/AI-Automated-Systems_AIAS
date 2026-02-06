import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Workflow,
  Bot,
  Shield,
  BarChart3,
  GitBranch,
  Zap,
  Lock,
  Eye,
  FileCheck,
  Terminal,
  Code2,
  Database,
  Server,
  Cpu,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Systems & Capabilities — AIAS Consultancy',
  description:
    'See what AIAS builds: control planes, autopilots, governance systems, and connectors. Real architecture, real artifacts, real code.',
};

const systems = [
  {
    id: 'control-planes',
    icon: Workflow,
    title: 'Control Planes',
    subtitle: 'Workflow Orchestration Systems',
    description:
      'State-machine based workflow engines with human-in-the-loop gates. Built for reliability, observability, and graceful degradation.',
    capabilities: [
      'Visual workflow designer with state persistence',
      'Human review checkpoints with escalation',
      'Error handling with automatic retries',
      'Event-driven architecture with webhooks',
      'Multi-tenant isolation with RLS',
    ],
    tech: ['XState', 'Temporal', 'BullMQ', 'PostgreSQL', 'Redis'],
    artifacts: [
      'Workflow blueprints (JSON/YAML)',
      'State machine definitions',
      'Runbooks and playbooks',
      'Monitoring dashboards',
    ],
    demoCommand: 'npm run workflow:validate',
    demoOutput:
      '✓ 12 workflows validated\n✓ All transitions covered\n✓ No circular dependencies',
  },
  {
    id: 'autopilots',
    icon: Bot,
    title: 'Autopilots',
    subtitle: 'AI Agent Systems',
    description:
      'Custom AI agents that assist with complex tasks under human supervision. Not black boxes—every decision is explainable.',
    capabilities: [
      'Multi-modal agent architectures',
      'Tool use with validation layers',
      'Memory systems with context windows',
      'Confidence scoring for every output',
      'Human override at any step',
    ],
    tech: ['OpenAI', 'LangChain', 'LangGraph', 'Pydantic', 'Zod'],
    artifacts: [
      'Agent configuration schemas',
      'Prompt contracts with versioning',
      'Evaluation test suites',
      'Decision audit logs',
    ],
    demoCommand: 'npm run agent:diagnose',
    demoOutput:
      'Agent Status: HEALTHY\n- Response time: 245ms avg\n- Success rate: 99.2%\n- Human escalations: 3/1000',
  },
  {
    id: 'governance',
    icon: Shield,
    title: 'Governance & Guardrails',
    subtitle: 'Safety & Compliance Systems',
    description:
      'Permission matrices, audit trails, and compliance frameworks. Built for regulated industries from day one.',
    capabilities: [
      'Role-based access control (RBAC)',
      'Attribute-based access (ABAC)',
      'Comprehensive audit logging',
      'PIPEDA/GDPR compliant data handling',
      'Automated compliance reporting',
    ],
    tech: ['Casbin', 'OPA', 'Supabase RLS', 'Prisma', 'Zod'],
    artifacts: [
      'Permission matrices',
      'Audit trail exports',
      'Compliance checklists',
      'Security runbooks',
    ],
    demoCommand: 'npm run security:audit',
    demoOutput:
      'Security Audit: PASSED\n✓ All 47 policies enforced\n✓ No unauthorized access\n✓ Audit logs complete',
  },
  {
    id: 'observability',
    icon: Eye,
    title: 'Observability Stack',
    subtitle: 'Monitoring & Alerting',
    description:
      "Production-grade observability with structured logging, metrics, and alerting. Know what's happening before users do.",
    capabilities: [
      'Structured logging with correlation IDs',
      'Real-time metrics and dashboards',
      'Error budget tracking',
      'Automated alerting with escalation',
      'Performance profiling',
    ],
    tech: ['OpenTelemetry', 'Sentry', 'Grafana', 'Prometheus', 'Pino'],
    artifacts: [
      'Dashboard configurations',
      'Alert rule definitions',
      'Error budget policies',
      'SLA/SLO documentation',
    ],
    demoCommand: 'npm run obs:check',
    demoOutput:
      'Observability: HEALTHY\n- Error rate: 0.02%\n- P95 latency: 180ms\n- All services reporting',
  },
  {
    id: 'connectors',
    icon: GitBranch,
    title: 'Connectors',
    subtitle: 'Integration Architecture',
    description:
      'API connectors, webhook handlers, and event bridges. Connect your systems without fragile point-to-point integrations.',
    capabilities: [
      'REST/GraphQL API clients with resilience',
      'Webhook verification and routing',
      'Event bus with guaranteed delivery',
      'Schema validation at boundaries',
      'Circuit breakers and rate limiting',
    ],
    tech: ['tRPC', 'Axios', 'BullMQ', 'Zod', 'TypeScript'],
    artifacts: [
      'API contract definitions',
      'Webhook endpoint specs',
      'Integration test suites',
      'Rate limit policies',
    ],
    demoCommand: 'npm run connectors:validate',
    demoOutput:
      'Connectors: 8 validated\n✓ All schemas match\n✓ Rate limits configured\n✓ Circuit breakers armed',
  },
  {
    id: 'infrastructure',
    icon: Server,
    title: 'Infrastructure',
    subtitle: 'Deployment & Operations',
    description:
      'Cloud-native infrastructure with Infrastructure as Code. Multi-region, multi-tenant, production-ready.',
    capabilities: [
      'Infrastructure as Code (Terraform/Pulumi)',
      'Container orchestration (Docker/K8s)',
      'Database migrations with rollbacks',
      'Secret management with rotation',
      'Disaster recovery procedures',
    ],
    tech: ['Terraform', 'Docker', 'Kubernetes', 'Vercel', 'Supabase'],
    artifacts: [
      'Infrastructure definitions',
      'Deployment playbooks',
      'Runbooks for incidents',
      'DR procedures',
    ],
    demoCommand: 'npm run infra:validate',
    demoOutput:
      'Infrastructure: VALID\n✓ All resources provisioned\n✓ Security groups configured\n✓ Backups enabled',
  },
];

const verifyCommands = [
  {
    command: 'git clone https://github.com/shardie-github/aias.git',
    description: 'Clone the repository',
  },
  {
    command: 'pnpm install',
    description: 'Install dependencies',
  },
  {
    command: 'pnpm run doctor',
    description: 'Run system diagnostics',
  },
  {
    command: 'pnpm run build',
    description: 'Build the application',
  },
];

export default function SystemsPage() {
  return (
    <main className='min-h-screen'>
      {/* Hero Section */}
      <section className='border-b border-border bg-gradient-to-b from-muted/30 to-background px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <Badge variant='secondary' className='mb-6'>
            What We Build
          </Badge>
          <h1 className='mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl'>
            Systems & Capabilities
          </h1>
          <p className='mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl'>
            We build agentic automation systems: control planes, autopilots,
            governance frameworks, and connectors. Everything is documented,
            tested, and yours to operate.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href='/contact'>Discuss Your System</Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/case-studies'>See Real Builds</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Systems Grid */}
      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              Our System Architecture
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Six interconnected systems that work together to deliver reliable
              automation.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {systems.map(system => {
              const Icon = system.icon;
              return (
                <Card
                  key={system.id}
                  id={system.id}
                  className='group transition-all hover:border-primary/50 hover:shadow-lg'
                >
                  <CardHeader>
                    <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20'>
                      <Icon className='h-7 w-7 text-primary' />
                    </div>
                    <CardTitle className='text-xl'>{system.title}</CardTitle>
                    <CardDescription className='font-medium text-primary'>
                      {system.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <p className='text-sm leading-relaxed text-muted-foreground'>
                      {system.description}
                    </p>

                    <div>
                      <h4 className='mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        Capabilities
                      </h4>
                      <ul className='space-y-1.5'>
                        {system.capabilities.slice(0, 3).map(cap => (
                          <li
                            key={cap}
                            className='flex items-start gap-2 text-sm'
                          >
                            <CheckCircle2 className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className='mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                        Tech Stack
                      </h4>
                      <div className='flex flex-wrap gap-1.5'>
                        {system.tech.map(t => (
                          <Badge
                            key={t}
                            variant='outline'
                            className='text-xs font-normal'
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className='rounded-lg border bg-muted/50 p-3'>
                      <h4 className='mb-2 flex items-center gap-2 text-xs font-semibold'>
                        <Terminal className='h-3.5 w-3.5' />
                        Verify It Works
                      </h4>
                      <code className='block rounded bg-background p-2 font-mono text-xs text-muted-foreground'>
                        {system.demoCommand}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture Diagram Section */}
      <section className='border-y border-border bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-5xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              System Architecture
            </h2>
            <p className='text-lg text-muted-foreground'>
              How the systems interconnect to deliver reliable automation.
            </p>
          </div>

          <div className='rounded-xl border bg-background p-8 shadow-sm'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              {/* Input Layer */}
              <div className='space-y-4'>
                <h3 className='text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  Input Layer
                </h3>
                <div className='space-y-2'>
                  <div className='rounded-lg border bg-muted/50 p-3 text-center text-sm'>
                    <Database className='mx-auto mb-1 h-5 w-5 text-muted-foreground' />
                    APIs & Webhooks
                  </div>
                  <div className='rounded-lg border bg-muted/50 p-3 text-center text-sm'>
                    <FileCheck className='mx-auto mb-1 h-5 w-5 text-muted-foreground' />
                    File Uploads
                  </div>
                  <div className='rounded-lg border bg-muted/50 p-3 text-center text-sm'>
                    <Zap className='mx-auto mb-1 h-5 w-5 text-muted-foreground' />
                    Real-time Events
                  </div>
                </div>
              </div>

              {/* Processing Layer */}
              <div className='space-y-4'>
                <h3 className='text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  Processing Layer
                </h3>
                <div className='space-y-2'>
                  <div className='rounded-lg border bg-primary/5 p-3 text-center text-sm'>
                    <Workflow className='mx-auto mb-1 h-5 w-5 text-primary' />
                    Control Plane
                  </div>
                  <div className='rounded-lg border bg-primary/5 p-3 text-center text-sm'>
                    <Bot className='mx-auto mb-1 h-5 w-5 text-primary' />
                    Autopilot Agents
                  </div>
                  <div className='rounded-lg border bg-primary/5 p-3 text-center text-sm'>
                    <Shield className='mx-auto mb-1 h-5 w-5 text-primary' />
                    Governance Layer
                  </div>
                </div>
              </div>

              {/* Output Layer */}
              <div className='space-y-4'>
                <h3 className='text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  Output & Observability
                </h3>
                <div className='space-y-2'>
                  <div className='rounded-lg border bg-muted/50 p-3 text-center text-sm'>
                    <BarChart3 className='mx-auto mb-1 h-5 w-5 text-muted-foreground' />
                    Dashboards & Reports
                  </div>
                  <div className='rounded-lg border bg-muted/50 p-3 text-center text-sm'>
                    <GitBranch className='mx-auto mb-1 h-5 w-5 text-muted-foreground' />
                    Webhook Responses
                  </div>
                  <div className='rounded-lg border bg-muted/50 p-3 text-center text-sm'>
                    <Lock className='mx-auto mb-1 h-5 w-5 text-muted-foreground' />
                    Audit Logs
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Arrows */}
            <div className='my-6 flex items-center justify-center gap-2 text-muted-foreground'>
              <ArrowRight className='h-5 w-5' />
              <span className='text-sm'>
                Event-driven, loosely coupled architecture
              </span>
              <ArrowRight className='h-5 w-5' />
            </div>

            <div className='rounded-lg border bg-muted/30 p-4 text-center text-sm text-muted-foreground'>
              <Cpu className='mx-auto mb-2 h-6 w-6' />
              <strong>Infrastructure Layer:</strong> Containerized deployment
              with auto-scaling, multi-region failover, and encrypted storage
            </div>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className='px-4 py-20'>
        <div className='container mx-auto max-w-4xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              Verify For Yourself
            </h2>
            <p className='text-lg text-muted-foreground'>
              Everything we build is in the repo. Run these commands to see it
              working.
            </p>
          </div>

          <Card className='overflow-hidden'>
            <div className='border-b bg-muted/50 p-4'>
              <div className='flex items-center gap-2'>
                <Terminal className='h-5 w-5 text-primary' />
                <span className='font-semibold'>Quick Start</span>
              </div>
            </div>
            <CardContent className='p-0'>
              <div className='divide-y'>
                {verifyCommands.map((cmd, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-4 p-4 hover:bg-muted/30'
                  >
                    <span className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary'>
                      {index + 1}
                    </span>
                    <div className='flex-1'>
                      <code className='block rounded bg-muted px-3 py-2 font-mono text-sm'>
                        {cmd.command}
                      </code>
                    </div>
                    <span className='text-sm text-muted-foreground'>
                      {cmd.description}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className='mt-8 rounded-lg border bg-muted/30 p-6'>
            <h3 className='mb-4 flex items-center gap-2 font-semibold'>
              <Code2 className='h-5 w-5 text-primary' />
              What You Get
            </h3>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {[
                'Complete source code ownership',
                'Infrastructure as Code (Terraform)',
                'API documentation (OpenAPI)',
                'Runbooks and playbooks',
                'Test suites with >80% coverage',
                'Deployment pipelines (GitHub Actions)',
                'Monitoring dashboards (Grafana)',
                'Security audit reports',
              ].map(item => (
                <div key={item} className='flex items-center gap-2 text-sm'>
                  <CheckCircle2 className='h-4 w-4 flex-shrink-0 text-green-500' />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='border-t border-border bg-muted/30 px-4 py-20'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Ready to Build Your System?
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-muted-foreground'>
            Book a discovery call. We will review your context and outline a
            system architecture tailored to your needs.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href='/contact'>Book a Discovery Call</Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/process'>See How We Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
