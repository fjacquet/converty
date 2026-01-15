export interface TimeDurationInput {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface TimeDurationResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  formattedDuration: string;
}

export function calculateTimeDuration(input: TimeDurationInput): TimeDurationResult | null {
  if (!input.startDate || !input.startTime || !input.endDate || !input.endTime) return null;

  const startDateTime = new Date(`${input.startDate}T${input.startTime}`);
  const endDateTime = new Date(`${input.endDate}T${input.endTime}`);

  if (Number.isNaN(startDateTime.getTime()) || Number.isNaN(endDateTime.getTime())) return null;

  // Ensure end is after start
  if (endDateTime < startDateTime) return null;

  const diffMs = endDateTime.getTime() - startDateTime.getTime();

  // Calculate totals
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Calculate individual components
  let years = endDateTime.getFullYear() - startDateTime.getFullYear();
  let months = endDateTime.getMonth() - startDateTime.getMonth();
  let days = endDateTime.getDate() - startDateTime.getDate();
  let hours = endDateTime.getHours() - startDateTime.getHours();
  let minutes = endDateTime.getMinutes() - startDateTime.getMinutes();
  let seconds = endDateTime.getSeconds() - startDateTime.getSeconds();

  // Handle negative values
  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    // Get days in previous month
    const prevMonth = new Date(endDateTime.getFullYear(), endDateTime.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  // Format duration string
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    formattedDuration: parts.join(", "),
  };
}
