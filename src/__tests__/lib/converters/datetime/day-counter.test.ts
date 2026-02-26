import { describe, expect, it } from "vitest";
import { calculateDayCounter } from "@/lib/converters/datetime/day-counter";

describe("calculateDayCounter", () => {
  it("returns null for missing startDate", () => {
    expect(
      calculateDayCounter({ startDate: "", endDate: "2024-01-05", includeEndDate: false })
    ).toBeNull();
  });

  it("returns null for missing endDate", () => {
    expect(
      calculateDayCounter({ startDate: "2024-01-01", endDate: "", includeEndDate: false })
    ).toBeNull();
  });

  it("counts 4 days between 2024-01-01 and 2024-01-05 (exclusive)", () => {
    const result = calculateDayCounter({
      startDate: "2024-01-01",
      endDate: "2024-01-05",
      includeEndDate: false,
    });
    expect(result).not.toBeNull();
    expect(result!.totalDays).toBe(4);
  });

  it("counts 5 days between 2024-01-01 and 2024-01-05 (inclusive)", () => {
    const result = calculateDayCounter({
      startDate: "2024-01-01",
      endDate: "2024-01-05",
      includeEndDate: true,
    });
    expect(result).not.toBeNull();
    expect(result!.totalDays).toBe(5);
  });

  it("counts business days for Mon-Fri week (exclusive)", () => {
    // 2024-01-01 is Monday, 2024-01-05 is Friday
    const result = calculateDayCounter({
      startDate: "2024-01-01",
      endDate: "2024-01-05",
      includeEndDate: false,
    });
    expect(result).not.toBeNull();
    // Mon, Tue, Wed, Thu = 4 business days (exclusive of Fri)
    expect(result!.businessDays).toBe(4);
  });

  it("swaps dates when end is before start", () => {
    const result = calculateDayCounter({
      startDate: "2024-01-05",
      endDate: "2024-01-01",
      includeEndDate: false,
    });
    expect(result).not.toBeNull();
    expect(result!.totalDays).toBe(4);
  });

  it("calculates weeks and remaining days", () => {
    // 14 days = 2 weeks, 0 remaining
    const result = calculateDayCounter({
      startDate: "2024-01-01",
      endDate: "2024-01-15",
      includeEndDate: false,
    });
    expect(result).not.toBeNull();
    expect(result!.weeks).toBe(2);
    expect(result!.remainingDays).toBe(0);
  });

  it("returns 0 days for same start and end date (exclusive)", () => {
    const result = calculateDayCounter({
      startDate: "2024-06-15",
      endDate: "2024-06-15",
      includeEndDate: false,
    });
    expect(result).not.toBeNull();
    expect(result!.totalDays).toBe(0);
  });

  it("returns formattedDuration string", () => {
    const result = calculateDayCounter({
      startDate: "2024-01-01",
      endDate: "2024-01-08",
      includeEndDate: false,
    });
    expect(result).not.toBeNull();
    expect(result!.formattedDuration).toContain("week");
  });
});
