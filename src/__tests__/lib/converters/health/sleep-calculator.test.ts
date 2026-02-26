import { describe, expect, it } from "vitest";
import { calculateSleep } from "@/lib/converters/health/sleep-calculator";

// Note: calculateSleep uses new Date() internally only for time formatting (hour formatting),
// not for any calculation logic. Results are structurally deterministic for a given age.

describe("calculateSleep", () => {
  describe("null for invalid inputs", () => {
    it("returns null for age <= 0", () => {
      expect(calculateSleep({ mode: "bedTime", targetTime: "22:00", age: 0 })).toBeNull();
    });

    it("returns null for age > 120", () => {
      expect(calculateSleep({ mode: "bedTime", targetTime: "22:00", age: 121 })).toBeNull();
    });

    it("returns null for invalid time format", () => {
      expect(calculateSleep({ mode: "bedTime", targetTime: "not-a-time", age: 30 })).toBeNull();
    });
  });

  describe("recommended hours by age", () => {
    it.each([
      [30, { min: 7, max: 9 }], // Adult (18-64)
      [70, { min: 7, max: 8 }], // Senior (65+)
      [15, { min: 8, max: 10 }], // Teen (13-17)
      [10, { min: 9, max: 11 }], // Child (6-12)
    ])("age %i gets recommended hours min=%i max=%i", (age, expected) => {
      const result = calculateSleep({ mode: "bedTime", targetTime: "22:00", age });
      expect(result).not.toBeNull();
      expect(result!.recommendedHours.min).toBe(expected.min);
      expect(result!.recommendedHours.max).toBe(expected.max);
    });
  });

  describe("sleep cycle times", () => {
    it("returns 4 cycle time entries (4, 5, 6, 7 cycles)", () => {
      const result = calculateSleep({ mode: "bedTime", targetTime: "23:00", age: 30 });
      expect(result).not.toBeNull();
      expect(result!.cycleTimes.length).toBe(4);
      const cycles = result!.cycleTimes.map((c) => c.cycles);
      expect(cycles).toContain(4);
      expect(cycles).toContain(5);
      expect(cycles).toContain(6);
      expect(cycles).toContain(7);
    });

    it("5 and 6 cycle entries have optimal quality", () => {
      const result = calculateSleep({ mode: "wakeTime", targetTime: "07:00", age: 30 });
      expect(result).not.toBeNull();
      const optimal = result!.cycleTimes.filter((c) => c.quality === "optimal");
      const cycleNums = optimal.map((c) => c.cycles);
      expect(cycleNums).toContain(5);
      expect(cycleNums).toContain(6);
    });

    it("4-cycle entry has fair quality", () => {
      const result = calculateSleep({ mode: "bedTime", targetTime: "23:00", age: 30 });
      expect(result).not.toBeNull();
      const fair = result!.cycleTimes.find((c) => c.cycles === 4);
      expect(fair!.quality).toBe("fair");
    });
  });

  describe("duration strings", () => {
    it("each cycle time has a duration string", () => {
      const result = calculateSleep({ mode: "bedTime", targetTime: "22:00", age: 30 });
      expect(result).not.toBeNull();
      for (const ct of result!.cycleTimes) {
        expect(ct.duration).toMatch(/\d+h \d+m/);
      }
    });
  });

  describe("sleep tips and stages", () => {
    it("returns tip keys array", () => {
      const result = calculateSleep({ mode: "bedTime", targetTime: "22:00", age: 30 });
      expect(result).not.toBeNull();
      expect(result!.tips.length).toBeGreaterThan(0);
    });

    it("returns 4 sleep stages", () => {
      const result = calculateSleep({ mode: "bedTime", targetTime: "22:00", age: 30 });
      expect(result).not.toBeNull();
      expect(result!.sleepStages.length).toBe(4);
    });
  });
});
