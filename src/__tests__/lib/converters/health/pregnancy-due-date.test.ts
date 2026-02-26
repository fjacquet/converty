import { describe, expect, it } from "vitest";
import { calculateDueDate } from "@/lib/converters/health/pregnancy-due-date";

// Note: calculateDueDate uses new Date() for "today" when computing currentWeeks/daysRemaining.
// Tests verify arithmetic-deterministic fields (dueDate, conceptionDate, milestones).

describe("calculateDueDate", () => {
  describe("null for invalid inputs", () => {
    it("returns null for invalid date string", () => {
      expect(calculateDueDate({ calculationMethod: "lmp", date: "not-a-date" })).toBeNull();
    });
  });

  describe("LMP method — Naegele's rule (standard 28-day cycle)", () => {
    it("calculates due date as LMP + 280 days", () => {
      // LMP 2024-01-01 + 280 days = 2024-10-06
      const result = calculateDueDate({ calculationMethod: "lmp", date: "2024-01-01" });
      expect(result).not.toBeNull();
      expect(result!.dueDate).toBe("2024-10-06");
    });

    it("conception date is LMP + 14 days", () => {
      const result = calculateDueDate({ calculationMethod: "lmp", date: "2024-01-01" });
      expect(result).not.toBeNull();
      expect(result!.conceptionDate).toBe("2024-01-15");
    });
  });

  describe("conception method", () => {
    it("due date is conception + 266 days", () => {
      // 2024-01-01 + 266 days = 2024-09-23
      const result = calculateDueDate({ calculationMethod: "conception", date: "2024-01-01" });
      expect(result).not.toBeNull();
      const conception = new Date("2024-01-01");
      const expected = new Date(conception);
      expected.setDate(expected.getDate() + 266);
      expect(result!.dueDate).toBe(expected.toISOString().split("T")[0]);
    });
  });

  describe("milestones", () => {
    it("returns 11 milestone entries", () => {
      const result = calculateDueDate({ calculationMethod: "lmp", date: "2024-01-01" });
      expect(result).not.toBeNull();
      expect(result!.milestones.length).toBe(11);
    });

    it("milestone at week 40 has the due date", () => {
      const result = calculateDueDate({ calculationMethod: "lmp", date: "2024-01-01" });
      expect(result).not.toBeNull();
      const week40 = result!.milestones.find((m) => m.week === 40);
      expect(week40).toBeDefined();
      // Milestone week 40 = LMP + 40×7 = 2024-01-01 + 280 = 2024-10-06
      expect(week40!.date).toBe("2024-10-06");
    });
  });

  describe("cycleLength adjustment", () => {
    it("longer cycle shifts due date later", () => {
      const standard = calculateDueDate({ calculationMethod: "lmp", date: "2024-01-01" });
      const longCycle = calculateDueDate({
        calculationMethod: "lmp",
        date: "2024-01-01",
        cycleLength: 35,
      });
      expect(standard).not.toBeNull();
      expect(longCycle).not.toBeNull();
      expect(longCycle!.dueDate > standard!.dueDate).toBe(true);
    });
  });
});
