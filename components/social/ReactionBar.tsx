'use client';
import { useState } from 'react';
const EMOJI = ['👍', '🔥', '💡', '🎉', '❤️'];
export default function ReactionBar() {
  const [counts, setCounts] = useState<number[]>(Array(EMOJI.length).fill(0));
  return (
    <div className='flex gap-2'>
      {EMOJI.map((e, i) => (
        <button
          key={i}
          aria-label={`React ${e}`}
          className='rounded-lg bg-muted px-2 py-1 hover:opacity-90'
          onClick={() =>
            setCounts(c => c.map((n, idx) => (idx === i ? n + 1 : n)))
          }
        >
          {e} <span className='text-xs text-muted-foreground'>{counts[i]}</span>
        </button>
      ))}
    </div>
  );
}
