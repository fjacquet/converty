export type DateOperation = "add" | "subtract";

export interface DateInput {
  startDate: string;
  operation: DateOperation;
  years: string;
  months: string;
  weeks: string;
  days: string;
}

export interface DateResult {
  resultDate: Date;
  formattedDate: string;
  dayOfWeek: string;
  daysFromStart: number;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function calculateDate(input: DateInput): DateResult | null {
  if (!input.startDate) return null;

  const startDate = new Date(input.startDate);
  if (Number.isNaN(startDate.getTime())) return null;

  const years = Number.parseInt(input.years, 10) || 0;
  const months = Number.parseInt(input.months, 10) || 0;
  const weeks = Number.parseInt(input.weeks, 10) || 0;
  const days = Number.parseInt(input.days, 10) || 0;

  const multiplier = input.operation === "add" ? 1 : -1;

  const resultDate = new Date(startDate);
  resultDate.setFullYear(resultDate.getFullYear() + years * multiplier);
  resultDate.setMonth(resultDate.getMonth() + months * multiplier);
  resultDate.setDate(resultDate.getDate() + (weeks * 7 + days) * multiplier);

  const daysFromStart = Math.round(
    (resultDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    resultDate,
    formattedDate: resultDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    dayOfWeek: DAYS_OF_WEEK[resultDate.getDay()],
    daysFromStart: Math.abs(daysFromStart),
  };
}
