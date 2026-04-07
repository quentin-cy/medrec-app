/**
 * Convert ISO date (YYYY-MM-DD) to European format (dd/mm/yyyy).
 * Returns empty string if input is empty or invalid.
 */
export function isoToEuropean(iso: string): string {
  if (!iso) return '';
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return iso;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

/**
 * Convert European date (dd/mm/yyyy) to ISO format (YYYY-MM-DD).
 * Returns empty string if input is empty. Returns the raw input
 * if it doesn't match the expected pattern (partial typing).
 */
export function europeanToIso(european: string): string {
  if (!european) return '';
  const match = european.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return '';
  return `${match[3]}-${match[2]}-${match[1]}`;
}

/**
 * Check if a string is a valid complete European date (dd/mm/yyyy)
 * with a real calendar date.
 */
export function isValidEuropeanDate(value: string): boolean {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}