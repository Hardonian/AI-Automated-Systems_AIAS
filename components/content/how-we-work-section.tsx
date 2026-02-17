interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export function HowWeWorkSection({ steps }: { steps: ProcessStep[] }) {
  return (
    <section aria-labelledby='how-we-work-heading' className='container py-16' id='how-we-work'>
      <div className='mx-auto max-w-3xl text-center'>
        <h2 className='text-3xl font-bold' id='how-we-work-heading'>
          How we work
        </h2>
        <p className='mt-4 text-muted-foreground'>
          Structured delivery with shared ownership from discovery to handoff.
        </p>
      </div>
      <ol className='mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        {steps.map(step => (
          <li key={step.step} className='rounded-xl border bg-card p-5'>
            <p className='text-sm font-semibold text-primary'>Step {step.step}</p>
            <h3 className='mt-2 text-lg font-semibold'>{step.title}</h3>
            <p className='mt-2 text-sm text-muted-foreground'>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
