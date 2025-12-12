"use client";

import { Building2, Rocket, Users, Globe } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const segments = [
  {
    icon: Building2,
    title: "Enterprise Leaders",
    description: "Scale operations without headcount. Custom automation architectures that integrate with your ERP, CRM, and legacy systems.",
    benefits: ["Risk-free scalability", "Operational efficiency", "Data security & compliance"],
  },
  {
    icon: Rocket,
    title: "High-Growth Founders",
    description: "Accelerate product velocity. We build the custom AI features and platforms that would take your in-house team months.",
    benefits: ["Faster time-to-market", "Lower burn rate", "Technical competitive advantage"],
  },
  {
    icon: Users,
    title: "Agency Owners",
    description: "Productize your services. We turn manual client deliverables into automated, white-labeled AI platforms.",
    benefits: ["New revenue streams", "Higher margins", "Sticky client relationships"],
  },
  {
    icon: Globe,
    title: "E-Commerce Operators",
    description: "Automate the boring stuff. Multi-channel inventory, customer support, and order processing on autopilot.",
    benefits: ["24/7 operations", "Reduced errors", "Global expansion ready"],
  },
];

export function WhoWeHelp() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Work With</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We partner with visionary leaders who want to leverage AI for structural competitive advantage, not just incremental gains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {segments.map((segment) => {
            const Icon = segment.icon;
            return (
              <Card key={segment.title} className="bg-background border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{segment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {segment.description}
                  </p>
                  <ul className="space-y-2">
                    {segment.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
