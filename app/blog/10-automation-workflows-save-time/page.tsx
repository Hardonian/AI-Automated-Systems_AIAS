import { Check, ArrowRight, Clock, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { siteContent } from '@/src/content/site';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: '10 Automation Workflows That Save 10+ Hours Per Week | AIAS Platform',
  description:
    'Discover 10 powerful automation workflows that save 10+ hours per week. From e-commerce to customer support, learn how to automate repetitive tasks.',
  keywords: [
    'automation workflows',
    'time saving automation',
    'business automation',
    'workflow automation',
    'automation examples',
    'productivity automation',
  ],
};

const workflows = [
  {
    title: 'E-Commerce Order Processing',
    timeSaved: '3-5 hours/week',
    description:
      'Automatically process orders, update inventory, send confirmations, and notify your team.',
    steps: [
      'New order in Shopify triggers workflow',
      'Update inventory in real-time',
      'Send confirmation email to customer',
      'Notify team in Slack',
      'Generate shipping label',
    ],
  },
  {
    title: 'Lead Capture to CRM',
    timeSaved: '2-3 hours/week',
    description:
      'Automatically capture leads from multiple sources, qualify them, and add to your CRM.',
    steps: [
      'Capture lead from form, email, or social',
      'Qualify lead with AI',
      'Add to CRM (HubSpot, Salesforce)',
      'Send welcome email',
      'Assign to sales rep',
    ],
  },
  {
    title: 'Customer Support Ticket Routing',
    timeSaved: '2-4 hours/week',
    description:
      'Intelligently route support tickets to the right team member based on content and priority.',
    steps: [
      'New ticket arrives',
      'AI analyzes content and urgency',
      'Route to appropriate team member',
      'Send acknowledgment to customer',
      'Track response time',
    ],
  },
  {
    title: 'Daily Email Summary',
    timeSaved: '1-2 hours/week',
    description:
      'Get a daily summary of important events, metrics, and tasks automatically.',
    steps: [
      'Collect data from multiple sources',
      'Generate summary report',
      'Send email at scheduled time',
      'Include key metrics and insights',
    ],
  },
  {
    title: 'Content Creation & Distribution',
    timeSaved: '3-5 hours/week',
    description:
      'Automate content creation, scheduling, and distribution across platforms.',
    steps: [
      'Generate content with AI',
      'Review and approve',
      'Schedule across platforms',
      'Track performance',
      'Optimize based on results',
    ],
  },
  {
    title: 'Invoice Processing',
    timeSaved: '2-3 hours/week',
    description:
      'Automatically process invoices, match with purchase orders, and update accounting.',
    steps: [
      'Receive invoice via email',
      'Extract data with AI',
      'Match with purchase order',
      'Approve or flag for review',
      'Update accounting system',
    ],
  },
  {
    title: 'Social Media Management',
    timeSaved: '2-4 hours/week',
    description:
      'Schedule posts, respond to comments, and track engagement automatically.',
    steps: [
      'Create content calendar',
      'Schedule posts across platforms',
      'Monitor comments and mentions',
      'Respond with AI assistance',
      'Track engagement metrics',
    ],
  },
  {
    title: 'Data Processing & Reporting',
    timeSaved: '3-6 hours/week',
    description:
      'Automatically process data, generate reports, and share insights with your team.',
    steps: [
      'Collect data from multiple sources',
      'Process and clean data',
      'Generate reports',
      'Share with stakeholders',
      'Schedule recurring reports',
    ],
  },
  {
    title: 'Employee Onboarding',
    timeSaved: '2-3 hours/week',
    description:
      'Automate the onboarding process for new employees, from paperwork to system access.',
    steps: [
      'New employee added to system',
      'Send welcome email with resources',
      'Create accounts in required systems',
      'Schedule training sessions',
      'Track completion',
    ],
  },
  {
    title: 'Inventory Management',
    timeSaved: '2-4 hours/week',
    description:
      'Automatically sync inventory across platforms, reorder when low, and update product listings.',
    steps: [
      'Monitor inventory levels',
      'Sync across all platforms',
      'Alert when stock is low',
      'Generate purchase orders',
      'Update product listings',
    ],
  },
];

export default function AutomationWorkflowsPage() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-12 md:py-16'>
      {/* Header */}
      <div className='mb-12'>
        <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary'>
          <Zap className='h-4 w-4' />
          <span>Automation Best Practices</span>
        </div>
        <h1 className='mb-4 text-4xl font-extrabold md:text-5xl'>
          10 Automation Workflows That Save 10+ Hours Per Week
        </h1>
        <p className='mb-6 text-xl text-muted-foreground'>
          Discover powerful automation workflows that eliminate repetitive tasks
          and free up your time for strategic work.
        </p>
        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
          <span className='flex items-center gap-2'>
            <Clock className='h-4 w-4' />
            10 min read
          </span>
          <span>•</span>
          <span>Published: January 2025</span>
        </div>
      </div>

      {/* Introduction */}
      <div className='prose prose-lg mb-12 max-w-none dark:prose-invert'>
        <p className='text-lg'>
          Automation isn't just about saving time—it's about scaling your
          business without hiring. The workflows below are used by thousands of
          businesses to save 10+ hours per week, reduce errors by 90%, and
          increase productivity by 40%.
        </p>
        <p>
          Each workflow follows the same pattern:{' '}
          <strong>trigger → action → result</strong>. Start with one workflow,
          prove the value, then scale to multiple workflows working together.
        </p>
      </div>

      {/* Workflows */}
      <div className='mb-12 space-y-8'>
        {workflows.map((workflow, index) => (
          <Card key={index}>
            <CardContent className='p-6'>
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h2 className='mb-2 text-2xl font-bold'>
                    {index + 1}. {workflow.title}
                  </h2>
                  <div className='flex items-center gap-2 font-semibold text-primary'>
                    <Clock className='h-4 w-4' />
                    <span>Saves {workflow.timeSaved}</span>
                  </div>
                </div>
              </div>
              <p className='mb-4 text-muted-foreground'>
                {workflow.description}
              </p>
              <div className='rounded-lg bg-muted p-4'>
                <h3 className='mb-2 text-sm font-semibold'>How it works:</h3>
                <ol className='list-inside list-decimal space-y-1 text-sm text-muted-foreground'>
                  {workflow.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Takeaways */}
      <Card className='mb-12 bg-gradient-to-br from-primary/5 to-accent/5'>
        <CardContent className='p-6'>
          <h2 className='mb-4 text-2xl font-bold'>Key Takeaways</h2>
          <ul className='space-y-2'>
            {[
              'Start with one workflow to prove value',
              'Use templates to save setup time',
              'Connect all your tools for maximum power',
              'Monitor and optimize regularly',
              'Scale to multiple workflows working together',
            ].map((takeaway, index) => (
              <li key={index} className='flex items-start gap-2'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className='bg-primary/5'>
        <CardContent className='p-8 text-center'>
          <h2 className='mb-4 text-2xl font-bold'>
            Ready to Automate Your Business?
          </h2>
          <p className='mb-6 text-muted-foreground'>
            Share your workflow goals and we will map a reliable automation
            plan.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href={siteContent.positioning.primaryCTA.href}>
                {siteContent.positioning.primaryCTA.label}
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button asChild size='lg' variant='outline'>
              <Link href={`mailto:${siteContent.contact.email}`}>
                Email {siteContent.contact.email}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Related Content */}
      <div className='mt-12 border-t pt-8'>
        <h3 className='mb-4 text-xl font-bold'>Related Articles</h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Link
            className='block rounded-lg border p-4 transition-colors hover:border-primary'
            href='/#secret-sauce'
          >
            <h4 className='mb-2 font-semibold'>
              Systems Thinking: The Critical Skill for the AI Age
            </h4>
            <p className='text-sm text-muted-foreground'>
              Learn how systems thinking makes your automations better
            </p>
          </Link>
          <Link
            className='block rounded-lg border p-4 transition-colors hover:border-primary'
            href='/#workflow-sandbox'
          >
            <h4 className='mb-2 font-semibold'>
              Business Automation: Complete Guide
            </h4>
            <p className='text-sm text-muted-foreground'>
              Everything you need to know about business automation
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
