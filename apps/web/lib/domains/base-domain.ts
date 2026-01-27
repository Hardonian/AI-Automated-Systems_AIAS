/**
 * Base Domain Interface
 * Foundation for domain-driven design structure
 */

/**
 * Base domain service interface
 */
export interface IDomainService {
  readonly domain: string;
  initialize?(): Promise<void>;
  cleanup?(): Promise<void>;
}

/**
 * Base domain repository interface
 */
export interface IDomainRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(params?: unknown): Promise<T[]>;
  create(data: Omit<T, "id" | "created_at" | "updated_at">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * Domain event interface
 */
export interface IDomainEvent {
  type: string;
  payload: unknown;
  timestamp: Date;
  userId?: string;
}

/**
 * Domain event handler
 */
export type DomainEventHandler<T extends IDomainEvent> = (event: T) => Promise<void>;

/**
 * Base domain class
 */
export abstract class BaseDomain implements IDomainService {
  abstract readonly domain: string;

  async initialize(): Promise<void> {
    // Override in subclasses
  }

  async cleanup(): Promise<void> {
    // Override in subclasses
  }
}
