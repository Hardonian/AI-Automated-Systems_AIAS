import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/healthz/route';
import { NextRequest } from 'next/server';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
    auth: {
      admin: {
        listUsers: vi.fn(() => Promise.resolve({ data: { users: [] }, error: null })),
      },
    },
    storage: {
      listBuckets: vi.fn(() => Promise.resolve({ data: [], error: null })),
    },
  })),
}));

// Mock environment variables
vi.mock('@/lib/env', () => ({
  env: {
    supabase: {
      url: 'https://test.supabase.co',
      anonKey: 'test-anon-key',
      serviceRoleKey: 'test-service-key',
    },
    database: {
      url: 'postgresql://test',
    },
  },
}));

describe('Health Check Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 when healthy', async () => {
    const request = new NextRequest('http://localhost:3000/api/healthz');
    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('ok');
    expect(data).toHaveProperty('timestamp');
  });

  it('should include database check', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('db');
    expect(data.db).toHaveProperty('ok');
  });

  it('should include auth check', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('auth');
    expect(data.auth).toHaveProperty('ok');
  });

  it('should include performance metrics', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('total_latency_ms');
    expect(typeof data.total_latency_ms).toBe('number');
  });
});
