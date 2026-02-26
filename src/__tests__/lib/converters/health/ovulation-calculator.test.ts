import { describe, expect, it } from "vitest";
import { calculateOvulation } from "@/lib/converters/health/ovulation-calculator";

describe("calculateOvulation", () => {
  describe("null for invalid inputs", () => {
    it("returns null for cycleLength < 21", () => {
      expect(calculateOvulation({ lastPeriodDate: "2024-01-01", cycleLength: 20 })).toBeNull();
    });

    it("returns null for cycleLength > 40", () => {
      expect(calculateOvulation({ lastPeriodDate: "2024-01-01", cycleLength: 41 })).toBeNull();
    });

    it("returns null for invalid date string", () => {
      expect(calculateOvulation({ lastPeriodDate: "not-a-date", cycleLength: 28 })).toBeNull();
    });
  });

  describe("28-day cycle starting 2024-01-01", () => {
    it("ovulation occurs on day 14 of cycle (2024-01-15)", () => {
      // Ovulation = LMP + (cycleLength - 14) = 2024-01-01 + 14 days = 2024-01-15
      const result = calculateOvulation({
        lastPeriodDate: "2024-01-01",
        cycleLength: 28,
      });
      expect(result).not.toBeNull();
      expect(result!.ovulationDate).toBe("2024-01-15");
    });

    it("fertile window starts 5 days before ovulation (2024-01-10)", () => {
      const result = calculateOvulation({
        lastPeriodDate: "2024-01-01",
        cycleLength: 28,
      });
      expect(result).not.toBeNull();
      expect(result!.fertileWindowStart).toBe("2024-01-10");
    });

    it("fertile window ends 1 day after ovulation (2024-01-16)", () => {
      const result = calculateOvulation({
        lastPeriodDate: "2024-01-01",
        cycleLength: 28,
      });
      expect(result).not.toBeNull();
      expect(result!.fertileWindowEnd).toBe("2024-01-16");
    });

    it("next period is 28 days after LMP (2024-01-29)", () => {
      const result = calculateOvulation({
        lastPeriodDate: "2024-01-01",
        cycleLength: 28,
      });
      expect(result).not.toBeNull();
      expect(result!.nextPeriodDate).toBe("2024-01-29");
    });
  });

  describe("fertile window details", () => {
    it("fertile window contains 7 entries (-5 to +1 from ovulation)", () => {
      const result = calculateOvulation({
        lastPeriodDate: "2024-01-01",
        cycleLength: 28,
      });
      expect(result).not.toBeNull();
      expect(result!.fertileWindow.length).toBe(7);
    });

    it("ovulation day has peak fertility", () => {
      const result = calculateOvulation({
        lastPeriodDate: "2024-01-01",
        cycleLength: 28,
      });
      expect(result).not.toBeNull();
      const peakDay = result!.fertileWindow.find((d) => d.fertility === "peak");
      expect(peakDay).toBeDefined();
      expect(peakDay!.date).toBe("2024-01-15");
    });
  });

  describe("upcoming cycles", () => {
    it("returns 6 upcoming cycles", () => {
      const result = calculateOvulation({
        lastPeriodDate: "2024-01-01",
        cycleLength: 28,
      });
      expect(result).not.toBeNull();
      expect(result!.upcomingCycles.length).toBe(6);
    });

    it("first upcoming cycle starts 28 days after LMP", () => {
      const result = calculateOvulation({
        lastPeriodDate: "2024-01-01",
        cycleLength: 28,
      });
      expect(result).not.toBeNull();
      expect(result!.upcomingCycles[0].periodStart).toBe("2024-01-29");
    });
  });
});
