import { describe, it, expect } from 'vitest';
import { sanitizeHTMLServer } from '../../lib/utils/sanitize-html';

describe('sanitizeHTMLServer', () => {
    it('sanitizes basic HTML', () => {
        const input = '<div onclick="alert(1)">Hello <b>world</b>!</div>';
        const result = sanitizeHTMLServer(input);
        expect(result).toBe('<div>Hello <b>world</b>!</div>');
    });

    it('strips script tags', () => {
        const input = '<script>alert("XSS")</script><p>Safe content</p>';
        const result = sanitizeHTMLServer(input);
        expect(result).toBe('<p>Safe content</p>');
    });

    it('handles null or empty inputs gracefully if we pass empty string', () => {
        const result = sanitizeHTMLServer('');
        expect(result).toBe('');
    });
});
