interface FrameworkStep {
  id: string;
  title: string;
  detail: string;
}

const frameworkSteps: FrameworkStep[] = [
  {
    id: "1",
    title: "Decision Surface Mapping",
    detail:
      "Map which decisions are automated, which are assisted, and which must stay human-owned.",
  },
  {
    id: "2",
    title: "Constraint Identification",
    detail:
      "Document operational, legal, quality, and data constraints before selecting implementation patterns.",
  },
  {
    id: "3",
    title: "Failure Mode Matrix",
    detail:
      "Model probable failure paths and define escalation, fallback, and audit requirements for each.",
  },
  {
    id: "4",
    title: "Tradeoff Modeling",
    detail:
      "Score reliability, latency, and cost tradeoffs against business-critical outcomes.",
  },
  {
    id: "5",
    title: "Architecture Alignment",
    detail:
      "Finalize the delivery blueprint, ownership model, and phased rollout sequence.",
  },
];

export function DiagnosticFrameworkDiagram() {
  return (
    <div className="rounded-2xl border bg-background/80 p-5">
      <ol className="grid gap-4 md:grid-cols-5">
        {frameworkSteps.map((step, index) => (
          <li key={step.id} className="relative">
            <article className="h-full rounded-xl border bg-card p-4 shadow-sm transition-transform hover:-translate-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Step {step.id}
              </p>
              <h3 className="mt-1 text-sm font-semibold leading-snug">
                {step.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                {step.detail}
              </p>
            </article>
            {index < frameworkSteps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -right-2 top-1/2 hidden h-px w-4 bg-border md:block"
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
