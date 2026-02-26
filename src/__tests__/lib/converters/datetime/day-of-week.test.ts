import { describe, expect, it } from "vitest";
import { calculateDayOfWeek } from "@/lib/converters/datetime/day-of-week";

describe("calculateDayOfWeek", () => {
  it("returns null for empty date", () => {
    expect(calculateDayOfWeek({ date: "" })).toBeNull();
  });

  it("returns null for invalid date", () => {
    expect(calculateDayOfWeek({ date: "not-a-date" })).toBeNull();
  });

  it("2024-01-01 is a Monday", () => {
    const result = calculateDayOfWeek({ date: "2024-01-01" });
    expect(result).not.toBeNull();
    expect(result!.dayOfWeekKey).toBe("monday");
    expect(result!.dayNumber).toBe(1);
    expect(result!.isWeekend).toBe(false);
  });

  it("2024-06-15 is a Saturday", () => {
    const result = calculateDayOfWeek({ date: "2024-06-15" });
    expect(result).not.toBeNull();
    expect(result!.dayOfWeekKey).toBe("saturday");
    expect(result!.isWeekend).toBe(true);
  });

  it("2024-06-16 is a Sunday (weekend)", () => {
    const result = calculateDayOfWeek({ date: "2024-06-16" });
    expect(result).not.toBeNull();
    expect(result!.dayOfWeekKey).toBe("sunday");
    expect(result!.isWeekend).toBe(true);
  });

  it("2024-06-14 is a Friday (not weekend)", () => {
    const result = calculateDayOfWeek({ date: "2024-06-14" });
    expect(result).not.toBeNull();
    expect(result!.dayOfWeekKey).toBe("friday");
    expect(result!.isWeekend).toBe(false);
  });

  it("returns dayOfYear between 1 and 366", () => {
    const result = calculateDayOfWeek({ date: "2024-06-15" });
    expect(result!.dayOfYear).toBeGreaterThanOrEqual(1);
    expect(result!.dayOfYear).toBeLessThanOrEqual(366);
  });

  it("returns weekNumber between 1 and 53", () => {
    const result = calculateDayOfWeek({ date: "2024-06-15" });
    expect(result!.weekNumber).toBeGreaterThanOrEqual(1);
    expect(result!.weekNumber).toBeLessThanOrEqual(53);
  });

  it("returns quarter between 1 and 4", () => {
    const result = calculateDayOfWeek({ date: "2024-06-15" });
    expect(result!.quarter).toBe(2); // June is Q2
  });

  it("2024-01-01 is in Q1", () => {
    const result = calculateDayOfWeek({ date: "2024-01-01" });
    expect(result!.quarter).toBe(1);
  });

  it("2024-12-31 is in Q4", () => {
    const result = calculateDayOfWeek({ date: "2024-12-31" });
    expect(result!.quarter).toBe(4);
  });
});
