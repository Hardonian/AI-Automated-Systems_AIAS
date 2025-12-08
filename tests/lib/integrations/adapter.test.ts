/**
 * Tests for Integration Adapter Framework
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AdapterFactory, BaseAdapter } from '@/lib/integrations/adapter-framework';
import { adapterConfigSchema } from '@/lib/integrations/adapter-framework';

describe('AdapterFactory', () => {
  let factory: AdapterFactory;

  beforeEach(() => {
    factory = new AdapterFactory();
  });

  describe('createAdapter', () => {
    it('should create an adapter from config', () => {
      const config = {
        id: 'test-adapter-1',
        name: 'Test Adapter',
        baseUrl: 'https://api.example.com',
        auth: {
          type: 'apiKey' as const,
          key: 'test-key',
          location: 'header' as const,
          headerName: 'X-API-Key',
        },
        timeout: 30000,
      };

      const adapter = factory.createAdapter(config);
      expect(adapter).toBeDefined();
      expect(adapter.id).toBe('test-adapter-1');
    });
  });

  describe('registerAdapter', () => {
    it('should register an adapter', () => {
      const config = {
        id: 'test-adapter-2',
        name: 'Test Adapter',
        baseUrl: 'https://api.example.com',
        auth: {
          type: 'bearer' as const,
          token: 'test-token',
        },
        timeout: 30000,
      };

      const adapter = factory.createAdapter(config);
      factory.registerAdapter(adapter);

      const retrieved = factory.getAdapter('test-adapter-2');
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('test-adapter-2');
    });
  });

  describe('listAdapters', () => {
    it('should list all registered adapters', () => {
      const config1 = {
        id: 'adapter-1',
        name: 'Adapter 1',
        baseUrl: 'https://api1.example.com',
        auth: { type: 'apiKey' as const, key: 'key1', location: 'header' as const, headerName: 'X-API-Key' },
        timeout: 30000,
      };

      const config2 = {
        id: 'adapter-2',
        name: 'Adapter 2',
        baseUrl: 'https://api2.example.com',
        auth: { type: 'apiKey' as const, key: 'key2', location: 'header' as const, headerName: 'X-API-Key' },
        timeout: 30000,
      };

      factory.registerAdapter(factory.createAdapter(config1));
      factory.registerAdapter(factory.createAdapter(config2));

      const adapters = factory.listAdapters();
      expect(adapters.length).toBe(2);
    });
  });
});

describe('BaseAdapter', () => {
  it('should handle authentication', async () => {
    const config = {
      id: 'test-adapter-auth',
      name: 'Test Adapter',
      baseUrl: 'https://api.example.com',
      auth: {
        type: 'bearer' as const,
        token: 'test-token',
      },
      timeout: 30000,
    };

    class TestAdapter extends BaseAdapter {}
    const adapter = new TestAdapter(config);

    await adapter.authenticate();
    const connected = await adapter.testConnection();
    expect(connected).toBe(true);
  });
});
