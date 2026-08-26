"use client";

import {
  ShieldCheck,
  Sparkles,
  Radar,
  LineChart,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { siteContent } from "@/src/content/site";

const iconMap: LucideIcon[] = [Sparkles, ShieldCheck, Radar, LineChart];

export function SecretSauceSection() {
  const { secretSauce, optimizationHotspots } = siteContent;

  return (
    <section className="bg-background px-4 py-20" id="secret-sauce">
      <div className="container mx-auto max-w-6xl space-y-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Secret Sauce
          </p>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {secretSauce.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {secretSauce.description}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {secretSauce.pillars.map((pillar, index) => {
            const Icon = iconMap[index % iconMap.length] ?? Sparkles;
            return (
              <Card key={pillar.title} className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{pillar.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {pillar.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <span className="mt-1 text-primary">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div
          className="rounded-3xl border border-border bg-muted/30 p-8 md:p-12"
          id="optimization-hotspots"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Optimization Focus
            </p>
            <h3 className="mb-4 text-2xl font-bold md:text-3xl">
              {optimizationHotspots.title}
            </h3>
            <p className="text-muted-foreground">
              {optimizationHotspots.description}
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {optimizationHotspots.areas.map((area) => (
              <Card key={area.title} className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div>
                    <h4 className="text-lg font-semibold">{area.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {area.impact}
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {area.improvements.map((improvement) => (
                      <li key={improvement} className="flex items-start gap-2">
                        <span className="mt-1 text-primary">✓</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
