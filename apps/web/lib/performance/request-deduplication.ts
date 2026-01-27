/**
 * Request Deduplication
 * Prevents duplicate concurrent requests to the same endpoint
 */

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

const pendingRequests = new Map<string, PendingRequest<unknown>>();
const REQUEST_TIMEOUT = 30000; // 30 seconds
const CLEANUP_INTERVAL = 60000; // Clean up every minute

// Cleanup old requests periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, request] of pendingRequests.entries()) {
      if (now - request.timestamp > REQUEST_TIMEOUT) {
        pendingRequests.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

/**
 * Deduplicate concurrent requests
 * If multiple requests with the same key are made simultaneously,
 * only one actual request is made and all callers share the result
 */
export function deduplicateRequest<T>(
  key: string,
  requestFn: () => Promise<T>,
  ttl: number = 5000 // Default 5 second deduplication window
): Promise<T> {
  const existing = pendingRequests.get(key);
  
  if (existing) {
    // Check if request is still valid
    if (Date.now() - existing.timestamp < ttl) {
      return existing.promise as Promise<T>;
    }
    // Request expired, remove it
    pendingRequests.delete(key);
  }
  
  const promise = requestFn().finally(() => {
    // Remove from pending after completion
    setTimeout(() => {
      pendingRequests.delete(key);
    }, 100);
  });
  
  pendingRequests.set(key, {
    promise,
    timestamp: Date.now(),
  });
  
  return promise;
}

/**
 * Clear all pending requests (useful for testing)
 */
export function clearPendingRequests(): void {
  pendingRequests.clear();
}
