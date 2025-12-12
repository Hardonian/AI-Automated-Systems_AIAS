import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { MobileStickyCTA } from "@/components/layout/mobile-sticky-cta";
import { FeatureComparison } from "@/components/pricing/feature-comparison";
import { PricingAnalytics } from "@/components/pricing/PricingAnalytics";
import { ROICalculator } from "@/components/pricing/roi-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing — AIAS Platform | Starting at $49/month | Multi-Currency Support",
  description: "Affordable AI automation for businesses worldwide. Free plan available. Starting at $49/month (CAD/USD/EUR). Multi-currency support. Cancel anytime.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    tagline: "Perfect for trying AIAS Platform",
    description: "Get started with AI automation at no cost. Perfect for testing workflows, learning the platform, and automating small tasks.",
    features: [
      "3 automation workflows",
      "100 automations per month",
      "Basic templates to get started",
      "Community support and resources",
      "No credit card required",
    ],
    cta: "Start Free",
    href: "/signup",
    popular: false,
    annualPrice: null,
    isBeta: false,
  },
  {
    name: "Starter",
    price: "$49",
    period: "month",
    tagline: "For solo operators and small businesses",
    description: "Everything you need to automate your business operations. Save 10+ hours per week with AI-powered workflows and Canadian-first integrations.",
    features: [
      "5 automation workflows",
      "10,000 automations per month",
      "10+ pre-built templates for common workflows",
      "5+ Canadian integrations available (Shopify, Wave, more coming soon)",
      "Personalized news feed based on your goals",
      "Email campaign analysis",
      "Optional setup call ($99 one-time)",
      "Email support",
      "Analytics dashboard",
      "Multi-currency support (CAD/USD/EUR)",
      "Cancel anytime",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    popular: true,
    annualPrice: "$490",
    annualSavings: "$98",
    annualDiscount: "20%",
    isBeta: true,
  },
  {
    name: "Pro",
    price: "$149",
    period: "month",
    tagline: "For small teams (2-10 employees)",
    description: "Advanced features for growing teams. Scale and automate with priority support and enhanced analytics.",
    features: [
      "20 automation workflows",
      "50,000 automations per month",
      "25+ workflow templates",
      "15+ integrations available (more coming soon)",
      "Personalized news feed & insights",
      "Full email campaign diagnostics",
      "Optional setup call ($99 one-time)",
      "Priority support (24h response)",
      "Analytics & reporting",
      "API access",
      "Team collaboration (coming soon)",
      "Advanced analytics (coming soon)",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    popular: false,
    annualPrice: "$1,490",
    annualSavings: "$298",
    annualDiscount: "20%",
    isBeta: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "project",
    tagline: "For custom AI platforms & consultancy",
    description: "Full-stack custom development, dedicated support, and enterprise-grade security. Built for your specific business needs.",
    features: [
      "Custom AI platform development",
      "Unlimited workflows & automations",
      "Dedicated account manager",
      "SLA & 99.9% uptime guarantee",
      "On-premise deployment options",
      "Custom security & compliance",
      "Priority 24/7 phone support",
      "Quarterly strategy reviews",
    ],
    cta: "Book Consultation",
    href: "/demo",
    popular: false,
    annualPrice: null,
    isBeta: false,
  },
];


export default function PricingPage() {
  return (
    <div className="container py-12 md:py-16 px-4">
      <MobileStickyCTA primaryHref="/signup" primaryLabel="Start Free Trial" secondaryHref="/demo" secondaryLabel="Book Demo" />
      <PricingAnalytics />
      <div className="text-center mb-12 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          Multi-currency support: CAD, USD, EUR, GBP, and more. Prices shown in your local currency. Cancel anytime.
        </p>
        <div className="mt-6 mb-8 p-4 md:p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg max-w-3xl mx-auto">
          <p className="text-sm md:text-base text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong>Note:</strong> Starter and Pro plans are in Beta. Some features are in active development. 
            See our <Link className="underline" href="/help">help center</Link> for current availability.
          </p>
        </div>
        <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 text-primary text-sm md:text-base font-semibold border border-primary/20">
          <span>🇨🇦 Built in Canada</span>
          <span>•</span>
          <span>🌍 Global Pricing</span>
          <span>•</span>
          <span>💳 Multi-Currency Support</span>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm md:text-base text-muted-foreground">
          <span className="flex items-center gap-2">
            <Check aria-hidden="true" className="h-4 w-4 text-green-500" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <Check aria-hidden="true" className="h-4 w-4 text-green-500" />
            30-day free trial
          </span>
          <span className="flex items-center gap-2">
            <Check aria-hidden="true" className="h-4 w-4 text-green-500" />
            Cancel anytime
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12 px-4">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative transition-all hover:shadow-xl ${
              plan.popular 
                ? "border-2 border-primary shadow-2xl scale-105 md:scale-110 bg-gradient-to-br from-primary/5 to-transparent" 
                : "border-2 hover:border-primary/50"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            {plan.isBeta && (
              <div className="absolute -top-4 right-4">
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Beta
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm font-medium text-primary mt-1">
                {plan.tagline}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
                <p className="text-xs text-muted-foreground mt-1">Multi-currency available</p>
              </div>
              {plan.annualPrice && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground line-through">
                    ${(parseInt(plan.price.replace('$', '')) * 12).toLocaleString()}/year
                  </span>
                  <span className="text-sm font-medium text-primary ml-2">
                    {plan.annualPrice}/year (save {plan.annualSavings}) • Save {plan.annualDiscount}
                  </span>
                </div>
              )}
              <CardDescription className="mt-3 text-sm leading-relaxed">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="w-full h-12 md:h-14 text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                size="lg"
                variant={plan.popular ? "default" : "outline"}
              >
                <Link aria-label={`${plan.cta} - ${plan.name} plan`} href={plan.href}>
                  {plan.cta}
                </Link>
              </Button>
              {plan.popular && (
                <p className="text-center text-xs md:text-sm text-muted-foreground mt-3">
                  ✨ Most popular choice
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-6 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What currencies and payment methods do you accept?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We accept all major credit cards (Visa, Mastercard, American Express) via Stripe. 
              Multi-currency support: CAD, USD, EUR, GBP, AUD, and more. Prices display in your local currency. 
              Taxes (GST/HST, VAT) are calculated automatically.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Can I cancel anytime?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Yes! Cancel anytime. You'll keep access until the end of your billing period.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Do you offer annual discounts?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Yes! Save 20% with annual billing. Starter: $490/year (save $98). Pro: $1,490/year (save $298).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Is there a free trial?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Yes! Start with our free plan (3 workflows, 100 automations/month) or get a 30-day free trial of any paid plan. 
              No credit card required.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What Canadian integrations do you support?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Shopify and Wave Accounting are available now. More integrations (RBC, TD, Interac, etc.) 
              coming soon. See our <Link className="text-primary hover:underline" href="/integrations">integrations page</Link> for the full list.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What does "Beta" mean?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Beta means we're actively building and improving features. Some features are in development, and we're 
              adding new capabilities based on user feedback. You'll have access to all current features, 
              and we'll notify you as new features launch.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What's the difference between workflows and agents?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Workflows are AI-powered automation sequences that connect your tools and automate repetitive tasks. 
              Each workflow handles multiple steps and conditions. Think of them as automation assistants that 
              work 24/7 to save you time.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Can I get help setting up?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Yes! We offer optional setup calls ($99 one-time) to help you get started quickly. Our team will help 
              you connect integrations, set up workflows, and answer questions. 
              <Link className="text-primary hover:underline ml-1" href="/demo">Book a setup call</Link>.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What happens if I exceed automation limits?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              If you approach your monthly automation limit, we'll notify you. You can upgrade to a higher plan or 
              purchase additional credits. We'll never cut off your automations mid-month—you'll have options 
              to continue seamlessly.
            </p>
          </CardContent>
        </Card>
      </div>

      <FeatureComparison />

      <ROICalculator />

      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Need a custom plan for your team?
        </p>
        <Button asChild variant="outline">
          <Link href="/demo">Contact Sales</Link>
        </Button>
      </div>
    </div>
  );
}
