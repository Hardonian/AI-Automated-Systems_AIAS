/**
 * Chart Color System
 *
 * Centralized color palette for data visualizations.
 * These colors map to the design system chart tokens:
 * --chart-1 through --chart-6
 *
 * Use these constants for all Recharts visualizations to ensure
 * consistency across the application.
 */

export const CHART_COLORS = {
  // Primary brand colors (matching design system)
  primary: '#3b82f6', // --chart-1: Primary blue
  success: '#22c55e', // --chart-2: Success green
  warning: '#f59e0b', // --chart-3: Warning yellow
  destructive: '#ef4444', // --chart-4: Destructive red
  accent: '#8b5cf6', // --chart-5: Accent purple
  info: '#06b6d4', // --chart-6: Info cyan

  // Extended palette for larger datasets
  extended: [
    '#3b82f6', // Blue
    '#22c55e', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#ec4899', // Pink
    '#84cc16', // Lime
    '#14b8a6', // Teal
  ],

  // Semantic colors for status indicators
  status: {
    green: '#22c55e',
    yellow: '#eab308',
    red: '#ef4444',
    gray: '#94a3b8',
  },

  // Plan/Pricing tier colors
  tiers: {
    starter: '#94a3b8',
    pro: '#3b82f6',
    enterprise: '#8b5cf6',
  },
} as const;

/**
 * Get color by index with automatic cycling through extended palette
 */
export function getChartColor(index: number): string {
  return (
    CHART_COLORS.extended[index % CHART_COLORS.extended.length] ??
    CHART_COLORS.primary
  );
}

/**
 * Generate a color array of specified length
 */
export function getChartColorArray(length: number): string[] {
  return Array.from({ length }, (_, i) => getChartColor(i));
}
