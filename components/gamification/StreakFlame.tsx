'use client';
export default function StreakFlame({ days }: { days: number }) {
  const tier =
    days >= 30 ? '🔥🔥🔥' : days >= 7 ? '🔥🔥' : days >= 1 ? '🔥' : '—';
  return (
    <span
      aria-label={`${days}-day streak`}
      className='text-xl'
      title={`${days}-day streak`}
    >
      {tier}
    </span>
  );
}
