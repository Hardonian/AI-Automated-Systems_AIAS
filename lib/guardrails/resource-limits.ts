/**
 * Resource Limits
 * Enforces limits on resource usage to prevent abuse
 */

interface ResourceLimit {
  maxSize: number;
  maxCount: number;
  windowMs: number;
}

interface ResourceUsage {
  count: number;
  totalSize: number;
  resetAt: number;
}

const resourceTrackers = new Map<string, ResourceUsage>();

const DEFAULT_LIMITS: Record<string, ResourceLimit> = {
  requestBody: {
    maxSize: 10 * 1024 * 1024, // 10MB
    maxCount: 100,
    windowMs: 60000, // 1 minute
  },
  queryParams: {
    maxSize: 8192, // 8KB
    maxCount: 50,
    windowMs: 60000,
  },
  fileUpload: {
    maxSize: 50 * 1024 * 1024, // 50MB
    maxCount: 10,
    windowMs: 60000,
  },
  apiCalls: {
    maxSize: 0, // Not applicable
    maxCount: 1000,
    windowMs: 60000,
  },
};

/**
 * Check if resource usage is within limits
 */
export function checkResourceLimit(
  resourceType: string,
  size: number = 0,
  customLimit?: Partial<ResourceLimit>
): { allowed: boolean; remaining: number; resetAt: number } {
  const limit = { ...DEFAULT_LIMITS[resourceType], ...customLimit };
  const now = Date.now();
  
  let usage = resourceTrackers.get(resourceType);
  
  if (!usage || now > usage.resetAt) {
    usage = {
      count: 0,
      totalSize: 0,
      resetAt: now + limit.windowMs,
    };
    resourceTrackers.set(resourceType, usage);
  }
  
  // Check count limit
  if (usage.count >= limit.maxCount) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: usage.resetAt,
    };
  }
  
  // Check size limit
  if (limit.maxSize > 0 && usage.totalSize + size > limit.maxSize) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: usage.resetAt,
    };
  }
  
  // Update usage
  usage.count++;
  usage.totalSize += size;
  
  return {
    allowed: true,
    remaining: limit.maxCount - usage.count,
    resetAt: usage.resetAt,
  };
}

/**
 * Reset resource usage for a type
 */
export function resetResourceUsage(resourceType: string): void {
  resourceTrackers.delete(resourceType);
}

/**
 * Get current resource usage
 */
export function getResourceUsage(resourceType: string): ResourceUsage | null {
  return resourceTrackers.get(resourceType) || null;
}

/**
 * Clean up expired resource trackers
 */
export function cleanupExpiredTrackers(): void {
  const now = Date.now();
  for (const [type, usage] of resourceTrackers.entries()) {
    if (now > usage.resetAt) {
      resourceTrackers.delete(type);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredTrackers, 5 * 60 * 1000);
}
