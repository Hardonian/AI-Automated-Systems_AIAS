import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Book Strategy Call — AIAS Consultancy | Schedule Consultation",
  description: "Schedule a personalized strategy call with AIAS Consultancy. Discuss your custom AI platform or automation needs. No commitment required.",
};

export default function DemoPage() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Schedule Strategy Call
          </h1>
          <p className="text-lg text-muted-foreground">
            Book a 30-minute consultation with our automation architect. 
            We'll discuss your specific business challenges and map out a custom solution.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What We'll Discuss</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Your current operational bottlenecks and manual processes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Potential ROI from custom AI agents and automation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Technical feasibility of your project ideas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Roadmap and timeline estimates for a custom build</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>How our consultancy vs. platform models compare for your needs</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Select a Time</CardTitle>
            <CardDescription>
              Choose a time that works for you. No commitment required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              <Button asChild size="lg" className="w-full md:w-auto px-8 h-14 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <a href="https://calendly.com/aias-platform" rel="noopener noreferrer" target="_blank">
                  Open Calendar
                </a>
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Prefer email? <a className="text-primary hover:underline" href="mailto:inquiries@aiautomatedsystems.ca">inquiries@aiautomatedsystems.ca</a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Just exploring?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You can try our self-serve platform for free without a consultation.
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/pricing">View Platform Plans</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Have Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Check out our help center or read our case studies.
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/case-studies">Read Case Studies</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
