"use client";

import { useId, useState } from "react";

import { SurfaceCard } from "@/components/ui/section-primitives";

interface Metric {
  label: string;
  value: string;
  delta: string;
  note: string;
}

interface MetricGroup {
  category: string;
  period: string;
  metrics: Metric[];
}

interface Comparison {
  workflow: string;
  before: string;
  after: string;
  impact: string;
}

function ComparisonSlider({ comparison }: { comparison: Comparison }) {
  const [position, setPosition] = useState(50);
  const id = useId();
  return (
    <SurfaceCard className="border-2 border-primary p-0 overflow-hidden">
      <div className="relative min-h-48 overflow-hidden bg-primary/10">
        <div className="absolute inset-0 p-6 text-right">
          <span className="font-mono text-xs font-black uppercase text-primary">
            After
          </span>
          <p className="mt-3 ml-auto max-w-xs text-sm">{comparison.after}</p>
        </div>
        <div
          className="absolute inset-0 bg-surface-muted p-6"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <span className="font-mono text-xs font-black uppercase text-destructive">
            Before
          </span>
          <p className="mt-3 max-w-xs text-sm">{comparison.before}</p>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-1 bg-primary shadow-lg"
          style={{ left: `calc(${position}% - 2px)` }}
        />
      </div>
      <div className="border-t-2 border-border bg-background p-4">
        <label className="font-mono text-xs font-bold uppercase" htmlFor={id}>
          Before / after split: {position}%
        </label>
        <input
          className="mt-2 w-full accent-primary"
          id={id}
          min="10"
          max="90"
          onChange={(event) => setPosition(Number(event.target.value))}
          type="range"
          value={position}
        />
        <p className="mt-2 text-xs font-semibold text-primary">
          {comparison.impact}
        </p>
      </div>
    </SurfaceCard>
  );
}

export function MetricsDashboard({
  groups,
  comparisons,
}: {
  groups: MetricGroup[];
  comparisons: Comparison[];
}) {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((group) => (
          <SurfaceCard key={group.category}>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {group.period}
            </p>
            <h2 className="mt-2 text-xl font-bold">{group.category}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {group.metrics.map((metric) => (
                <article
                  className="border-2 border-border bg-background/60 p-4"
                  key={metric.label}
                >
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <p className="text-2xl font-semibold">{metric.value}</p>
                    <p className="font-mono text-sm font-black text-primary">
                      {metric.delta}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {metric.note}
                  </p>
                </article>
              ))}
            </div>
          </SurfaceCard>
        ))}
      </div>
      <div>
        <h2 className="text-2xl font-bold">Before vs after efficiency</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Drag the split to compare the operating states.
        </p>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          {comparisons.map((comparison) => (
            <ComparisonSlider
              comparison={comparison}
              key={comparison.workflow}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
