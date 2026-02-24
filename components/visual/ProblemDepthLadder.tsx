const levels = [
  { level: 'Surface', issue: 'Manual rework and duplicate data entry.' },
  { level: 'System', issue: 'Disconnected tools and brittle handoffs.' },
  { level: 'Control', issue: 'No deterministic checkpoints or quality gates.' },
  { level: 'Strategic', issue: 'Automation lacks governance and clear ownership.' },
];

export function ProblemDepthLadder() {
  return (
    <div className='rounded-xl border bg-card p-5'>
      <h3 className='text-sm font-semibold uppercase tracking-wide text-primary'>Problem depth ladder</h3>
      <div className='mt-4 space-y-3'>
        {levels.map((item, index) => (
          <div key={item.level} className='rounded-lg border bg-background/60 p-3'>
            <p className='text-xs font-semibold text-muted-foreground'>Level {index + 1}: {item.level}</p>
            <p className='text-sm'>{item.issue}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
