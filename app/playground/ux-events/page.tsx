"use client";

import { useState, useEffect } from "react";

import { Reveal, AnimatedCard } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentEvents, clearEvents, type UXEvent } from "@/lib/ux-events";

/**
 * UX Events Inspector (Dev Only)
 * 
 * View recent UX events for debugging and optimization
 */
export default function UXEventsPage() {
  const [events, setEvents] = useState<UXEvent[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadEvents = () => {
    const recent = getRecentEvents(100);
    setEvents(recent);
  };

  useEffect(() => {
    loadEvents();
    
    if (autoRefresh) {
      const interval = setInterval(loadEvents, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleClear = () => {
    clearEvents();
    loadEvents();
  };

  const getEventColor = (type: UXEvent["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "error":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "step_completed":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "flow_completed":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <Reveal variant="fadeInUp">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">UX Events Inspector</h1>
            <p className="text-muted-foreground">
              View recent UX interaction events (Dev Only)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear Events
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal delay={0.1} variant="fadeInUp">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <AnimatedCard variant="fadeInUp">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{events.length}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </CardContent>
            </Card>
          </AnimatedCard>
          <AnimatedCard staggerDelay={0.1} variant="fadeInUp">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {events.filter((e) => e.type === "step_completed").length}
                </div>
                <div className="text-sm text-muted-foreground">Steps Completed</div>
              </CardContent>
            </Card>
          </AnimatedCard>
          <AnimatedCard staggerDelay={0.2} variant="fadeInUp">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {events.filter((e) => e.type === "success").length}
                </div>
                <div className="text-sm text-muted-foreground">Successes</div>
              </CardContent>
            </Card>
          </AnimatedCard>
          <AnimatedCard staggerDelay={0.3} variant="fadeInUp">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {events.filter((e) => e.type === "error").length}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </Reveal>

      {/* Events List */}
      <Reveal delay={0.2} variant="fadeInUp">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>
              Most recent events first ({events.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No events yet. Interact with the app to see events here.
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {events.slice().reverse().map((event, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getEventColor(event.type)}>
                            {event.type}
                          </Badge>
                          {event.flow && (
                            <Badge variant="outline">{event.flow}</Badge>
                          )}
                          {event.step !== undefined && (
                            <Badge variant="outline">Step {event.step}</Badge>
                          )}
                        </div>
                        {event.stepId && (
                          <div className="text-sm text-muted-foreground mb-1">
                            Step ID: {event.stepId}
                          </div>
                        )}
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              Metadata
                            </summary>
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(event.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
