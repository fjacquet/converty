export interface TimeZoneInput {
  dateTime: string;
  fromTimezone: string;
  toTimezone: string;
}

export interface TimeZoneResult {
  convertedDateTime: Date;
  formattedDate: string;
  formattedTime: string;
  offset: string;
  offsetMinutes: number;
}

// Common timezones with UTC offsets
export const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)", offset: 0 },
  { value: "America/New_York", label: "EST/EDT (New York)", offset: -5 },
  { value: "America/Chicago", label: "CST/CDT (Chicago)", offset: -6 },
  { value: "America/Denver", label: "MST/MDT (Denver)", offset: -7 },
  { value: "America/Los_Angeles", label: "PST/PDT (Los Angeles)", offset: -8 },
  { value: "America/Anchorage", label: "AKST/AKDT (Anchorage)", offset: -9 },
  { value: "Pacific/Honolulu", label: "HST (Honolulu)", offset: -10 },
  { value: "Europe/London", label: "GMT/BST (London)", offset: 0 },
  { value: "Europe/Paris", label: "CET/CEST (Paris)", offset: 1 },
  { value: "Europe/Berlin", label: "CET/CEST (Berlin)", offset: 1 },
  { value: "Europe/Moscow", label: "MSK (Moscow)", offset: 3 },
  { value: "Asia/Dubai", label: "GST (Dubai)", offset: 4 },
  { value: "Asia/Kolkata", label: "IST (India)", offset: 5.5 },
  { value: "Asia/Bangkok", label: "ICT (Bangkok)", offset: 7 },
  { value: "Asia/Shanghai", label: "CST (Shanghai)", offset: 8 },
  { value: "Asia/Tokyo", label: "JST (Tokyo)", offset: 9 },
  { value: "Australia/Sydney", label: "AEST/AEDT (Sydney)", offset: 10 },
  { value: "Pacific/Auckland", label: "NZST/NZDT (Auckland)", offset: 12 },
];

export function calculateTimeZone(input: TimeZoneInput): TimeZoneResult | null {
  if (!input.dateTime || !input.fromTimezone || !input.toTimezone) return null;

  const fromTz = TIMEZONES.find((tz) => tz.value === input.fromTimezone);
  const toTz = TIMEZONES.find((tz) => tz.value === input.toTimezone);

  if (!fromTz || !toTz) return null;

  // Parse the input datetime as if it's in the source timezone
  const inputDate = new Date(input.dateTime);
  if (Number.isNaN(inputDate.getTime())) return null;

  // Calculate the offset difference in minutes
  const offsetDiff = (toTz.offset - fromTz.offset) * 60;

  // Create the converted date
  const convertedDateTime = new Date(inputDate.getTime() + offsetDiff * 60 * 1000);

  // Format the offset
  const offsetHours = Math.floor(Math.abs(toTz.offset));
  const offsetMinutes = Math.abs((toTz.offset % 1) * 60);
  const offsetSign = toTz.offset >= 0 ? "+" : "-";
  const offset = `UTC${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;

  return {
    convertedDateTime,
    formattedDate: convertedDateTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    formattedTime: convertedDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
    offset,
    offsetMinutes: toTz.offset * 60,
  };
}
