interface OutcomeExample {
  title: string;
  description: string;
}

export function OutcomesPatternSection({
  examples,
}: {
  examples: OutcomeExample[];
}) {
  return (
    <section
      aria-labelledby="outcomes-pattern-heading"
      className="border-y bg-muted/30 py-16"
      id="outcomes-pattern"
    >
      <div className="container">
        <h2 className="text-3xl font-bold" id="outcomes-pattern-heading">
          Outcomes pattern
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Example outcomes from delivery patterns. Results vary by system
          maturity and implementation scope.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {examples.map((example) => (
            <article
              key={example.title}
              className="rounded-xl border bg-card p-5"
            >
              <h3 className="font-semibold">{example.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {example.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
