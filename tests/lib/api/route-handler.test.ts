import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { createGETHandler, createPOSTHandler } from '@/lib/api/route-handler';
import { z } from 'zod';

describe('Route Handler Utilities', () => {
  describe('createGETHandler', () => {
    it('should handle successful GET request', async () => {
      const handler = createGETHandler(async (context) => {
        return NextResponse.json({ data: 'test' });
      });

      const request = new NextRequest('http://localhost:3000/api/test');
      const response = await handler(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ data: 'test' });
    });

    it('should handle errors gracefully', async () => {
      const handler = createGETHandler(async () => {
        throw new Error('Test error');
      });

      const request = new NextRequest('http://localhost:3000/api/test');
      const response = await handler(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('should respect cache configuration', async () => {
      const handler = createGETHandler(
        async () => NextResponse.json({ data: 'test' }),
        { cache: { enabled: true, ttl: 300 } }
      );

      const request = new NextRequest('http://localhost:3000/api/test');
      const response = await handler(request);

      expect(response.headers.get('cache-control')).toBeTruthy();
    });
  });

  describe('createPOSTHandler', () => {
    it('should handle successful POST request', async () => {
      const schema = z.object({
        name: z.string(),
        email: z.string().email(),
      });

      const handler = createPOSTHandler(
        async (context) => {
          const body = await context.request.json();
          return NextResponse.json({ success: true, data: body });
        },
        { validateBody: schema }
      );

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test', email: 'test@example.com' }),
      });

      const response = await handler(request);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it('should validate request body', async () => {
      const schema = z.object({
        email: z.string().email(),
      });

      const handler = createPOSTHandler(
        async () => NextResponse.json({ success: true }),
        { validateBody: schema }
      );

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        body: JSON.stringify({ email: 'invalid-email' }),
      });

      const response = await handler(request);
      expect(response.status).toBe(400);
    });

    it('should enforce max body size', async () => {
      const handler = createPOSTHandler(
        async () => NextResponse.json({ success: true }),
        { maxBodySize: 100 }
      );

      const largeBody = 'x'.repeat(200);
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        body: largeBody,
      });

      const response = await handler(request);
      expect(response.status).toBe(400);
    });
  });
});
