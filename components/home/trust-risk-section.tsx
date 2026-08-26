import Link from "next/link";

export function TrustRiskSection() {
  return (
    <section className="py-16">
      <div className="container grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h2 className="text-2xl font-bold">Trust and risk transparency</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Security posture documented before implementation begins.</li>
            <li>
              • Data handling is explicit; no hidden data movement assumptions.
            </li>
            <li>
              • Deterministic guarantees are scoped per workflow and
              environment.
            </li>
            <li>
              • We state non-fit scenarios when risk exceeds acceptable bounds.
            </li>
          </ul>
        </div>
        <div className="rounded-xl border p-6">
          <h2 className="text-2xl font-bold">
            Explore live architecture assets
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                className="font-semibold text-primary underline underline-offset-4"
                href="/automation-demo"
              >
                Automation demo
              </Link>{" "}
              — safe mock execution flow.
            </li>
            <li>
              <Link
                className="font-semibold text-primary underline underline-offset-4"
                href="/ecosystem"
              >
                Ecosystem architecture
              </Link>{" "}
              — advisory to deployment layers.
            </li>
            <li>
              <Link
                className="font-semibold text-primary underline underline-offset-4"
                href="/readiness-checklist"
              >
                Readiness checklist
              </Link>{" "}
              — downloadable lead magnet.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
