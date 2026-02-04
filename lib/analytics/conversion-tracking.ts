// Conversion Funnel Analytics Tracking
// Tracks user journey from homepage to signup to activation

export interface ConversionEvent {
  event: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
  properties?: Record<string, any>;
}

export interface ConversionMetrics {
  homepageViews: number;
  signupClicks: number;
  signups: number;
  activations: number; // Created first workflow
  paidConversions: number;
  churn: number;
}

export interface FunnelStep {
  step: string;
  views: number;
  conversions: number;
  conversionRate: number;
}

export class ConversionTracker {
  private static instance: ConversionTracker;
  private events: ConversionEvent[] = [];

  static getInstance(): ConversionTracker {
    if (!ConversionTracker.instance) {
      ConversionTracker.instance = new ConversionTracker();
    }
    return ConversionTracker.instance;
  }

  async track(event: string, properties?: Record<string, any>) {
    const conversionEvent: ConversionEvent = {
      event,
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
      properties,
    };

    this.events.push(conversionEvent);

    // Send to analytics endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversionEvent),
      }).catch(console.error);
    }

    // Also track in database if available
    try {
      const { databasePMFTracker } = await import('./database-integration');
      await databasePMFTracker.trackConversionEvent(
        event,
        properties?.userId,
        this.getSessionId(),
        properties
      );
    } catch (error) {
      // Database not available, continue with in-memory tracking
    }
  }

  getFunnelMetrics(): FunnelStep[] {
    let homepageViews = 0;
    let signupClicks = 0;
    let signups = 0;
    let activations = 0;
    let paidConversions = 0;

    for (const event of this.events) {
      switch (event.event) {
        case 'homepage_view':
          homepageViews += 1;
          break;
        case 'signup_click':
          signupClicks += 1;
          break;
        case 'signup_complete':
          signups += 1;
          break;
        case 'first_workflow_created':
          activations += 1;
          break;
        case 'paid_conversion':
          paidConversions += 1;
          break;
        default:
          break;
      }
    }

    return [
      {
        step: 'Homepage View',
        views: homepageViews,
        conversions: homepageViews,
        conversionRate: 100,
      },
      {
        step: 'Signup Click',
        views: homepageViews,
        conversions: signupClicks,
        conversionRate:
          homepageViews > 0 ? (signupClicks / homepageViews) * 100 : 0,
      },
      {
        step: 'Signup Complete',
        views: signupClicks,
        conversions: signups,
        conversionRate: signupClicks > 0 ? (signups / signupClicks) * 100 : 0,
      },
      {
        step: 'Activation',
        views: signups,
        conversions: activations,
        conversionRate: signups > 0 ? (activations / signups) * 100 : 0,
      },
      {
        step: 'Paid Conversion',
        views: activations,
        conversions: paidConversions,
        conversionRate:
          activations > 0 ? (paidConversions / activations) * 100 : 0,
      },
    ];
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') {
      return 'server';
    }

    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
}

// Export singleton instance
export const conversionTracker = ConversionTracker.getInstance();
