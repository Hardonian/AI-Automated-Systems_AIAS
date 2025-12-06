/**
 * Pagination Utilities
 * Cursor-based and offset-based pagination helpers
 */

import { z } from "zod";

export interface PaginationParams {
  limit: number;
  offset?: number;
  cursor?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor?: string;
    total?: number;
  };
}

/**
 * Pagination query schema
 */
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).optional(),
  cursor: z.string().optional(),
});

/**
 * Extract pagination params from request
 */
export function extractPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const parsed = paginationSchema.parse({
    limit: searchParams.get("limit"),
    offset: searchParams.get("offset"),
    cursor: searchParams.get("cursor"),
  });

  return {
    limit: parsed.limit,
    offset: parsed.offset,
    cursor: parsed.cursor,
  };
}

/**
 * Create pagination result
 */
export function createPaginationResult<T>(
  data: T[],
  params: PaginationParams,
  hasMore: boolean,
  total?: number
): PaginationResult<T> {
  return {
    data,
    pagination: {
      limit: params.limit,
      hasMore,
      nextCursor: hasMore && data.length > 0 ? createCursor(data[data.length - 1]) : undefined,
      total,
    },
  };
}

/**
 * Create cursor from item (simplified - use ID or timestamp)
 */
function createCursor(item: unknown): string {
  if (typeof item === "object" && item !== null) {
    const obj = item as Record<string, unknown>;
    if (obj.id) {
      return Buffer.from(String(obj.id)).toString("base64");
    }
    if (obj.created_at) {
      return Buffer.from(String(obj.created_at)).toString("base64");
    }
  }
  return Buffer.from(JSON.stringify(item)).toString("base64");
}

/**
 * Decode cursor
 */
export function decodeCursor(cursor: string): unknown {
  try {
    return JSON.parse(Buffer.from(cursor, "base64").toString());
  } catch {
    return Buffer.from(cursor, "base64").toString();
  }
}
