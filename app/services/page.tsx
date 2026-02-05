import {
  Code,
  Workflow,
  Zap,
  Shield,
  BarChart,
  Users,
  Building2,
  Globe,
  HeartPulse,
  ShoppingBag,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { ServiceSchema } from '@/components/seo/structured-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Consultancy Services — Custom AI Platform Development | AIAS',
  description:
    'Custom AI platform development, workflow automation architecture, and AI agent design. From strategy to deployment. See our work: TokPulse, Hardonia Suite.',
};

const services = [
  {
    icon: Code,
    title: 'Custom AI Platform Development',
    description:
      'We architect and build complete AI platforms from the ground up — not integrations. TokPulse and Hardonia Suite showcase our full-stack development capabilities.',
    deliverables: [
      'Platform architecture & design',
      'Custom AI agent development',
      'Real-time analytics engines',
      'Scalable infrastructure',
    ],
    timeline: '8-16 weeks',
  },
  {
    icon: Building2,
    title: 'Settler — Payment & Settlement Platform',
    description:
      'Enterprise-grade payment processing and settlement platform. Built for high-volume transactions, compliance, and seamless integrations. Perfect for marketplaces, SaaS, and fintech.',
    deliverables: [
      'Payment processing infrastructure',
      'Settlement & escrow services',
      'Multi-currency support',
      'Compliance & security',
    ],
    timeline: 'Custom',
    link: '/settler',
    badge: 'Partner Product',
  },
  {
    icon: Zap,
    title: 'Edge AI Accelerator Studio',
    description:
      'Optimize and deploy AI models for edge devices, NPUs, and local inference. Model quantization, benchmarking, and deployment tools for Jetson, Android, AI PCs, and more.',
    deliverables: [
      'Model optimization & quantization',
      'Device profiling & benchmarking',
      'Edge deployment packages',
      'SDK scaffolds & integration support',
    ],
    timeline: '2-8 weeks',
    link: '/edge-ai',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation Architecture',
    description:
      'Design automation systems that assist with business logic. Human review points are built into every critical decision.',
    deliverables: [
      'Process analysis & mapping',
      'Automation design with HITL gates',
      'Custom workflow builders',
      'Integration architecture',
    ],
    timeline: '4-12 weeks',
  },
  {
    icon: Zap,
    title: 'AI Agent Design & Development',
    description:
      'Build custom AI agents that assist with complex tasks under human supervision. All outputs are reviewed before action.',
    deliverables: [
      'Agent architecture with oversight',
      'Training data preparation',
      'Model configuration',
      'Deployment with HITL gates',
    ],
    timeline: '4-8 weeks',
  },
  {
    icon: BarChart,
    title: 'Analytics & Intelligence Platforms',
    description:
      'Create real-time analytics platforms for data analysis and reporting. Human analysts review insights before decisions.',
    deliverables: [
      'Data pipeline architecture',
      'Real-time dashboards',
      'Analytics workflows',
      'Custom reporting',
    ],
    timeline: '6-12 weeks',
  },
  {
    icon: Shield,
    title: 'Enterprise Security & Compliance',
    description:
      'Build with security-first architecture. PIPEDA compliant, SOC 2 ready, enterprise-grade encryption.',
    deliverables: [
      'Security architecture review',
      'Compliance implementation',
      'Access control systems',
      'Audit logging',
    ],
    timeline: '2-4 weeks',
  },
  {
    icon: Users,
    title: 'Ongoing Support & Optimization',
    description:
      'Continuous improvement, monitoring, and optimization. We stay with you after launch.',
    deliverables: [
      'Performance monitoring',
      'Feature enhancements',
      'Bug fixes & updates',
      'Strategic consulting',
    ],
    timeline: 'Ongoing',
  },
];

import { MobileStickyCTA } from '@/components/layout/mobile-sticky-cta';

export default function ServicesPage() {
  return (
    <>
      <ServiceSchema />
      <MobileStickyCTA
        primaryHref='/demo'
        primaryLabel='Book Consultation'
        secondaryHref='/pricing'
        secondaryLabel='See Pricing'
      />
      <div className='container py-16'>
        <div className='mx-auto mb-16 max-w-3xl px-4 text-center'>
          <h1 className='mb-6 text-4xl font-bold md:text-5xl'>
            AIAS Consultancy — Custom Development Services
          </h1>
          <p className='mb-8 text-xl leading-relaxed text-muted-foreground md:text-2xl'>
            Need something custom? We build complete AI platforms, automation
            systems, and intelligent agents tailored to your business. See our
            work: TokPulse, Hardonia Suite.
          </p>
          <div
            aria-label='Service Comparison'
            className='mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/20 md:p-8'
            role='region'
          >
            <h2 className='mb-4 text-lg font-semibold md:text-xl'>
              SaaS vs. Consulting — Which Do You Need?
            </h2>
            <div className='grid grid-cols-1 gap-6 text-left md:grid-cols-2'>
              <div>
                <h3 className='mb-3 text-base font-semibold'>
                  AIAS Platform (SaaS)
                </h3>
                <p className='mb-3 text-sm text-muted-foreground'>
                  Choose if you want:
                </p>
                <ul className='mb-4 space-y-2 text-sm text-muted-foreground'>
                  <li>• Self-serve automation ($49-149/month)</li>
                  <li>• Pre-built templates and integrations</li>
                  <li>• Quick setup (30 minutes)</li>
                  <li>• Standard workflows</li>
                </ul>
                <Button asChild className='w-full' size='sm' variant='outline'>
                  <Link href='/pricing'>View SaaS Plans</Link>
                </Button>
              </div>
              <div>
                <h3 className='mb-3 text-base font-semibold'>
                  AIAS Consultancy (Custom)
                </h3>
                <p className='mb-3 text-sm text-muted-foreground'>
                  Choose if you need:
                </p>
                <ul className='mb-4 space-y-2 text-sm text-muted-foreground'>
                  <li>• Custom platform development</li>
                  <li>• Unique business requirements</li>
                  <li>• Full-stack development (8-16 weeks)</li>
                  <li>• Ongoing support and optimization</li>
                </ul>
                <Button asChild className='w-full' size='sm' variant='outline'>
                  <Link href='/demo'>Schedule Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href='/demo'>Schedule Strategy Call</Link>
            </Button>
            <Button asChild size='lg' variant='outline'>
              <Link href='/case-studies'>See Our Builds</Link>
            </Button>
          </div>
        </div>

        <div className='mb-16 grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3'>
          {services.map(service => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className='h-full'>
                <CardHeader className='pb-4'>
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                      <Icon className='h-6 w-6 text-primary' />
                    </div>
                    {'badge' in service && service.badge && (
                      <Badge className='ml-auto' variant='secondary'>
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className='mb-3 text-xl'>
                    {service.title}
                  </CardTitle>
                  <CardDescription className='text-base leading-relaxed'>
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='space-y-5'>
                    <div>
                      <h4 className='mb-3 text-sm font-semibold'>
                        Deliverables:
                      </h4>
                      <ul className='space-y-2'>
                        {service.deliverables.map((item, idx) => (
                          <li
                            key={idx}
                            className='flex items-start gap-2 text-sm leading-relaxed text-muted-foreground'
                          >
                            <span className='mt-1 text-primary'>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='border-t pt-4'>
                      <p className='mb-4 text-sm leading-relaxed text-muted-foreground'>
                        <strong>Typical Timeline:</strong> {service.timeline}
                      </p>
                      {'link' in service && service.link && (
                        <Button
                          asChild
                          className='w-full'
                          size='sm'
                          variant='outline'
                        >
                          <Link href={service.link}>Learn More</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className='mb-16 px-4'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold'>Industries We Serve</h2>
            <p className='mx-auto max-w-2xl text-muted-foreground'>
              Our custom platforms are tailored to the unique regulatory and
              operational needs of these sectors.
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <Card className='border-t-4 border-t-blue-500 transition-shadow hover:shadow-lg'>
              <CardHeader>
                <ShoppingBag className='mb-2 h-8 w-8 text-blue-500' />
                <CardTitle className='text-lg'>E-Commerce</CardTitle>
                <CardDescription>
                  Inventory sync, multi-channel automation, and AI customer
                  support.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className='border-t-4 border-t-green-500 transition-shadow hover:shadow-lg'>
              <CardHeader>
                <BarChart className='mb-2 h-8 w-8 text-green-500' />
                <CardTitle className='text-lg'>Fintech</CardTitle>
                <CardDescription>
                  Compliance reporting, transaction analysis, and fraud
                  detection.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className='border-t-4 border-t-red-500 transition-shadow hover:shadow-lg'>
              <CardHeader>
                <HeartPulse className='mb-2 h-8 w-8 text-red-500' />
                <CardTitle className='text-lg'>Healthcare</CardTitle>
                <CardDescription>
                  HIPAA/PIPEDA compliant patient scheduling and document
                  processing.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className='border-t-4 border-t-purple-500 transition-shadow hover:shadow-lg'>
              <CardHeader>
                <Globe className='mb-2 h-8 w-8 text-purple-500' />
                <CardTitle className='text-lg'>Logistics</CardTitle>
                <CardDescription>
                  Route optimization, fleet management, and automated dispatch.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className='rounded-lg bg-muted/50 p-8 px-4 text-center md:p-10'>
          <h2 className='mb-4 text-2xl font-bold md:text-3xl'>
            Ready to Build Your Custom AI Platform?
          </h2>
          <p className='mx-auto mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg'>
            Schedule a strategy call to discuss your project. We'll review your
            needs, share relevant case studies, and outline a custom solution.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href='/demo'>Schedule Strategy Call</Link>
            </Button>
            <Button asChild size='lg' variant='outline'>
              <Link href='/case-studies'>View Case Studies</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
