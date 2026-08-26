"use client";

import {
  Cpu,
  Workflow,
  Database,
  ShieldCheck,
  Bot,
  ChartLine,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { siteContent } from "@/src/content/site";

const iconMap: Record<string, typeof Cpu> = {
  Cpu,
  Workflow,
  Database,
  ShieldCheck,
  Bot,
  ChartLine,
};

export function DeliverablesSection() {
  return (
    <section className="bg-muted/30 px-4 py-20" id="services">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">What We Build</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Complete automation systems, not just integrations. Everything you
            need to operate independently.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {siteContent.services.map((service) => {
            const Icon = iconMap[service.icon] ?? Cpu;
            return (
              <Card
                key={service.title}
                className="transition-all hover:border-primary/50 hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <p className="mt-3 text-sm font-medium text-primary">
                    {service.outcome}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {service.deliverables.map((deliverable) => (
                      <li key={deliverable} className="flex items-start gap-2">
                        <span className="mt-1 text-primary">•</span>
                        <span>{deliverable}</span>
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
