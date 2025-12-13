/**
 * OpenAI Client Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

import { callOpenAI } from '@/lib/external-services/openai-client';

// Mock fetch
global.fetch = vi.fn();

describe('callOpenAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make successful API call', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Test response' } }],
      usage: { total_tokens: 100 },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await callOpenAI(
      {
        messages: [{ role: 'user', content: 'Test' }],
      },
      'test-api-key'
    );

    expect(result.choices[0]?.message.content).toBe('Test response');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    (global.fetch as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Success after retry' } }],
        }),
      });

    const result = await callOpenAI(
      {
        messages: [{ role: 'user', content: 'Test' }],
      },
      'test-api-key'
    );

    expect(result.choices[0]?.message.content).toBe('Success after retry');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should use fallback when circuit is open', async () => {
    // Mock multiple failures to open circuit
    (global.fetch as any).mockRejectedValue(new Error('Service unavailable'));

    // Trigger circuit opening (5 failures)
    for (let i = 0; i < 6; i++) {
      try {
        await callOpenAI(
          {
            messages: [{ role: 'user', content: 'Test' }],
          },
          'test-api-key'
        );
      } catch {
        // Expected
      }
    }

    // Next call should use fallback
    const result = await callOpenAI(
      {
        messages: [{ role: 'user', content: 'Test' }],
      },
      'test-api-key'
    );

    expect(result.choices[0]?.message.content).toContain('temporarily unavailable');
  });
});
