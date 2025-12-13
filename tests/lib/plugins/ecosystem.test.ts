/**
 * Tests for Plugin Ecosystem
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { PluginRegistry, PluginPublisher } from '@/lib/plugins/ecosystem';

describe('PluginRegistry', () => {
  let registry: PluginRegistry;

  beforeEach(() => {
    registry = new PluginRegistry();
  });

  describe('registerPlugin', () => {
    it('should register a plugin', () => {
      const manifest = {
        id: 'plugin-1',
        name: 'Test Plugin',
        version: '1.0.0',
        type: 'agent' as const,
        description: 'A test plugin',
        author: 'Test Author',
        license: 'MIT',
        entryPoint: './index.js',
        requiredPermissions: ['read_data'],
        sandbox: {
          enabled: true,
          allowedPermissions: ['read_data'],
          maxExecutionTime: 30000,
          maxMemoryMB: 256,
          networkAccess: false,
          fileSystemAccess: false,
        },
        published: false,
        verified: false,
        deprecated: false,
      };

      registry.registerPlugin(manifest as any);
      const plugin = registry.getPlugin('plugin-1');
      expect(plugin).toBeDefined();
      expect(plugin?.name).toBe('Test Plugin');
    });
  });

  describe('listPlugins', () => {
    it('should list plugins with filters', () => {
      const manifest1 = {
        id: 'plugin-1',
        name: 'Plugin 1',
        version: '1.0.0',
        type: 'agent' as const,
        description: 'Plugin 1',
        author: 'Author',
        license: 'MIT',
        entryPoint: './index.js',
        requiredPermissions: ['read_data'],
        sandbox: {
          enabled: true,
          allowedPermissions: ['read_data'],
          maxExecutionTime: 30000,
          maxMemoryMB: 256,
          networkAccess: false,
          fileSystemAccess: false,
        },
        published: true,
        verified: false,
        deprecated: false,
      } as const;

      const manifest2 = {
        id: 'plugin-2',
        name: 'Plugin 2',
        version: '1.0.0',
        type: 'workflow' as const,
        description: 'Plugin 2',
        author: 'Author',
        license: 'MIT',
        entryPoint: './index.js',
        requiredPermissions: ['read_data'],
        sandbox: {
          enabled: true,
          allowedPermissions: ['read_data'],
          maxExecutionTime: 30000,
          maxMemoryMB: 256,
          networkAccess: false,
          fileSystemAccess: false,
        },
        published: false,
        verified: false,
        deprecated: false,
      };

      registry.registerPlugin(manifest1 as any);
      registry.registerPlugin(manifest2 as any);

      const published = registry.listPlugins({ published: true });
      expect(published.length).toBe(1);

      const agents = registry.listPlugins({ type: 'agent' });
      expect(agents.length).toBe(1);
    });
  });
});

describe('PluginPublisher', () => {
  let publisher: PluginPublisher;

  beforeEach(() => {
    publisher = new PluginPublisher();
  });

  describe('verifyPlugin', () => {
    it('should verify a plugin', async () => {
      const verified = await publisher.verifyPlugin('plugin-1');
      expect(typeof verified).toBe('boolean');
    });
  });
});
