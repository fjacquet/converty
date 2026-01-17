/**
 * Type-safe URL parameter parsing utilities
 *
 * These helpers provide safe parsing of URL parameters with fallback values,
 * preventing NaN propagation and runtime errors.
 */

/**
 * Parse a URL parameter as a number with fallback
 *
 * @param value - The URL parameter value (typically from URLSearchParams.get())
 * @param fallback - The fallback value to use if parsing fails
 * @returns The parsed number or fallback if value is null, empty, or not a valid number
 *
 * @example
 * const searchParams = new URLSearchParams(window.location.search);
 * const amount = parseNumberParam(searchParams.get("amount"), 100);
 * // Returns 100 if "amount" param is missing or invalid
 */
export function parseNumberParam(value: string | null, fallback: number): number {
  if (value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}

/**
 * Parse a URL parameter as a string with fallback
 *
 * @param value - The URL parameter value (typically from URLSearchParams.get())
 * @param fallback - The fallback value to use if value is null or empty
 * @returns The parameter value or fallback if value is null or empty string
 *
 * @example
 * const searchParams = new URLSearchParams(window.location.search);
 * const name = parseStringParam(searchParams.get("name"), "default");
 * // Returns "default" if "name" param is missing or empty
 */
export function parseStringParam(value: string | null, fallback: string): string {
  if (value === null || value === "") {
    return fallback;
  }

  return value;
}

/**
 * Parse a URL parameter as a boolean with fallback
 *
 * @param value - The URL parameter value (typically from URLSearchParams.get())
 * @param fallback - The fallback value to use if value is null or empty
 * @returns true if value is "true" or "1", false otherwise, or fallback if null/empty
 *
 * @example
 * const searchParams = new URLSearchParams(window.location.search);
 * const enabled = parseBooleanParam(searchParams.get("enabled"), false);
 * // Returns true if "enabled=true" or "enabled=1", false for other values
 */
export function parseBooleanParam(value: string | null, fallback: boolean): boolean {
  if (value === null || value === "") {
    return fallback;
  }

  return value === "true" || value === "1";
}
