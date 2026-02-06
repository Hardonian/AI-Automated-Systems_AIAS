import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield,
  FileCheck,
  DollarSign,
  Clock,
  Code,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'FAQ — AIAS Consultancy | Common Questions Answered',
  description:
    'Answers to common questions about AIAS engagement models, security, pricing, and what to expect when working with us.',
};

const faqCategories = [
  {
    id: 'security',
    icon: Shield,
    title: 'Security & Privacy',
    questions: [
      {
        q: 'Where is my data stored?',
        a: 'By default, all data is stored in Canadian data centers (Toronto, Montreal) to ensure PIPEDA compliance. For clients with specific requirements, we can deploy to other regions (US, EU) with appropriate compliance certifications (SOC 2, GDPR). You maintain full ownership of your data and can request complete exports at any time.',
      },
      {
        q: 'How do you ensure AI outputs are safe?',
        a: 'We implement multiple layers of safety: (1) Human-in-the-loop checkpoints for critical decisions, (2) Output validation schemas that reject malformed data, (3) Confidence thresholds that trigger human review, (4) Comprehensive audit logs of all AI decisions, (5) Rate limiting to prevent runaway automation. No AI action is taken without appropriate oversight.',
      },
      {
        q: 'What happens to my data if we stop working together?',
        a: 'You own all your data and code. Upon contract termination, we provide: (1) Complete database exports in standard formats (JSON, CSV, SQL), (2) All source code and documentation, (3) Infrastructure migration guides, (4) 30-day transition support. We delete all copies of your data from our systems within 30 days of handoff.',
      },
      {
        q: 'Are you SOC 2 compliant?',
        a: 'We are SOC 2 Type I certified and working toward Type II. Our infrastructure providers (Supabase, Vercel, Stripe) maintain SOC 2 Type II compliance. We can provide our security documentation, penetration test results, and compliance certifications upon request during the sales process.',
      },
    ],
  },
  {
    id: 'engagement',
    icon: Clock,
    title: 'Engagement & Process',
    questions: [
      {
        q: 'How long does a typical engagement take?',
        a: "Pilot engagements (1-2 workflows) take 2-4 weeks. Scale engagements (3-8 workflows) take 6-12 weeks. Enable engagements (ongoing support) are month-to-month. Exact timelines depend on complexity, integration requirements, and your team's availability for reviews and approvals.",
      },
      {
        q: 'What does a Pilot engagement include?',
        a: 'A Pilot includes: (1) Discovery session to identify highest-value use case, (2) Workflow design with state machines and error handling, (3) Build and iterative testing with your team, (4) Observability and monitoring setup, (5) Governance baseline configuration, (6) Documentation and handoff. You get 1-2 production workflows and all artifacts.',
      },
      {
        q: 'Do you work with our existing team or replace them?',
        a: 'We work with your existing team. Our goal is knowledge transfer—we want your team to understand and operate what we build. We conduct workshops, pair programming sessions, and create detailed documentation. By the end of an engagement, your team should be able to extend and maintain the system independently.',
      },
      {
        q: 'What if we need changes after delivery?',
        a: 'All engagements include a 30-day warranty period for bug fixes. For ongoing changes, we offer Enable engagements (monthly retainer) or can scope additional work as needed. Because you own the code, your internal team can also make changes—no vendor lock-in.',
      },
    ],
  },
  {
    id: 'pricing',
    icon: DollarSign,
    title: 'Pricing & Payment',
    questions: [
      {
        q: 'How is pricing structured?',
        a: 'Pilot engagements start at $15,000. Scale engagements start at $50,000. Enable (ongoing support) starts at $5,000/month. Pricing depends on complexity, number of integrations, and timeline. We provide fixed-price quotes after the discovery phase so there are no surprises.',
      },
      {
        q: 'Are there any hidden costs?',
        a: "No. Our quotes include all development, documentation, and handoff work. You pay separately for: (1) Infrastructure costs (billed directly by providers like Vercel, Supabase), (2) Third-party API costs (billed by services like OpenAI, Stripe), (3) Your internal team's time for reviews and approvals. We provide cost estimates for infrastructure and APIs upfront.",
      },
      {
        q: 'What payment terms do you offer?',
        a: 'For engagements under $25,000: 50% upfront, 50% on delivery. For engagements over $25,000: 30% upfront, 40% at midpoint, 30% on delivery. We accept bank transfer, credit card (with 3% processing fee), and ACH. Net-15 payment terms are standard; Net-30 available for established clients.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'If we cannot deliver what was agreed upon in the statement of work, we offer partial or full refunds based on work completed. Refund requests are evaluated on a case-by-case basis. To date, we have not had a refund request—we work hard to set clear expectations upfront.',
      },
    ],
  },
  {
    id: 'technical',
    icon: Code,
    title: 'Technical Details',
    questions: [
      {
        q: 'What technology stack do you use?',
        a: 'Our default stack: Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI components, Supabase (PostgreSQL + Auth), Prisma ORM, XState for workflows, and OpenAI for AI features. We can adapt to your existing stack if you have preferences (React, Vue, Node, Python, etc.).',
      },
      {
        q: 'Can we host the system ourselves?',
        a: 'Yes. We can deploy to your infrastructure (AWS, GCP, Azure) or help you set up your own Vercel/Supabase accounts. For on-premise deployments, we support Docker and Kubernetes. Self-hosting documentation is included in every engagement.',
      },
      {
        q: 'How do you handle integrations with our existing systems?',
        a: 'We build custom API connectors for your specific systems. Each integration includes: (1) API contract documentation, (2) Authentication handling (OAuth, API keys, etc.), (3) Rate limiting and retry logic, (4) Error handling and alerting, (5) Testing harness. We work with REST, GraphQL, webhooks, and legacy systems.',
      },
      {
        q: 'What happens if an AI agent makes a mistake?',
        a: 'Our systems are designed with fallbacks: (1) Confidence scoring routes uncertain outputs to human review, (2) Validation layers catch malformed data before it reaches your systems, (3) Comprehensive logging helps identify and fix root causes, (4) Circuit breakers prevent cascading failures. We also include monitoring and alerting so you know when intervention is needed.',
      },
    ],
  },
  {
    id: 'ownership',
    icon: FileCheck,
    title: 'Ownership & IP',
    questions: [
      {
        q: 'Who owns the code after the engagement?',
        a: 'You do. All source code, documentation, and configurations are transferred to you upon delivery. We use permissive open-source licenses (MIT) for any custom libraries we build. You can modify, extend, and commercialize the code as you see fit—no ongoing licensing fees.',
      },
      {
        q: 'Can we see examples of your work before engaging?',
        a: "Yes. Visit our case studies page for detailed examples of platforms we've built. We can also provide: (1) Architecture diagrams from past engagements (anonymized), (2) Code samples demonstrating our quality standards, (3) References from past clients (with their permission). For sensitive projects, we sign NDAs before sharing details.",
      },
      {
        q: 'Do you use proprietary frameworks that lock us in?',
        a: "No. We use industry-standard open-source tools (Next.js, React, TypeScript, PostgreSQL) and avoid proprietary frameworks. If we build custom abstractions, they're well-documented and you own them. Our goal is for you to be able to hire any competent developer to maintain and extend what we build.",
      },
      {
        q: 'Can we contribute to or modify the code during the engagement?',
        a: 'Absolutely. We encourage collaboration. Many clients participate in: (1) Code reviews on pull requests, (2) Pair programming sessions, (3) Architecture decision records (ADRs), (4) Testing and validation. The more your team is involved, the smoother the handoff will be.',
      },
    ],
  },
];

const quickLinks = [
  {
    title: 'See Our Work',
    description: 'Case studies and real builds',
    href: '/case-studies',
    icon: Building2,
  },
  {
    title: 'Our Process',
    description: 'How engagements work',
    href: '/process',
    icon: Clock,
  },
  {
    title: 'Systems We Build',
    description: 'Capabilities and architecture',
    href: '/systems',
    icon: Code,
  },
  {
    title: 'Pricing',
    description: 'Engagement packages',
    href: '/pricing',
    icon: DollarSign,
  },
];

export default function FAQPage() {
  return (
    <main className='min-h-screen'>
      {/* Hero Section */}
      <section className='border-b border-border bg-gradient-to-b from-muted/30 to-background px-4 py-16'>
        <div className='container mx-auto max-w-4xl text-center'>
          <Badge variant='secondary' className='mb-6'>
            Questions & Answers
          </Badge>
          <h1 className='mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl'>
            Frequently Asked Questions
          </h1>
          <p className='mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl'>
            Straight answers to common questions about security, process,
            pricing, and what to expect when working with AIAS.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground'>
            <span className='flex items-center gap-2'>
              <CheckCircle2 className='h-4 w-4 text-green-500' />
              No vendor lock-in
            </span>
            <span className='flex items-center gap-2'>
              <CheckCircle2 className='h-4 w-4 text-green-500' />
              You own everything
            </span>
            <span className='flex items-center gap-2'>
              <CheckCircle2 className='h-4 w-4 text-green-500' />
              Transparent pricing
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className='px-4 py-16'>
        <div className='container mx-auto max-w-4xl'>
          <div className='space-y-16'>
            {faqCategories.map(category => {
              const Icon = category.icon;
              return (
                <div key={category.id} id={category.id}>
                  <div className='mb-6 flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                      <Icon className='h-5 w-5 text-primary' />
                    </div>
                    <h2 className='text-2xl font-bold'>{category.title}</h2>
                  </div>

                  <Accordion type='single' collapsible className='space-y-4'>
                    {category.questions.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.id}-${index}`}
                        className='rounded-lg border bg-card px-6 data-[state=open]:border-primary/50'
                      >
                        <AccordionTrigger className='py-4 text-left text-base font-semibold hover:no-underline'>
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className='pb-4 leading-relaxed text-muted-foreground'>
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className='border-y border-border bg-muted/30 px-4 py-16'>
        <div className='container mx-auto max-w-4xl'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div>
              <h2 className='mb-4 text-2xl font-bold'>Still Have Questions?</h2>
              <p className='mb-6 text-muted-foreground'>
                Can not find what you are looking for? Book a discovery call and
                we will answer your specific questions.
              </p>
              <Button asChild size='lg'>
                <Link href='/contact'>
                  Book a Discovery Call
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {quickLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='group rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm'
                  >
                    <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/20'>
                      <Icon className='h-4 w-4 text-primary' />
                    </div>
                    <h3 className='mb-1 font-semibold'>{link.title}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {link.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Risk Addressing Section */}
      <section className='px-4 py-16'>
        <div className='container mx-auto max-w-4xl'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold'>
              Addressing Your Concerns
            </h2>
            <p className='text-lg text-muted-foreground'>
              We know engaging a consultancy involves risk. Here is how we
              mitigate it.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <Card>
              <CardHeader>
                <AlertTriangle className='mb-2 h-8 w-8 text-amber-500' />
                <CardTitle>Risk: Vendor Lock-In</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  <strong>Mitigation:</strong> You own all code, documentation,
                  and configurations. We use open-source tools. You can hire any
                  developer to maintain what we build.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <AlertTriangle className='mb-2 h-8 w-8 text-amber-500' />
                <CardTitle>Risk: Project Failure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  <strong>Mitigation:</strong> Pilots are scoped to deliver
                  value in 2-4 weeks. Fixed-price quotes after discovery. Refund
                  policy if we do not deliver.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <AlertTriangle className='mb-2 h-8 w-8 text-amber-500' />
                <CardTitle>Risk: Security Breach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  <strong>Mitigation:</strong> PIPEDA-compliant Canadian data
                  centers. SOC 2 certified. Human-in-the-loop for critical
                  decisions. Comprehensive audit logging.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <AlertTriangle className='mb-2 h-8 w-8 text-amber-500' />
                <CardTitle>Risk: AI Gone Wrong</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  <strong>Mitigation:</strong> Confidence thresholds, human
                  checkpoints, validation layers, and circuit breakers prevent
                  autonomous actions that could cause harm.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <AlertTriangle className='mb-2 h-8 w-8 text-amber-500' />
                <CardTitle>Risk: Hidden Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  <strong>Mitigation:</strong> Fixed-price quotes. Clear
                  separation of our fees vs. infrastructure costs. No surprises
                  at invoice time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <AlertTriangle className='mb-2 h-8 w-8 text-amber-500' />
                <CardTitle>Risk: Team Dependency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  <strong>Mitigation:</strong> Knowledge transfer is woven into
                  every engagement. Documentation, training, and handoff
                  procedures ensure your team can operate independently.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='border-t border-border bg-gradient-to-b from-muted/30 to-background px-4 py-16'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Ready to Move Forward?</h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-muted-foreground'>
            Book a discovery call. We will answer any remaining questions and
            discuss whether we are a good fit for your project.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href='/contact'>Book a Discovery Call</Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/systems'>See What We Build</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
