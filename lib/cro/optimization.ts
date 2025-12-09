/**
 * Conversion Rate Optimization Utilities
 * Data-driven CRO helpers and analytics
 */

export interface ConversionEvent {
  type: 'page_view' | 'cta_click' | 'form_submit' | 'signup' | 'trial_start' | 'purchase';
  element?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-100
  config: Record<string, unknown>;
}

export interface ABTest {
  id: string;
  name: string;
  variants: ABTestVariant[];
  active: boolean;
  startDate: Date;
  endDate?: Date;
}

/**
 * Track conversion events
 */
export function trackConversion(event: ConversionEvent): void {
  if (typeof window === 'undefined') {return;}
  
  // Send to analytics
  if (window.gtag) {
    window.gtag('event', event.type, {
      event_category: 'conversion',
      event_label: event.element,
      value: event.value,
      ...event.metadata,
    });
  }
  
  // Send to custom analytics
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...event,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
    }),
  }).catch(() => {
    // Silently fail if analytics endpoint is unavailable
  });
}

/**
 * Get or assign AB test variant
 */
export function getABTestVariant(testId: string, userId?: string): string | null {
  if (typeof window === 'undefined') {return null;}
  
  const storageKey = `ab_test_${testId}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    return stored;
  }
  
  // Assign variant based on user ID hash or random
  const seed = userId ? hashString(userId) : Math.random();
  const variant = seed % 2 === 0 ? 'A' : 'B';
  
  localStorage.setItem(storageKey, variant);
  return variant;
}

/**
 * Simple string hash for consistent variant assignment
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Track CTA clicks with urgency
 */
export function trackCTAClick(
  ctaId: string,
  location: string,
  urgency?: 'low' | 'medium' | 'high'
): void {
  trackConversion({
    type: 'cta_click',
    element: ctaId,
    metadata: {
      location,
      urgency,
      timestamp: Date.now(),
    },
  });
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(
  conversions: number,
  visitors: number
): number {
  if (visitors === 0) {return 0;}
  return (conversions / visitors) * 100;
}

/**
 * Detect exit intent (user about to leave)
 */
export function detectExitIntent(callback: () => void): () => void {
  if (typeof window === 'undefined') {return () => {};}
  
  const handleMouseLeave = (e: MouseEvent) => {
    if (e.clientY <= 0) {
      callback();
    }
  };
  
  document.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    document.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Show urgency indicators (limited time, low stock, etc.)
 */
export function showUrgencyIndicator(
  type: 'limited_time' | 'low_stock' | 'popular',
  element: HTMLElement
): void {
  const indicators = {
    limited_time: '⏰ Limited time offer',
    low_stock: '⚠️ Only a few spots left',
    popular: '🔥 Popular choice',
  };
  
  const badge = document.createElement('span');
  badge.className = 'urgency-badge';
  badge.textContent = indicators[type];
  badge.setAttribute('aria-label', indicators[type]);
  
  element.appendChild(badge);
  
  // Animate in
  requestAnimationFrame(() => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(-10px)';
    requestAnimationFrame(() => {
      badge.style.transition = 'all 0.3s ease';
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    });
  });
}

/**
 * Optimize form for conversion
 */
export function optimizeForm(formId: string): void {
  const form = document.getElementById(formId);
  if (!form) {return;}
  
  // Add progress indicator
  const fields = form.querySelectorAll<HTMLInputElement>('input, textarea, select');
  const progressBar = document.createElement('div');
  progressBar.className = 'form-progress';
  progressBar.setAttribute('role', 'progressbar');
  progressBar.setAttribute('aria-valuenow', '0');
  progressBar.setAttribute('aria-valuemin', '0');
  progressBar.setAttribute('aria-valuemax', '100');
  form.insertBefore(progressBar, form.firstChild);
  
  // Update progress as user fills form
  fields.forEach(field => {
    field.addEventListener('input', () => {
      const filled = Array.from(fields).filter(f => f.value).length;
      const progress = (filled / fields.length) * 100;
      progressBar.setAttribute('aria-valuenow', progress.toString());
      progressBar.style.width = `${progress}%`;
    });
  });
  
  // Track form abandonment
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeSpent = Date.now() - startTime;
    if (timeSpent > 5000) { // Only track if user spent > 5 seconds
      trackConversion({
        type: 'form_submit',
        element: formId,
        metadata: {
          abandoned: true,
          time_spent: timeSpent,
        },
      });
    }
  });
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
