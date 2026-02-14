import type { Metadata } from 'next';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

import { FeatureIllustration } from '@/components/visual/FeatureIllustration';
import { getPrimaryCtaHref, getContactEmailHref } from '@/src/content/site';

export const metadata: Metadata = {
  title: 'Pricing | AI Automated Systems',
  description:
    'Transparent pricing for agentic automation consulting. From discovery sprints to full implementation.',
};

const plans = [
  {
    name: 'Discovery Sprint',
    description: 'Map your automation opportunities',
    price: '$2,500',
    duration: 'one-time',
    features: [
      '2-week workflow audit',
      'Automation opportunity map',
      'ROI prioritization matrix',
      'Technical feasibility assessment',
      'Written recommendations report',
    ],
    cta: 'Book Discovery',
    href: getPrimaryCtaHref(),
    popular: false,
  },
  {
    name: 'Pilot Implementation',
    description: 'Build and deploy your first workflow',
    price: '$8,500',
    duration: 'starting',
    features: [
      'Everything in Discovery',
      'Single workflow automation',
      'Integration with 2-3 systems',
      'Testing and validation',
      'Team training session',
      '30-day support',
    ],
    cta: 'Start Pilot',
    href: getPrimaryCtaHref(),
    popular: true,
  },
  {
    name: 'Enterprise Program',
    description: 'Multi-workflow automation platform',
    price: 'Custom',
    duration: 'engagement',
    features: [
      'Everything in Pilot',
      'Multi-workflow orchestration',
      'Custom agent development',
      'Enterprise integrations',
      'Ongoing optimization',
      'Dedicated support',
      'Quarterly reviews',
    ],
    cta: 'Contact Us',
    href: getContactEmailHref(),
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Pricing
            </p>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              Transparent pricing, real ROI
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Invest in automation that pays for itself. Our engagements are structured 
              to deliver measurable results within weeks, not months.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? 'border-primary bg-card shadow-lg'
                  : 'bg-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground"> / {plan.duration}</span>
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border bg-background hover:bg-muted'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold">Why our pricing works</h2>
              <p className="mt-4 text-muted-foreground">
                We structure our engagements to deliver value quickly. Most clients 
                see ROI within the first month of deployment through time savings 
                and error reduction.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { label: 'Time saved per employee', value: '10+ hours/week' },
                  { label: 'Average payback period', value: '4-6 weeks' },
                  { label: 'Client satisfaction', value: '100%' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between rounded-xl border bg-card p-4">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-semibold text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-8">
              <FeatureIllustration type="automation" className="h-48" />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-muted p-4 text-center">
                  <div className="text-2xl font-bold text-primary">80%</div>
                  <div className="text-sm text-muted-foreground">Manual work reduced</div>
                </div>
                <div className="rounded-xl bg-muted p-4 text-center">
                  <div className="text-2xl font-bold text-primary">5x</div>
                  <div className="text-sm text-muted-foreground">Process speedup</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold">Common questions</h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: 'Can I start with just the Discovery Sprint?',
                a: 'Absolutely. Many clients begin with Discovery to understand their automation landscape before committing to implementation.',
              },
              {
                q: 'What if I need something custom?',
                a: 'Our Enterprise Program is tailored to your specific needs. Contact us to discuss your requirements.',
              },
              {
                q: 'Are there ongoing costs?',
                a: 'Implementation fees are one-time. You may have infrastructure costs (hosting, API usage) depending on your setup.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
