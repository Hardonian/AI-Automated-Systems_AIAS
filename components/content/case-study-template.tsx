interface CaseStudyTemplateProps {
  title: string;
  clientLabel: string;
  challenge: string;
  solution: string;
  results: string[];
  anonymized?: boolean;
}

export function CaseStudyTemplate({
  title,
  clientLabel,
  challenge,
  solution,
  results,
  anonymized = false,
}: CaseStudyTemplateProps) {
  return (
    <article className="rounded-xl border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        {anonymized ? "Anonymized case study" : "Case study"}
      </p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Client: {clientLabel}
      </p>
      <h3 className="mt-5 font-semibold">Challenge</h3>
      <p className="mt-2 text-muted-foreground">{challenge}</p>
      <h3 className="mt-5 font-semibold">Solution</h3>
      <p className="mt-2 text-muted-foreground">{solution}</p>
      <h3 className="mt-5 font-semibold">Observed outcomes</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {results.map((result) => (
          <li key={result}>{result}</li>
        ))}
      </ul>
    </article>
  );
}
