/**
 * Strip time portion from an ISO datetime string.
 * "2026-05-10T00:00:00.000Z" → "2026-05-10"
 */
export function dateOnly(value: string): string {
  return value.split('T')[0];
}

/**
 * Format an ISO date string to a human-readable format.
 * e.g. "2026-05-05" → "May 5, 2026"
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Returns today's date as an ISO date string (YYYY-MM-DD).
 */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Check if a given ISO date string is today.
 */
export function isToday(iso: string): boolean {
  return iso === todayISO();
}

/**
 * Check if a given ISO date string is yesterday.
 */
export function isYesterday(iso: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return iso === yesterday.toISOString().split('T')[0];
}
/**
 * Subtract N days from an ISO date string.
 * @returns YYYY-MM-DD
 */
export function subDaysISO(iso: string, days: number): string {
  const date = new Date(iso);
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}
