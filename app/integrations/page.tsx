import type { Metadata } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title:
    'Integrations — AIAS Platform | 100+ Global Business Tools & Platforms',
  description:
    'Connect 100+ business tools worldwide: Shopify, Stripe, PayPal, Google Workspace, Salesforce, HubSpot, QuickBooks, and more. Support for Canadian, US, EU, and APAC markets.',
};

const integrations = [
  {
    category: 'E-Commerce',
    description: 'Automate your online store operations globally',
    tools: [
      {
        name: 'Shopify',
        description: 'Order processing, inventory, customer support (Global)',
        status: 'available',
      },
      {
        name: 'WooCommerce',
        description: 'E-commerce automation for WordPress (Global)',
        status: 'coming-soon',
      },
      {
        name: 'BigCommerce',
        description: 'Store management and order fulfillment (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Magento',
        description: 'Enterprise e-commerce automation',
        status: 'coming-soon',
      },
      {
        name: 'Amazon',
        description: 'Marketplace automation and fulfillment',
        status: 'coming-soon',
      },
    ],
  },
  {
    category: 'Accounting & Finance',
    description: 'Streamline your financial operations worldwide',
    tools: [
      {
        name: 'QuickBooks',
        description: 'Accounting automation (US, CA, UK, AU)',
        status: 'coming-soon',
      },
      {
        name: 'Xero',
        description: 'Cloud accounting (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Wave Accounting',
        description: 'Invoicing, bookkeeping (CA, US)',
        status: 'available',
      },
      {
        name: 'Sage',
        description: 'Accounting software (Global)',
        status: 'coming-soon',
      },
      {
        name: 'FreshBooks',
        description: 'Cloud-based accounting (Global)',
        status: 'coming-soon',
      },
    ],
  },
  {
    category: 'Payment Processing',
    description: 'Global payment processors and banking',
    tools: [
      {
        name: 'Stripe',
        description: 'Payment processing (Global, multi-currency)',
        status: 'coming-soon',
      },
      {
        name: 'PayPal',
        description: 'Payment and invoice automation (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Square',
        description: 'Payment processing (US, CA, UK, AU, JP)',
        status: 'coming-soon',
      },
      {
        name: 'Adyen',
        description: 'Enterprise payments (Global)',
        status: 'coming-soon',
      },
      {
        name: 'RBC / TD Bank',
        description: 'Canadian banking automation',
        status: 'coming-soon',
      },
      {
        name: 'Wise (formerly TransferWise)',
        description: 'International money transfers',
        status: 'coming-soon',
      },
    ],
  },
  {
    category: 'CRM & Sales',
    description: 'Manage your customer relationships globally',
    tools: [
      {
        name: 'Salesforce',
        description: 'Sales pipeline and customer data (Global)',
        status: 'coming-soon',
      },
      {
        name: 'HubSpot',
        description: 'CRM automation and lead management (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Pipedrive',
        description: 'Sales process automation (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Zoho CRM',
        description: 'CRM platform (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Microsoft Dynamics',
        description: 'Enterprise CRM (Global)',
        status: 'coming-soon',
      },
    ],
  },
  {
    category: 'Communication',
    description: 'Automate your communication workflows worldwide',
    tools: [
      {
        name: 'Gmail / Google Workspace',
        description: 'Email automation (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Microsoft Outlook / 365',
        description: 'Email and calendar (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Slack',
        description: 'Team communication (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Microsoft Teams',
        description: 'Workplace collaboration (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Zoom',
        description: 'Video conferencing automation (Global)',
        status: 'coming-soon',
      },
      {
        name: 'WhatsApp Business',
        description: 'Messaging automation (Global)',
        status: 'coming-soon',
      },
    ],
  },
  {
    category: 'Productivity & Education',
    description: 'Boost productivity and support education workflows',
    tools: [
      {
        name: 'Google Workspace',
        description: 'Docs, Sheets, Calendar (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Microsoft 365',
        description: 'Office productivity suite (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Notion',
        description: 'Knowledge base and project management (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Airtable',
        description: 'Database and workflow automation (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Asana',
        description: 'Project management (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Trello',
        description: 'Task management (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Moodle / Canvas',
        description: 'Learning management systems (Global)',
        status: 'coming-soon',
      },
      {
        name: 'Google Classroom',
        description: 'Education platform automation',
        status: 'coming-soon',
      },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div className='container py-16'>
      <div className='mb-12 px-4 text-center'>
        <h1 className='mb-6 text-4xl font-bold md:text-5xl'>
          Global Integrations for Every Market
        </h1>
        <p className='mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl'>
          Connect business tools worldwide. Built in Canada, designed for global
          markets. Support for North America, Europe, Asia-Pacific, and beyond.
          No coding required — connect in minutes.
        </p>
        <div className='mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
          🇨🇦 Built in Canada • 🌍 Expanding Integration Library
        </div>
        <div className='mx-auto mt-6 max-w-3xl rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20 md:p-5'>
          <p className='text-sm leading-relaxed text-blue-900 dark:text-blue-100 md:text-base'>
            <strong>Current Status:</strong> Shopify and Wave Accounting are
            available now. More integrations are being added regularly. See
            below for availability status.
          </p>
        </div>
        <div className='mx-auto mt-8 max-w-3xl rounded-lg bg-primary/5 p-6 md:p-8'>
          <h2 className='mb-4 text-xl font-bold md:text-2xl'>
            🇨🇦 Canadian Integrations — Our Specialty
          </h2>
          <p className='mb-6 text-base leading-relaxed text-muted-foreground md:text-lg'>
            We specialize in Canadian business tools: Shopify, Wave Accounting,
            Stripe CAD, RBC, TD, Interac, and more. Built for Canadian
            businesses with Canadian data residency options.
          </p>
          <div className='flex flex-wrap justify-center gap-2'>
            <span className='rounded-full border border-green-300 bg-green-100 px-3 py-1 text-sm font-medium dark:border-green-700 dark:bg-green-900/30'>
              Shopify{' '}
              <Badge className='ml-1 bg-green-500 text-xs'>Available</Badge>
            </span>
            <span className='rounded-full border border-green-300 bg-green-100 px-3 py-1 text-sm font-medium dark:border-green-700 dark:bg-green-900/30'>
              Wave Accounting{' '}
              <Badge className='ml-1 bg-green-500 text-xs'>Available</Badge>
            </span>
            <span className='rounded-full bg-background px-3 py-1 text-sm font-medium'>
              Stripe CAD{' '}
              <Badge className='ml-1 text-xs' variant='secondary'>
                Soon
              </Badge>
            </span>
            <span className='rounded-full bg-background px-3 py-1 text-sm font-medium'>
              RBC{' '}
              <Badge className='ml-1 text-xs' variant='secondary'>
                Soon
              </Badge>
            </span>
            <span className='rounded-full bg-background px-3 py-1 text-sm font-medium'>
              TD Bank{' '}
              <Badge className='ml-1 text-xs' variant='secondary'>
                Soon
              </Badge>
            </span>
            <span className='rounded-full bg-background px-3 py-1 text-sm font-medium'>
              Interac{' '}
              <Badge className='ml-1 text-xs' variant='secondary'>
                Soon
              </Badge>
            </span>
          </div>
        </div>
      </div>

      {integrations.map(category => (
        <section key={category.category} className='mb-12 px-4'>
          <div className='mb-8'>
            <h2 className='mb-3 text-2xl font-bold md:text-3xl'>
              {category.category}
            </h2>
            <p className='text-base leading-relaxed text-muted-foreground md:text-lg'>
              {category.description}
            </p>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6'>
            {category.tools.map(tool => (
              <Card key={tool.name}>
                <CardHeader className='pb-4'>
                  <div className='mb-3 flex items-start justify-between'>
                    <CardTitle className='text-lg'>{tool.name}</CardTitle>
                    {tool.status === 'available' ? (
                      <Badge className='bg-green-500'>Available</Badge>
                    ) : (
                      <Badge variant='secondary'>Coming Soon</Badge>
                    )}
                  </div>
                  <CardDescription className='text-sm leading-relaxed'>
                    {tool.description}
                  </CardDescription>
                  {tool.status === 'available' && (
                    <div className='mt-4'>
                      <Button asChild size='sm' variant='outline'>
                        <Link
                          href={`/settings?integration=${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          Connect
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      ))}

      <div className='mt-12 space-y-6 px-4 text-center'>
        <h2 className='text-2xl font-bold md:text-3xl'>Don't See Your Tool?</h2>
        <p className='mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg'>
          We're constantly adding new integrations. Request one or build your
          own with our API.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button asChild className='h-11 text-base' variant='outline'>
            <Link href='/help'>Request Integration</Link>
          </Button>
          <Button asChild className='h-11 text-base' variant='outline'>
            <Link href='/api'>View API Docs</Link>
          </Button>
        </div>
      </div>

      <div className='mt-12 space-y-6 rounded-lg bg-muted/50 p-8 px-4 text-center md:p-10'>
        <h2 className='text-2xl font-bold md:text-3xl'>
          Ready to Connect Your Tools?
        </h2>
        <p className='mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg'>
          Start automating your workflows today. Connect your first integration
          in minutes.
        </p>
        <Button asChild className='h-12 text-base font-semibold' size='lg'>
          <Link href='/pricing'>Start Free Trial</Link>
        </Button>
      </div>
    </div>
  );
}
