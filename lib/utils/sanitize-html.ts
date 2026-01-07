import { describe, it, expect } from 'vitest';
import { sanitizeHTML } from '@/lib/utils/sanitize-html';

describe('sanitizeHTML', () => {
  it('should remove script tags', () => {
    // eslint-disable-next-line no-script-url
    const input = 'javascript:alert(1)';
    const sanitized = sanitizeHTML(input);
    expect(sanitized).not.toContain('javascript:');
  });
});
