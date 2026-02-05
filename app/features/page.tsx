import type { Metadata } from 'next';
import Link from 'next/link';

import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ParallaxBackground } from '@/components/ui/ParallaxBackground';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { TextReveal } from '@/components/ui/TextReveal';

export const metadata: Metadata = {
  title: 'Features — Systems Thinking + AI | AIAS Platform',
  description:
    'Workflow design tools, automation capabilities, and governance features for organizations building with AI.',
};

const featureCategories = [
  {
    title: 'Problem Analysis',
    description:
      'Frameworks for analyzing challenges from multiple perspectives before designing solutions.',
    features: [
      {
        name: 'Multi-Perspective Analysis',
        description:
          'Analyze challenges from multiple angles to identify considerations before implementation.',
      },
      {
        name: 'Root Cause Identification',
        description:
          'Identify underlying factors to address before designing interventions.',
      },
      {
        name: 'Integrated Solutions',
        description:
          'Design solutions that account for system interdependencies.',
      },
      {
        name: 'Structured Decision Support',
        description:
          'Document relationships and dependencies to inform decision-making.',
      },
    ],
  },
  {
    title: 'Workflow Automation',
    description:
      'Design workflows that assist teams with task execution. Human review points are configurable.',
    features: [
      {
        name: 'Workflow Builder',
        description:
          'Design multi-step workflows with configurable human review gates at critical points.',
      },
      {
        name: 'Decision Support',
        description:
          'Generate recommendations for human review. Decisions remain with your team.',
      },
      {
        name: 'Time Efficiency',
        description:
          'Reduce time spent on repetitive tasks through assisted workflows.',
      },
      {
        name: 'Controlled Scaling',
        description:
          'Expand workflow usage with governance controls and review processes.',
      },
    ],
  },
  {
    title: 'Content Analysis',
    description:
      'Analyze and optimize content from multiple perspectives before publication.',
    features: [
      {
        name: 'Multi-Dimensional Analysis',
        description:
          'Review content from SEO, UX, structure, conversion, technical, and systems perspectives.',
      },
      {
        name: 'Content Generation Support',
        description:
          'Generate draft content for human review and editing before publication.',
      },
      {
        name: 'Holistic Optimization',
        description:
          'Consider multiple factors beyond keywords for comprehensive content review.',
      },
      {
        name: 'Performance Monitoring',
        description:
          'Track content performance metrics to inform future iterations.',
      },
    ],
  },
  {
    title: 'Global Integrations',
    description:
      'Connect with business systems through documented APIs and webhooks.',
    features: [
      {
        name: 'E-Commerce Platforms',
        description:
          'Connect with Shopify, WooCommerce, and BigCommerce for order and inventory management.',
      },
      {
        name: 'Accounting & Finance',
        description:
          'Integrate with Wave Accounting, QuickBooks, and Stripe for financial workflows.',
      },
      {
        name: 'Banking & Payments',
        description:
          'Connect with Canadian banking and payment providers for transaction processing.',
      },
      {
        name: 'CRM & Sales',
        description:
          'Integrate with HubSpot, Salesforce, and Pipedrive for sales pipeline management.',
      },
    ],
  },
  {
    title: 'Process Automation',
    description:
      'Automate routine tasks with human oversight at critical decision points.',
    features: [
      {
        name: 'Visual Workflow Builder',
        description:
          'Connect tools with visual workflows. Multi-step processes with human checkpoints.',
      },
      {
        name: 'Smart Scheduling',
        description:
          'AI-assisted scheduling with human confirmation. Context-aware time slot suggestions.',
      },
      {
        name: 'Data Processing',
        description:
          'Extract and organize data with human validation. Review extracted data before action.',
      },
      {
        name: 'Quality Validation',
        description:
          'Built-in validation checks with human override capabilities for edge cases.',
      },
    ],
  },
  {
    title: 'Analytics & Insights',
    description:
      'Track workflow performance and usage patterns for operational review.',
    features: [
      {
        name: 'Performance Dashboard',
        description:
          'Monitor workflow execution, success rates, and operational metrics.',
      },
      {
        name: 'Usage Analytics',
        description:
          'Track usage patterns and identify optimization opportunities.',
      },
      {
        name: 'Custom Reports',
        description:
          'Generate reports for stakeholder review. Export data for further analysis.',
      },
      {
        name: 'Operational Metrics',
        description: 'Track efficiency metrics to inform process improvements.',
      },
    ],
  },
  {
    title: 'Security & Governance',
    description:
      'Built-in controls for access management and audit compliance.',
    features: [
      {
        name: 'Privacy Compliance',
        description:
          'Design patterns aligned with PIPEDA and privacy best practices.',
      },
      {
        name: 'Data Residency',
        description:
          'Canadian data centers with disclosed fallback locations. Data location transparency.',
      },
      {
        name: 'Security Architecture',
        description:
          'AES-256 encryption. Regular security reviews. Audit logging capabilities.',
      },
      {
        name: 'Access Controls',
        description:
          'Role-based access control. Audit trails for compliance reviews.',
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <ParallaxBackground className='container py-16'>
      <div className='mb-12 px-4 text-center'>
        <TextReveal
          as='h1'
          className='mb-6 block text-4xl font-bold md:text-5xl'
          delay={0.1}
          staggerDelay={0.03}
        >
          Platform Features
        </TextReveal>
        <p className='mx-auto mb-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl'>
          Workflow design tools, automation capabilities, and governance
          features for teams building with AI.
        </p>
        <div className='mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
          Human-in-the-Loop • Configurable Governance • Audit Ready
        </div>
      </div>

      {featureCategories.map(category => (
        <section key={category.title} className='mb-16 px-4'>
          <div className='mb-10 text-center'>
            <TextReveal
              as='h2'
              className='mb-4 text-3xl font-bold md:text-4xl'
              delay={0.2}
              staggerDelay={0.02}
            >
              {category.title}
            </TextReveal>
            <p className='mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg'>
              {category.description}
            </p>
          </div>
          <BentoGrid className='gap-6' columns={2}>
            {category.features.map(feature => (
              <BentoGridItem key={feature.name} colSpan={1} rowSpan={1}>
                <SpotlightCard>
                  <Card className='h-full border-0 bg-transparent shadow-none'>
                    <CardHeader className='pb-4'>
                      <CardTitle className='mb-2 text-xl'>
                        {feature.name}
                      </CardTitle>
                      <CardDescription className='text-base leading-relaxed'>
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </SpotlightCard>
              </BentoGridItem>
            ))}
          </BentoGrid>
        </section>
      ))}

      <div className='mt-16 space-y-6 rounded-lg bg-primary/5 p-8 px-4 text-center md:p-10'>
        <h2 className='mb-4 text-2xl font-bold md:text-3xl'>
          Ready to Explore the Platform?
        </h2>
        <p className='mx-auto mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg'>
          Start with a 30-day trial. No credit card required. Evaluate the
          platform with your team.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button asChild className='h-12 text-base font-semibold' size='lg'>
            <Link href='/signup'>Start 30-Day Free Trial</Link>
          </Button>
          <Button
            asChild
            className='h-12 text-base font-semibold'
            size='lg'
            variant='outline'
          >
            <Link href='/pricing'>See Pricing</Link>
          </Button>
        </div>
      </div>
    </ParallaxBackground>
  );
}
