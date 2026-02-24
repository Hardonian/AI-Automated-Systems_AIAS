const phases = [
  { name: '1. Diagnose', detail: 'Capture current state, bottlenecks, and failure modes.' },
  { name: '2. Design', detail: 'Define boundaries between deterministic logic and AI assistance.' },
  { name: '3. Deploy', detail: 'Ship a scoped pilot with QA gates and observability.' },
  { name: '4. De-risk', detail: 'Run monitored rollout with incident and exception playbooks.' },
];

export function DiagnosticTimeline() {
  return (
    <ol className='relative ml-2 space-y-5 border-l border-primary/30 pl-6'>
      {phases.map(phase => (
        <li key={phase.name} className='relative'>
          <span className='absolute -left-[1.82rem] top-1 h-3 w-3 rounded-full bg-primary' />
          <h3 className='text-sm font-semibold tracking-wide text-foreground'>{phase.name}</h3>
          <p className='mt-1 text-sm text-muted-foreground'>{phase.detail}</p>
        </li>
      ))}
    </ol>
  );
}
