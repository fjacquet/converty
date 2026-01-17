/**
 * Duration Converter
 * Converts between time units (seconds, minutes, hours, days, weeks, months, years)
 */

export type DurationUnit = "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";

export interface DurationConverterInput {
  value: string;
  unit: DurationUnit;
}

export interface DurationConverterResult {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
  humanReadable: string;
}

// Conversion factors to seconds
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_WEEK = 604800;
const SECONDS_PER_MONTH = 2629746; // Average: 365.25 / 12 days
const SECONDS_PER_YEAR = 31556952; // 365.25 days

const UNIT_TO_SECONDS: Record<DurationUnit, number> = {
  seconds: 1,
  minutes: SECONDS_PER_MINUTE,
  hours: SECONDS_PER_HOUR,
  days: SECONDS_PER_DAY,
  weeks: SECONDS_PER_WEEK,
  months: SECONDS_PER_MONTH,
  years: SECONDS_PER_YEAR,
};

export const DURATION_UNITS: { id: DurationUnit; label: string }[] = [
  { id: "seconds", label: "s" },
  { id: "minutes", label: "min" },
  { id: "hours", label: "h" },
  { id: "days", label: "d" },
  { id: "weeks", label: "wk" },
  { id: "months", label: "mo" },
  { id: "years", label: "yr" },
];

function formatHumanReadable(totalSeconds: number): string {
  if (totalSeconds === 0) return "0 seconds";

  const isNegative = totalSeconds < 0;
  let remaining = Math.abs(totalSeconds);

  const years = Math.floor(remaining / SECONDS_PER_YEAR);
  remaining %= SECONDS_PER_YEAR;

  const months = Math.floor(remaining / SECONDS_PER_MONTH);
  remaining %= SECONDS_PER_MONTH;

  const weeks = Math.floor(remaining / SECONDS_PER_WEEK);
  remaining %= SECONDS_PER_WEEK;

  const days = Math.floor(remaining / SECONDS_PER_DAY);
  remaining %= SECONDS_PER_DAY;

  const hours = Math.floor(remaining / SECONDS_PER_HOUR);
  remaining %= SECONDS_PER_HOUR;

  const minutes = Math.floor(remaining / SECONDS_PER_MINUTE);
  const seconds = Math.round(remaining % SECONDS_PER_MINUTE);

  const parts: string[] = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? "week" : "weeks"}`);
  if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  if (seconds > 0) parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);

  const result = parts.join(", ");
  return isNegative ? `-${result}` : result;
}

export function convertDuration(input: DurationConverterInput): DurationConverterResult | null {
  const numValue = Number.parseFloat(input.value);

  if (Number.isNaN(numValue)) {
    return null;
  }

  // Convert input to seconds
  const totalSeconds = numValue * UNIT_TO_SECONDS[input.unit];

  return {
    seconds: totalSeconds,
    minutes: totalSeconds / SECONDS_PER_MINUTE,
    hours: totalSeconds / SECONDS_PER_HOUR,
    days: totalSeconds / SECONDS_PER_DAY,
    weeks: totalSeconds / SECONDS_PER_WEEK,
    months: totalSeconds / SECONDS_PER_MONTH,
    years: totalSeconds / SECONDS_PER_YEAR,
    humanReadable: formatHumanReadable(totalSeconds),
  };
}
