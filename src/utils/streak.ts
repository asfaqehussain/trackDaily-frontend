import { todayISO } from './date';

/**
 * Compute the current streak from an array of ISO date strings.
 *
 * Rules:
 * - Sort dates descending
 * - Count consecutive days ending at today or yesterday
 * - If there's a gap, stop counting
 *
 * Example:
 *   checkIns = ["2026-05-05", "2026-05-04", "2026-05-03"] → streak = 3
 *   checkIns = ["2026-05-03", "2026-05-01"] → streak = 1 (gap on 05-02)
 */
export function computeStreak(checkIns: string[]): number {
  if (!checkIns || checkIns.length === 0) return 0;

  // Remove duplicates and sort descending
  const unique = Array.from(new Set(checkIns)).sort((a, b) =>
    b.localeCompare(a)
  );

  const today = todayISO();
  const todayMs = new Date(today).getTime();
  const DAY_MS = 24 * 60 * 60 * 1000;

  // The most recent check-in must be today or yesterday to have an active streak
  const mostRecent = unique[0];
  const mostRecentMs = new Date(mostRecent).getTime();
  const diffDays = Math.round((todayMs - mostRecentMs) / DAY_MS);

  if (diffDays > 1) return 0; // streak is broken

  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const prevMs = new Date(unique[i - 1]).getTime();
    const currMs = new Date(unique[i]).getTime();
    const gap = Math.round((prevMs - currMs) / DAY_MS);

    if (gap === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
