import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Book a Demo — AIAS Platform | See It In Action",
  description: "Schedule a personalized demo of AIAS Platform. See how Canadian businesses automate workflows and save 10+ hours/week. CAD $49/month.",
};

export default function DemoPage() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            See AIAS Platform In Action
          </h1>
          <p className="text-lg text-muted-foreground">
            Schedule a personalized demo tailored to your business needs. 
            See how no-code AI agents can save you 10+ hours per week.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What You'll See</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>No-code AI agent builder — create agents in minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Canadian integrations (Shopify, Wave, Stripe, RBC, TD)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Pre-built templates for your industry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Real-time analytics and ROI tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>PIPEDA compliance and Canadian data residency</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Schedule Your Demo</CardTitle>
            <CardDescription>
              Choose a time that works for you. We'll send you a calendar invite.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="your@email.com"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Your Company"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">What would you like to see?</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="E.g., Shopify automation, invoice processing, lead qualification..."
                  rows={4}
                />
              </div>
              <Button asChild className="w-full" size="lg">
                <a href="https://calendly.com/aias-platform" rel="noopener noreferrer" target="_blank">
                  Book Demo on Calendly
                </a>
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Or email us at <a className="text-primary hover:underline" href="mailto:inquiries@aiautomatedsystems.ca">inquiries@aiautomatedsystems.ca</a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Prefer to Start Free?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                No credit card required. Start with our free plan and upgrade when you're ready.
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/pricing">Start Free Trial</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Have Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Check out our help center or contact support.
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/help">Visit Help Center</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
