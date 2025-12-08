/**
 * Integration Adapter Framework
 * Unified API client factory for third-party integrations
 */

import { z } from 'zod';

/**
 * Authentication Methods
 */
export const authMethodSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('apiKey'),
    key: z.string(),
    location: z.enum(['header', 'query']).default('header'),
    headerName: z.string().default('X-API-Key'),
  }),
  z.object({
    type: z.literal('bearer'),
    token: z.string(),
  }),
  z.object({
    type: z.literal('basic'),
    username: z.string(),
    password: z.string(),
  }),
  z.object({
    type: z.literal('oauth'),
    clientId: z.string(),
    clientSecret: z.string(),
    tokenUrl: z.string().url(),
    scopes: z.array(z.string()).optional(),
  }),
  z.object({
    type: z.literal('hmac'),
    secret: z.string(),
    algorithm: z.enum(['sha256', 'sha512']).default('sha256'),
  }),
]);

export type AuthMethod = z.infer<typeof authMethodSchema>;

/**
 * Pagination Configuration
 */
export const paginationConfigSchema = z.object({
  type: z.enum(['offset', 'cursor', 'page']).default('offset'),
  pageSizeParam: z.string().default('limit'),
  pageParam: z.string().default('offset'),
  cursorParam: z.string().default('cursor'),
  maxPageSize: z.number().int().min(1).max(1000).default(100),
});

export type PaginationConfig = z.infer<typeof paginationConfigSchema>;

/**
 * Retry Configuration
 */
export const retryConfigSchema = z.object({
  enabled: z.boolean().default(true),
  maxAttempts: z.number().int().min(1).max(10).default(3),
  backoff: z.enum(['linear', 'exponential', 'fixed']).default('exponential'),
  initialDelay: z.number().int().min(100).default(1000),
  maxDelay: z.number().int().min(1000).default(60000),
  retryableStatusCodes: z.array(z.number().int()).default([500, 502, 503, 504]),
});

export type RetryConfig = z.infer<typeof retryConfigSchema>;

/**
 * Rate Limit Configuration
 */
export const rateLimitConfigSchema = z.object({
  requests: z.number().int().min(1),
  windowMs: z.number().int().min(1000),
  strategy: z.enum(['fail', 'queue', 'throttle']).default('throttle'),
});

export type RateLimitConfig = z.infer<typeof rateLimitConfigSchema>;

/**
 * Error Shape Configuration
 */
export const errorShapeSchema = z.object({
  errorField: z.string().default('error'),
  messageField: z.string().default('message'),
  codeField: z.string().default('code'),
  detailsField: z.string().default('details'),
});

export type ErrorShape = z.infer<typeof errorShapeSchema>;

/**
 * Integration Adapter Configuration
 */
export const adapterConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  baseUrl: z.string().url(),
  auth: authMethodSchema,
  pagination: paginationConfigSchema.optional(),
  retry: retryConfigSchema.optional(),
  rateLimit: rateLimitConfigSchema.optional(),
  errorShape: errorShapeSchema.optional(),
  defaultHeaders: z.record(z.string()).optional(),
  timeout: z.number().int().min(1000).max(300000).default(30000),
});

export type AdapterConfig = z.infer<typeof adapterConfigSchema>;

/**
 * API Request Options
 */
export interface APIRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  params?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
  paginate?: boolean;
  retry?: boolean;
}

/**
 * API Response
 */
export interface APIResponse<T = unknown> {
  data: T;
  pagination?: {
    hasMore: boolean;
    nextCursor?: string;
    nextPage?: number;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Integration Adapter Interface
 */
export interface IntegrationAdapter {
  id: string;
  name: string;
  config: AdapterConfig;
  
  request<T = unknown>(options: APIRequestOptions): Promise<APIResponse<T>>;
  authenticate(): Promise<void>;
  testConnection(): Promise<boolean>;
}

/**
 * Base Integration Adapter Class
 */
export abstract class BaseAdapter implements IntegrationAdapter {
  id: string;
  name: string;
  config: AdapterConfig;
  private authToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: AdapterConfig) {
    this.id = config.id;
    this.name = config.name;
    this.config = config;
  }

  /**
   * Make API request
   */
  async request<T = unknown>(options: APIRequestOptions): Promise<APIResponse<T>> {
    // Ensure authenticated
    if (!this.authToken || (this.tokenExpiry && this.tokenExpiry < new Date())) {
      await this.authenticate();
    }

    const url = this.buildUrl(options.path, options.params);
    const headers = this.buildHeaders(options.headers);
    const body = options.body ? JSON.stringify(options.body) : undefined;

    let attempt = 0;
    const retryConfig: RetryConfig = options.retry !== false ? (this.config.retry || {
      enabled: true,
      maxAttempts: 3,
      backoff: 'exponential',
      initialDelay: 1000,
      maxDelay: 60000,
      retryableStatusCodes: [500, 502, 503, 504],
    }) : {
      enabled: false,
      maxAttempts: 1,
      backoff: 'fixed',
      initialDelay: 1000,
      maxDelay: 60000,
      retryableStatusCodes: [],
    };

    while (attempt < retryConfig.maxAttempts) {
      try {
        const response = await fetch(url, {
          method: options.method || 'GET',
          headers,
          body,
          signal: AbortSignal.timeout(this.config.timeout),
        });

        if (!response.ok) {
          if (retryConfig.enabled && retryConfig.retryableStatusCodes.includes(response.status)) {
            attempt++;
            if (attempt < retryConfig.maxAttempts) {
              const delay = this.calculateBackoff(attempt, retryConfig);
              await this.sleep(delay);
              continue;
            }
          }

          const error = await this.parseError(response);
          throw error;
        }

        const data = await response.json();
        const pagination = options.paginate ? this.parsePagination(response, data) : undefined;

        return {
          data: data as T,
          pagination,
        };
      } catch (error) {
        if (attempt === retryConfig.maxAttempts - 1) {
          throw error;
        }
        attempt++;
        const delay = this.calculateBackoff(attempt, retryConfig);
        await this.sleep(delay);
      }
    }

    throw new Error('Request failed after retries');
  }

  /**
   * Authenticate with integration
   */
  async authenticate(): Promise<void> {
    switch (this.config.auth.type) {
      case 'apiKey':
        // API key is stored, no auth needed
        break;
      case 'bearer':
        this.authToken = this.config.auth.token;
        break;
      case 'basic':
        // Basic auth is handled in headers
        break;
      case 'oauth':
        await this.authenticateOAuth();
        break;
      case 'hmac':
        // HMAC is calculated per request
        break;
    }
  }

  /**
   * Authenticate with OAuth
   */
  private async authenticateOAuth(): Promise<void> {
    if (this.config.auth.type !== 'oauth') return;

    const response = await fetch(this.config.auth.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.auth.clientId,
        client_secret: this.config.auth.clientSecret,
        ...(this.config.auth.scopes && { scope: this.config.auth.scopes.join(' ') }),
      }),
    });

    if (!response.ok) {
      throw new Error('OAuth authentication failed');
    }

    const data = await response.json();
    this.authToken = data.access_token;
    const expiresIn = data.expires_in || 3600;
    this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
  }

  /**
   * Build request URL
   */
  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Build request headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.defaultHeaders,
      ...customHeaders,
    };

    // Add authentication
    switch (this.config.auth.type) {
      case 'apiKey':
        if (this.config.auth.location === 'header') {
          headers[this.config.auth.headerName] = this.config.auth.key;
        }
        break;
      case 'bearer':
        if (this.authToken) {
          headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        break;
      case 'basic':
        const credentials = btoa(`${this.config.auth.username}:${this.config.auth.password}`);
        headers['Authorization'] = `Basic ${credentials}`;
        break;
      case 'hmac':
        // HMAC would be calculated per request
        break;
    }

    return headers;
  }

  /**
   * Parse error response
   */
  private async parseError(response: Response): Promise<Error> {
    const errorShape = this.config.errorShape || {
      errorField: 'error',
      messageField: 'message',
      codeField: 'code',
      detailsField: 'details',
    };

    try {
      const data = await response.json();
      const message = (data as any)[errorShape.messageField] || data[errorShape.errorField] || response.statusText;
      const code = (data as any)[errorShape.codeField] || String(response.status);
      
      return new Error(`API Error [${code}]: ${message}`);
    } catch {
      return new Error(`API Error: ${response.statusText}`);
    }
  }

  /**
   * Parse pagination from response
   */
  private parsePagination(_response: Response, _data: unknown): APIResponse['pagination'] {
    const pagination = this.config.pagination;
    if (!pagination) return undefined;

    // Simplified - would parse based on pagination type
    return {
      hasMore: false,
    };
  }

  /**
   * Calculate backoff delay
   */
  private calculateBackoff(attempt: number, config: RetryConfig): number {
    switch (config.backoff) {
      case 'exponential':
        return Math.min(config.initialDelay * Math.pow(2, attempt - 1), config.maxDelay);
      case 'linear':
        return config.initialDelay;
      case 'fixed':
        return config.initialDelay;
      default:
        return config.initialDelay;
    }
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.authenticate();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Adapter Factory
 */
export class AdapterFactory {
  private adapters: Map<string, IntegrationAdapter> = new Map();

  /**
   * Register adapter
   */
  registerAdapter(adapter: IntegrationAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  /**
   * Get adapter
   */
  getAdapter(adapterId: string): IntegrationAdapter | undefined {
    return this.adapters.get(adapterId);
  }

  /**
   * Create adapter from config
   */
  createAdapter(config: AdapterConfig): IntegrationAdapter {
    // Would create specific adapter based on config
    // For now, return a generic base adapter
    return new (class extends BaseAdapter {})(config);
  }

  /**
   * List all adapters
   */
  listAdapters(): IntegrationAdapter[] {
    return Array.from(this.adapters.values());
  }
}

// Export singleton instance
export const adapterFactory = new AdapterFactory();
