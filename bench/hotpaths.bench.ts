import { performance } from 'perf_hooks';

import { conversionTracker } from '../lib/analytics/conversion-tracking';
import { leadNurturingService } from '../lib/lead-generation/lead-nurturing';
import {
  calculateBehavioralScoreFromActivities,
  calculateEngagementScoreFromData,
} from '../lib/lead-generation/lead-scoring';

type TimingStats = {
  name: string;
  iterations: number;
  averageMs: number;
  minMs: number;
  maxMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  opsPerSecond: number;
};

function percentile(values: number[], pct: number): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((pct / 100) * sorted.length) - 1;
  const clampedIndex = Math.max(0, Math.min(sorted.length - 1, index));
  return sorted[clampedIndex] ?? 0;
}

async function runTimed(
  name: string,
  fn: () => void | Promise<void>,
  iterations = 100
): Promise<TimingStats> {
  const timings: number[] = [];

  for (let i = 0; i < 10; i++) {
    await fn();
  }

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    const iterStart = performance.now();
    await fn();
    timings.push(performance.now() - iterStart);
  }
  const total = performance.now() - start;

  const avg = timings.reduce((sum, value) => sum + value, 0) / timings.length;
  const min = Math.min(...timings);
  const max = Math.max(...timings);

  return {
    name,
    iterations,
    averageMs: avg,
    minMs: min,
    maxMs: max,
    p50Ms: percentile(timings, 50),
    p95Ms: percentile(timings, 95),
    p99Ms: percentile(timings, 99),
    opsPerSecond: (iterations / total) * 1000,
  };
}

function buildConversionEvents(total: number) {
  const events = [];
  const eventNames = [
    'homepage_view',
    'signup_click',
    'signup_complete',
    'first_workflow_created',
    'paid_conversion',
    'other_event',
  ];

  for (let i = 0; i < total; i++) {
    const event = eventNames[i % eventNames.length] ?? 'other_event';
    events.push({
      event,
      sessionId: `session-${i % 1000}`,
      timestamp: new Date().toISOString(),
      properties: { index: i },
    });
  }

  return events;
}

function legacyBehavioralScore(
  activities: Array<{ activity_type: string; created_at: string }>
): number {
  if (!activities || activities.length === 0) {
    return 0;
  }

  let score = 0;
  score += Math.min(activities.length * 2, 10);

  const activityTypes = new Set(
    activities.map(activity => activity.activity_type)
  );
  score += Math.min(activityTypes.size * 2, 10);

  const recentActivity = activities.filter(
    activity =>
      new Date(activity.created_at).getTime() >
      Date.now() - 7 * 24 * 60 * 60 * 1000
  );
  if (recentActivity.length > 0) {
    score += 5;
  }

  const highValueActivities = [
    'demo_requested',
    'pricing_viewed',
    'trial_started',
  ];
  const hasHighValue = activities.some(activity =>
    highValueActivities.includes(activity.activity_type)
  );
  if (hasHighValue) {
    score += 5;
  }

  return Math.min(score, 30);
}

function legacyEngagementScore(
  emails: Array<{ opened?: boolean; clicked?: boolean; replied?: boolean }>,
  sessions: Array<{ duration?: number; page_views?: number }>
): number {
  let score = 0;

  if (emails.length > 0) {
    const opened = emails.filter(email => email.opened).length;
    const clicked = emails.filter(email => email.clicked).length;
    const replied = emails.filter(email => email.replied).length;

    score += Math.min(opened * 2, 8);
    score += Math.min(clicked * 3, 6);
    score += replied * 6;
  }

  if (sessions.length > 0) {
    const totalTime = sessions.reduce(
      (sum, session) => sum + (session.duration || 0),
      0
    );
    const pageViews = sessions.reduce(
      (sum, session) => sum + (session.page_views || 0),
      0
    );

    if (totalTime > 300) {
      score += 3;
    }
    if (pageViews > 5) {
      score += 3;
    }
  }

  return Math.min(score, 20);
}

async function benchmarkFunnelMetrics(): Promise<TimingStats> {
  const events = buildConversionEvents(200_000);
  (conversionTracker as unknown as { events: unknown[] }).events = events;
  return runTimed('conversionTracker.getFunnelMetrics', () => {
    conversionTracker.getFunnelMetrics();
  });
}

async function benchmarkPersonalizeTemplate(): Promise<TimingStats> {
  const template = {
    subject:
      'Welcome {{firstName}} {{lastName}} to {{company}}. Your contact: {{email}}.',
    body:
      'Hi {{firstName}},\n\nWe are thrilled to have you at {{company}}. ' +
      'Reach us at {{email}} if you need anything. Regards, {{firstName}}.',
  };

  const lead = {
    first_name: 'Alex',
    last_name: 'Morgan',
    email: 'alex@example.com',
    company: 'Acme',
  };

  return runTimed(
    'leadNurturingService.personalizeEmail',
    () => {
      (
        leadNurturingService as unknown as {
          personalizeEmail: (t: typeof template, l: typeof lead) => void;
        }
      ).personalizeEmail(template, lead);
    },
    200
  );
}

async function benchmarkBehavioralScoreLegacy(): Promise<TimingStats> {
  const activities: Array<{ activity_type: string; created_at: string }> = [];
  const activityTypes = [
    'page_view',
    'signup',
    'demo_requested',
    'pricing_viewed',
    'trial_started',
    'click',
  ];
  const now = Date.now();

  for (let i = 0; i < 200_000; i++) {
    const activityType = activityTypes[i % activityTypes.length] ?? 'page_view';
    activities.push({
      activity_type: activityType,
      created_at: new Date(now - (i % 10) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return runTimed(
    'legacyBehavioralScore(activities)',
    () => {
      legacyBehavioralScore(activities);
    },
    100
  );
}

async function benchmarkBehavioralScoreOptimized(): Promise<TimingStats> {
  const activities: Array<{ activity_type: string; created_at: string }> = [];
  const activityTypes = [
    'page_view',
    'signup',
    'demo_requested',
    'pricing_viewed',
    'trial_started',
    'click',
  ];
  const now = Date.now();

  for (let i = 0; i < 200_000; i++) {
    const activityType = activityTypes[i % activityTypes.length] ?? 'page_view';
    activities.push({
      activity_type: activityType,
      created_at: new Date(now - (i % 10) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return runTimed(
    'calculateBehavioralScoreFromActivities',
    () => {
      calculateBehavioralScoreFromActivities(activities);
    },
    100
  );
}

async function benchmarkEngagementScoreLegacy(): Promise<TimingStats> {
  const emails: Array<{
    opened?: boolean;
    clicked?: boolean;
    replied?: boolean;
  }> = [];
  const sessions: Array<{ duration?: number; page_views?: number }> = [];

  for (let i = 0; i < 200_000; i++) {
    emails.push({
      opened: i % 3 === 0,
      clicked: i % 5 === 0,
      replied: i % 11 === 0,
    });
  }

  for (let i = 0; i < 50_000; i++) {
    sessions.push({
      duration: i % 2 === 0 ? 120 : 30,
      page_views: i % 2 === 0 ? 6 : 2,
    });
  }

  return runTimed(
    'legacyEngagementScore(emails, sessions)',
    () => {
      legacyEngagementScore(emails, sessions);
    },
    100
  );
}

async function benchmarkEngagementScoreOptimized(): Promise<TimingStats> {
  const emails: Array<{
    opened?: boolean;
    clicked?: boolean;
    replied?: boolean;
  }> = [];
  const sessions: Array<{ duration?: number; page_views?: number }> = [];

  for (let i = 0; i < 200_000; i++) {
    emails.push({
      opened: i % 3 === 0,
      clicked: i % 5 === 0,
      replied: i % 11 === 0,
    });
  }

  for (let i = 0; i < 50_000; i++) {
    sessions.push({
      duration: i % 2 === 0 ? 120 : 30,
      page_views: i % 2 === 0 ? 6 : 2,
    });
  }

  return runTimed(
    'calculateEngagementScoreFromData',
    () => {
      calculateEngagementScoreFromData(emails, sessions);
    },
    100
  );
}

async function main() {
  const results = [
    await benchmarkFunnelMetrics(),
    await benchmarkPersonalizeTemplate(),
    await benchmarkBehavioralScoreLegacy(),
    await benchmarkBehavioralScoreOptimized(),
    await benchmarkEngagementScoreLegacy(),
    await benchmarkEngagementScoreOptimized(),
  ];

  for (const result of results) {
    console.log(`\n${result.name}`);
    console.log(`  iterations: ${result.iterations}`);
    console.log(`  avg_ms: ${result.averageMs.toFixed(4)}`);
    console.log(`  min_ms: ${result.minMs.toFixed(4)}`);
    console.log(`  max_ms: ${result.maxMs.toFixed(4)}`);
    console.log(`  p50_ms: ${result.p50Ms.toFixed(4)}`);
    console.log(`  p95_ms: ${result.p95Ms.toFixed(4)}`);
    console.log(`  p99_ms: ${result.p99Ms.toFixed(4)}`);
    console.log(`  ops_per_sec: ${result.opsPerSecond.toFixed(2)}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
