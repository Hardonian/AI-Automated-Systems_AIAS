import { Sparkles, Zap, ShoppingCart, Mail, Calendar } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Workflow Templates — AIAS Platform | Pre-Built Automation Templates",
  description: "Browse pre-built workflow templates for AIAS Platform. E-commerce, email marketing, scheduling, and more. Start automating in minutes.",
};

const templates = [
  {
    name: "E-commerce Order Processing",
    description: "Automate order fulfillment, inventory updates, and customer notifications",
    icon: ShoppingCart,
    category: "E-commerce",
    link: "/onboarding/select-template",
  },
  {
    name: "Email Marketing Automation",
    description: "Send personalized emails, track engagement, and manage subscriber lists",
    icon: Mail,
    category: "Marketing",
    link: "/onboarding/select-template",
  },
  {
    name: "Calendar & Scheduling",
    description: "Automate appointment booking, reminders, and calendar sync",
    icon: Calendar,
    category: "Productivity",
    link: "/onboarding/select-template",
  },
  {
    name: "Data Processing Pipeline",
    description: "Transform, validate, and route data between systems",
    icon: Zap,
    category: "Data",
    link: "/onboarding/select-template",
  },
];

export default function TemplatesPage() {
  return (
    <div className="container py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Workflow Templates
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started quickly with pre-built automation templates. Customize them to fit your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <Card key={template.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full inline-block">
                    {template.category}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {template.description}
                  </CardDescription>
                  <Button asChild className="w-full">
                    <Link href={template.link}>Use Template</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Need a Custom Template?</CardTitle>
            <CardDescription>
              We can build custom workflows tailored to your specific business needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/demo">Schedule Consultation</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <Link className="text-primary hover:underline" href="/onboarding/select-template">
            View All Templates →
          </Link>
        </div>
      </div>
    </div>
  );
}
