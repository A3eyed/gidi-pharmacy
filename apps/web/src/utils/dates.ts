/**
 * Date range helpers for reports and analytics.
 *
 * These live outside page components on purpose: they read the current clock,
 * so they must only ever be called from effects or event handlers (never during
 * render) to keep server and client output identical.
 */

/** Today as an ISO date string (YYYY-MM-DD). */
export function todayIso() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/** An ISO date string for N days before today. */
export function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/** Preset windows offered across the reports and analytics screens. */
export const QUICK_RANGES = [
  { label: 'Last 7 days', days: 6 },
  { label: 'Last 30 days', days: 29 },
  { label: 'Last 90 days', days: 89 },
  { label: 'Last 12 months', days: 364 },
];
