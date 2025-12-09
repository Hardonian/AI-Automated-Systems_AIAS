// Monitoring service for application analytics and error tracking
export interface MonitoringEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string | boolean;
  filename?: string;
  lineno?: number;
  colno?: number;
  reason?: unknown;
  [key: string]: unknown; // Allow additional properties for flexibility
}

class MonitoringService {
  private events: MonitoringEvent[] = [];
  private isInitialized = false;

  init() {
    if (this.isInitialized) {return;}
    
    // Initialize monitoring service
    console.log("Monitoring service initialized");
    this.isInitialized = true;
  }

  trackEvent(name: string, properties?: Record<string, unknown>) {
    const event: MonitoringEvent = {
      name,
      properties,
      timestamp: Date.now()
    };
    
    this.events.push(event);
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement actual monitoring service integration
      console.log("Event tracked:", event);
    } else {
      console.log("Event tracked (dev):", event);
    }
  }

  trackPageView(path: string) {
    this.trackEvent("page_view", { path });
  }

  trackError(error: Error, errorInfo?: ErrorInfo) {
    this.trackEvent("error", {
      message: error.message,
      stack: error.stack,
      ...errorInfo
    });
  }

  trackPerformance(metric: string, value: number, properties?: Record<string, unknown>) {
    this.trackEvent("performance", {
      metric,
      value,
      ...properties
    });
  }

  getEvents(): MonitoringEvent[] {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
  }
}

export const monitoringService = new MonitoringService();

export function initializeErrorHandling() {
  // Global error handler
  window.addEventListener("error", (event) => {
    const error = event.error || new Error(event.message);
    monitoringService.trackError(error, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener("unhandledrejection", (event) => {
    const errorMessage = event.reason instanceof Error 
      ? event.reason.message 
      : String(event.reason);
    monitoringService.trackError(new Error(errorMessage), {
      message: "Unhandled Promise Rejection",
      reason: event.reason
    });
  });

  // Initialize monitoring service
  monitoringService.init();
}
