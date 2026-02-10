'use client';
import { useState } from 'react';

import { awardXp } from './GamificationProvider';
export default function QuestCard({
  title,
  xp = 10,
  done = false,
}: {
  title: string;
  xp?: number;
  done?: boolean;
}) {
  const [completed, setCompleted] = useState(done);
  return (
    <div className='flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4'>
      <div>
        <div className='font-semibold'>{title}</div>
        <div className='text-xs text-muted-foreground'>{xp} XP</div>
      </div>
      <button
        aria-pressed={completed}
        className={`h-10 rounded-xl px-4 text-sm font-medium ${completed ? 'bg-secondary' : 'text-primary-fg bg-primary'}`}
        onClick={() => {
          if (!completed) {
            awardXp(xp);
            setCompleted(true);
          }
        }}
      >
        {completed ? 'Done' : 'Complete'}
      </button>
    </div>
  );
}
