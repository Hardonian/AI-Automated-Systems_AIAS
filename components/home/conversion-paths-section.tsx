import Link from "next/link";

type ConversionPath = {
  title: string;
  icp: string;
  constraints: string;
  value: string;
  cta: string;
};

const conversionPaths: ConversionPath[] = [
  {
    title: "Enterprise AI Architecture",
    icp: "For enterprise and public-sector teams with strict governance controls.",
    constraints:
      "Requires deterministic controls, review gates, and deployment accountability.",
    value: "Reduces execution risk while scaling automation across functions.",
    cta: "/contact",
  },
  {
    title: "OSS Builders / Technical Founders",
    icp: "For technical operators shipping lean systems without backend overhead.",
    constraints:
      "Static-first, type-safe, and performance-budget constrained delivery.",
    value:
      "Converts architecture quality into faster iteration and stronger trust.",
    cta: "/services/automation-web",
  },
  {
    title: "Strategic Partnerships",
    icp: "For ecosystem partners extending Reach, Zeo, and Settler capabilities.",
    constraints:
      "Needs clear interface contracts, governance interoperability, and shared SLAs.",
    value:
      "Accelerates system rollout with aligned advisory + implementation layers.",
    cta: "/ecosystem",
  },
];

export function ConversionPathsSection() {
  return (
    <section className="border-y bg-muted/20 py-16">
      <div className="container">
        <h2 className="text-3xl font-bold">Choose your architecture path</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {conversionPaths.map((path) => (
            <div
              className="rounded-xl border bg-background p-6"
              key={path.title}
            >
              <h3 className="text-xl font-semibold">{path.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                <strong>ICP:</strong> {path.icp}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <strong>Constraints:</strong> {path.constraints}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <strong>Value:</strong> {path.value}
              </p>
              <Link
                className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4"
                href={path.cta}
              >
                Next step
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
