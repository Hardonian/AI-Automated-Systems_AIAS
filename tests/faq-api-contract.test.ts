import { describe, expect, it } from 'vitest';

import { extractApiAnswer } from '../components/content/faq-api';

describe('FAQ API response contract guard', () => {
  it('returns answer when payload matches schema', () => {
    expect(extractApiAnswer({ answer: 'Valid answer' })).toBe('Valid answer');
  });

  it('returns empty string for invalid payload shape', () => {
    expect(extractApiAnswer({ reply: 'wrong key' })).toBe('');
    expect(extractApiAnswer({ answer: '' })).toBe('');
    expect(extractApiAnswer('not-an-object')).toBe('');
  });
});
