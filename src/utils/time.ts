/**
 * Format total seconds into MM:SS display string.
 * e.g. 90 → "1:30", 3600 → "60:00"
 */
export function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convert minutes to a human-readable string.
 * e.g. 5 → "5 min", 90 → "1 hr 30 min", 60 → "1 hr"
 */
export function humanizeDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) return `${hours} hr`;
  return `${hours} hr ${remainingMins} min`;
}

/**
 * Returns today's date as ISO 8601 date string "YYYY-MM-DD".
 */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns current datetime as ISO 8601 string.
 */
export function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Format an ISO datetime string to a short time display e.g. "2:34 PM"
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * Get the last N days as ISO date strings, most recent first.
 */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}
