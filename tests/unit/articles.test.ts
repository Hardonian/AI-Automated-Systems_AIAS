import { describe, expect, it } from 'vitest';

import { getLatestArticles, getFeaturedArticles, getArticleBySlug } from '../../lib/blog/articles';

describe('Blog Articles Getters', () => {
    describe('getLatestArticles', () => {
        it('returns an array up to the specified limit', () => {
            const result = getLatestArticles(1);
            expect(result).toHaveLength(1);
            expect(result[0]?.slug).toBe('systems-thinking-ai-scale');
        });

        it('sorts articles by publishedDate in descending order', () => {
            const result = getLatestArticles(10);
            expect(result.length).toBeGreaterThanOrEqual(2);
            // Verify order: newest first
            const timestamp0 = new Date(result[0]?.publishedDate || '').getTime();
            const timestamp1 = new Date(result[1]?.publishedDate || '').getTime();
            expect(timestamp0).toBeGreaterThanOrEqual(timestamp1);
        });

        it('returns an empty array when limit is 0', () => {
            const result = getLatestArticles(0);
            expect(result).toHaveLength(0);
        });
    });

    describe('getFeaturedArticles', () => {
        it('returns at most 2 featured articles', () => {
            const result = getFeaturedArticles();
            expect(result.length).toBeLessThanOrEqual(2);
        });
    });

    describe('getArticleBySlug', () => {
        it('returns the correct article for a valid slug', () => {
            const slug = 'systems-thinking-ai-scale';
            const result = getArticleBySlug(slug);
            expect(result).toBeDefined();
            expect(result?.slug).toBe(slug);
            expect(result?.title).toBe('Systems Thinking: The Key to Scaling AI Safely');
        });

        it('returns undefined for an invalid slug', () => {
            const result = getArticleBySlug('non-existent-slug');
            expect(result).toBeUndefined();
        });
    });
});
