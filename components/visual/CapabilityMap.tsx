import Link from "next/link";

const capabilities = [
  {
    title: "Discovery & diagnostics",
    description:
      "Workflow mapping, risk scoring, and baseline KPI capture before implementation.",
    href: "/approach",
  },
  {
    title: "Deterministic automation",
    description:
      "Rule-based orchestration with predictable routing, guardrails, and retry policy.",
    href: "/services/automation-web",
  },
  {
    title: "AI augmentation layer",
    description:
      "Scoped agentic assistance for classification, drafting, and triage acceleration.",
    href: "/services/app-ai-systems",
  },
  {
    title: "Governance & handoff",
    description:
      "Audit logs, runbooks, QA controls, and measured rollout to production teams.",
    href: "/how-it-works",
  },
];

export function CapabilityMap() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {capabilities.map((capability) => (
        <Link
          key={capability.title}
          href={capability.href}
          className="group rounded-xl border bg-card p-5 transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <h3 className="text-base font-semibold">{capability.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {capability.description}
          </p>
          <p className="mt-3 text-xs font-semibold text-primary">Explore →</p>
        </Link>
      ))}
    </div>
  );
}
