"use client";

/**
 * Item 86: Sprint Availability HUD
 *
 * A compact, telemetry-styled availability indicator for the header.
 * Content is driven from this component to keep it self-contained.
 * Shows current sprint capacity and next available engagement slot.
 *
 * EXTENDING: Update the `AVAILABILITY` constant below when sprint
 * capacity changes. No backend required — pure static content.
 */

const AVAILABILITY = {
  /** Current sprint capacity status */
  status: "ACCEPTING" as "ACCEPTING" | "WAITLIST" | "FULL",
  /** Number of slots remaining this sprint */
  slotsRemaining: 2,
  /** Next available sprint start date (ISO or human-readable) */
  nextSprintLabel: "Q4 2026",
} as const;

const statusConfig = {
  ACCEPTING: {
    label: "SLOTS OPEN",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-600/40",
    bgClass: "bg-emerald-500/10",
  },
  WAITLIST: {
    label: "WAITLIST",
    dotClass: "bg-warning",
    textClass: "text-warning",
    borderClass: "border-warning/40",
    bgClass: "bg-warning/10",
  },
  FULL: {
    label: "FULLY BOOKED",
    dotClass: "bg-destructive",
    textClass: "text-destructive",
    borderClass: "border-destructive/40",
    bgClass: "bg-destructive/10",
  },
} as const;

export function SprintAvailabilityHUD() {
  const config = statusConfig[AVAILABILITY.status];

  return (
    <div
      className={`hidden lg:flex items-center gap-2 border ${config.borderClass} ${config.bgClass} px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider`}
      aria-label={`Sprint availability: ${config.label}, ${AVAILABILITY.slotsRemaining} slots remaining, next sprint ${AVAILABILITY.nextSprintLabel}`}
    >
      {/* Animated status dot */}
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.dotClass}`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${config.dotClass}`}
        />
      </span>

      <span className={config.textClass}>{config.label}</span>
      <span className="text-muted-foreground">
        {AVAILABILITY.slotsRemaining} / {AVAILABILITY.nextSprintLabel}
      </span>
    </div>
  );
}
