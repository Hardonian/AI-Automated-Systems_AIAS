/**
 * Plugin / Extension Ecosystem
 * Foundation for AIAS agent/automation marketplace
 */

import { z } from 'zod';

/**
 * Plugin Type
 */
export const pluginTypeSchema = z.enum([
  'agent',
  'workflow',
  'integration',
  'transformation',
  'visualization',
]);

export type PluginType = z.infer<typeof pluginTypeSchema>;

/**
 * Plugin Permission
 */
export const pluginPermissionSchema = z.enum([
  'read_data',
  'write_data',
  'execute_workflows',
  'invoke_agents',
  'access_api',
  'access_database',
  'send_notifications',
  'modify_config',
]);

export type PluginPermission = z.infer<typeof pluginPermissionSchema>;

/**
 * Plugin Sandbox Configuration
 */
export const pluginSandboxSchema = z.object({
  enabled: z.boolean().default(true),
  allowedPermissions: z.array(pluginPermissionSchema),
  blockedDomains: z.array(z.string()).optional(),
  allowedDomains: z.array(z.string()).optional(),
  maxExecutionTime: z.number().int().min(1000).max(300000).default(30000),
  maxMemoryMB: z.number().int().min(10).max(1000).default(256),
  networkAccess: z.boolean().default(false),
  fileSystemAccess: z.boolean().default(false),
});

export type PluginSandbox = z.infer<typeof pluginSandboxSchema>;

/**
 * Plugin Dependency
 */
export const pluginDependencySchema = z.object({
  pluginId: z.string().uuid(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  required: z.boolean().default(true),
});

export type PluginDependency = z.infer<typeof pluginDependencySchema>;

/**
 * Plugin Manifest
 */
export const pluginManifestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(100),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  type: pluginTypeSchema,
  description: z.string().max(500),
  author: z.string(),
  license: z.string(),
  
  // Entry points
  entryPoint: z.string(), // Path to main module
  icon: z.string().url().optional(),
  screenshots: z.array(z.string().url()).optional(),
  
  // Configuration
  configSchema: z.record(z.unknown()).optional(), // JSON Schema
  defaultConfig: z.record(z.unknown()).optional(),
  
  // Dependencies
  dependencies: z.array(pluginDependencySchema).optional(),
  peerDependencies: z.array(z.string()).optional(),
  
  // Permissions & Sandbox
  requiredPermissions: z.array(pluginPermissionSchema),
  sandbox: pluginSandboxSchema,
  
  // Metadata
  tags: z.array(z.string().max(50)).max(20).optional(),
  category: z.string().optional(),
  homepage: z.string().url().optional(),
  repository: z.string().url().optional(),
  documentation: z.string().url().optional(),
  
  // Versioning
  minPlatformVersion: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  maxPlatformVersion: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  
  // Status
  published: z.boolean().default(false),
  verified: z.boolean().default(false),
  deprecated: z.boolean().default(false),
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;

/**
 * Plugin Runtime Context
 */
export const pluginRuntimeContextSchema = z.object({
  pluginId: z.string().uuid(),
  userId: z.string().uuid(),
  tenantId: z.string().uuid().optional(),
  config: z.record(z.unknown()),
  permissions: z.array(pluginPermissionSchema),
  sandbox: pluginSandboxSchema,
});

export type PluginRuntimeContext = z.infer<typeof pluginRuntimeContextSchema>;

/**
 * Plugin API Interface
 */
export interface PluginAPI {
  // Data access
  readData?(path: string): Promise<unknown>;
  writeData?(path: string, data: unknown): Promise<void>;
  
  // Workflow execution
  executeWorkflow?(workflowId: string, input: Record<string, unknown>): Promise<unknown>;
  
  // Agent invocation
  invokeAgent?(agentId: string, input: Record<string, unknown>): Promise<unknown>;
  
  // API calls
  apiRequest?(url: string, options?: RequestInit): Promise<Response>;
  
  // Notifications
  sendNotification?(channel: string, message: string): Promise<void>;
  
  // Configuration
  getConfig?(): Record<string, unknown>;
  setConfig?(config: Record<string, unknown>): void;
  
  // Logging
  log?(message: string, level?: 'info' | 'warn' | 'error'): void;
}

/**
 * Plugin Instance
 */
export interface PluginInstance {
  manifest: PluginManifest;
  context: PluginRuntimeContext;
  api: PluginAPI;
  execute(input: Record<string, unknown>): Promise<unknown>;
  destroy(): Promise<void>;
}

/**
 * Plugin Registry
 */
export class PluginRegistry {
  private plugins: Map<string, PluginManifest> = new Map();
  private instances: Map<string, PluginInstance> = new Map();

  /**
   * Register plugin
   */
  registerPlugin(manifest: PluginManifest): void {
    this.validateManifest(manifest);
    this.plugins.set(manifest.id, manifest);
  }

  /**
   * Get plugin manifest
   */
  getPlugin(pluginId: string): PluginManifest | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * List plugins
   */
  listPlugins(filters?: {
    type?: PluginType;
    published?: boolean;
    verified?: boolean;
  }): PluginManifest[] {
    let plugins = Array.from(this.plugins.values());

    if (filters?.type) {
      plugins = plugins.filter(p => p.type === filters.type);
    }

    if (filters?.published !== undefined) {
      plugins = plugins.filter(p => p.published === filters.published);
    }

    if (filters?.verified !== undefined) {
      plugins = plugins.filter(p => p.verified === filters.verified);
    }

    return plugins;
  }

  /**
   * Load plugin instance
   */
  async loadPlugin(
    pluginId: string,
    context: Omit<PluginRuntimeContext, 'pluginId'>
  ): Promise<PluginInstance> {
    const manifest = this.plugins.get(pluginId);
    if (!manifest) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    // Check dependencies
    await this.checkDependencies(manifest);

    // Create sandboxed API
    const api = this.createSandboxedAPI(manifest, context);

    // Load plugin module (would dynamically import)
    const pluginModule = await this.loadPluginModule(manifest);

    const instance: PluginInstance = {
      manifest,
      context: { ...context, pluginId },
      api,
      execute: async (input: Record<string, unknown>) => {
        return pluginModule.execute(input, api);
      },
      destroy: async () => {
        // Cleanup
      },
    };

    this.instances.set(pluginId, instance);
    return instance;
  }

  /**
   * Unload plugin
   */
  async unloadPlugin(pluginId: string): Promise<void> {
    const instance = this.instances.get(pluginId);
    if (instance) {
      await instance.destroy();
      this.instances.delete(pluginId);
    }
  }

  /**
   * Validate manifest
   */
  private validateManifest(manifest: PluginManifest): void {
    // Validate version format
    if (!manifest.version.match(/^\d+\.\d+\.\d+$/)) {
      throw new Error('Invalid version format');
    }

    // Validate dependencies exist
    if (manifest.dependencies) {
      manifest.dependencies.forEach(dep => {
        if (!this.plugins.has(dep.pluginId)) {
          throw new Error(`Dependency ${dep.pluginId} not found`);
        }
      });
    }
  }

  /**
   * Check dependencies
   */
  private async checkDependencies(manifest: PluginManifest): Promise<void> {
    if (!manifest.dependencies) return;

    for (const dep of manifest.dependencies) {
      const depManifest = this.plugins.get(dep.pluginId);
      if (!depManifest) {
        if (dep.required) {
          throw new Error(`Required dependency ${dep.pluginId} not found`);
        }
        continue;
      }

      // Check version compatibility (simplified)
      if (depManifest.version !== dep.version) {
        console.warn(`Version mismatch for dependency ${dep.pluginId}`);
      }
    }
  }

  /**
   * Create sandboxed API
   */
  private createSandboxedAPI(
    manifest: PluginManifest,
    context: Omit<PluginRuntimeContext, 'pluginId'>
  ): PluginAPI {
    const api: PluginAPI = {};

    // Only expose APIs for granted permissions
    if (context.permissions.includes('read_data')) {
      api.readData = async (path: string) => {
        // Sandboxed data access
        return {};
      };
    }

    if (context.permissions.includes('write_data')) {
      api.writeData = async (path: string, data: unknown) => {
        // Sandboxed data write
      };
    }

    if (context.permissions.includes('execute_workflows')) {
      api.executeWorkflow = async (workflowId: string, input: Record<string, unknown>) => {
        // Would call workflow executor
        return {};
      };
    }

    if (context.permissions.includes('access_api')) {
      api.apiRequest = async (url: string, options?: RequestInit) => {
        // Check sandbox restrictions
        if (manifest.sandbox.blockedDomains) {
          const urlObj = new URL(url);
          if (manifest.sandbox.blockedDomains.some(domain => urlObj.hostname.includes(domain))) {
            throw new Error(`Access to ${urlObj.hostname} is blocked`);
          }
        }

        return fetch(url, options);
      };
    }

    api.getConfig = () => context.config;
    api.setConfig = (config: Record<string, unknown>) => {
      context.config = { ...context.config, ...config };
    };

    api.log = (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
      console[level](`[Plugin ${manifest.id}]`, message);
    };

    return api;
  }

  /**
   * Load plugin module (would dynamically import)
   */
  private async loadPluginModule(manifest: PluginManifest): Promise<{
    execute: (input: Record<string, unknown>, api: PluginAPI) => Promise<unknown>;
  }> {
    // Would dynamically import plugin code
    // For now, return mock
    return {
      execute: async (input: Record<string, unknown>, api: PluginAPI) => {
        return { executed: true, input };
      },
    };
  }
}

/**
 * Plugin Publisher
 */
export class PluginPublisher {
  /**
   * Publish plugin
   */
  async publishPlugin(manifest: PluginManifest): Promise<void> {
    // Validate plugin
    // Upload to marketplace
    // Set published flag
  }

  /**
   * Verify plugin
   */
  async verifyPlugin(pluginId: string): Promise<boolean> {
    // Security scan
    // Code review
    // Test execution
    return true;
  }

  /**
   * Version plugin
   */
  async versionPlugin(
    pluginId: string,
    newVersion: string,
    changelog: string
  ): Promise<void> {
    // Create new version
    // Update manifest
    // Publish changelog
  }
}

// Export singleton instances
export const pluginRegistry = new PluginRegistry();
export const pluginPublisher = new PluginPublisher();
