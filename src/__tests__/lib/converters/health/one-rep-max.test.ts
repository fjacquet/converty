import { describe, expect, it } from "vitest";
import { calculateOneRepMax } from "@/lib/converters/health/one-rep-max";

describe("calculateOneRepMax", () => {
  describe("null for invalid inputs", () => {
    it("returns null for weight <= 0", () => {
      expect(calculateOneRepMax({ weight: 0, reps: 5 })).toBeNull();
    });

    it("returns null for reps <= 0", () => {
      expect(calculateOneRepMax({ weight: 100, reps: 0 })).toBeNull();
    });

    it("returns null for reps > 30", () => {
      expect(calculateOneRepMax({ weight: 100, reps: 31 })).toBeNull();
    });
  });

  describe("Epley formula", () => {
    it("calculates Epley 1RM for 100kg × 5 reps", () => {
      // Epley: 100 × (1 + 5/30) = 100 × 1.1667 ≈ 116.67
      const result = calculateOneRepMax({ weight: 100, reps: 5 });
      expect(result).not.toBeNull();
      expect(result!.epley).toBeCloseTo(116.67, 1);
    });
  });

  describe("Brzycki formula", () => {
    it("calculates Brzycki 1RM for 100kg × 5 reps", () => {
      // Brzycki: 100 × (36 / (37 - 5)) = 100 × (36/32) = 112.5
      const result = calculateOneRepMax({ weight: 100, reps: 5 });
      expect(result).not.toBeNull();
      expect(result!.brzycki).toBeCloseTo(112.5, 1);
    });
  });

  describe("Epley vs Brzycki give different results", () => {
    it("Epley and Brzycki formulas differ", () => {
      const result = calculateOneRepMax({ weight: 100, reps: 5 });
      expect(result).not.toBeNull();
      expect(result!.epley).not.toBe(result!.brzycki);
    });
  });

  describe("all 7 formulas return positive values", () => {
    it("all formula values are positive", () => {
      const result = calculateOneRepMax({ weight: 100, reps: 5 });
      expect(result).not.toBeNull();
      expect(result!.epley).toBeGreaterThan(0);
      expect(result!.brzycki).toBeGreaterThan(0);
      expect(result!.lander).toBeGreaterThan(0);
      expect(result!.lombardi).toBeGreaterThan(0);
      expect(result!.mayhew).toBeGreaterThan(0);
      expect(result!.oconner).toBeGreaterThan(0);
      expect(result!.wathan).toBeGreaterThan(0);
    });
  });

  describe("percentage table", () => {
    it("returns percentages array with 9 entries", () => {
      const result = calculateOneRepMax({ weight: 100, reps: 5 });
      expect(result).not.toBeNull();
      expect(result!.percentages.length).toBe(9);
    });

    it("100% percentage weight equals average", () => {
      const result = calculateOneRepMax({ weight: 100, reps: 5 });
      expect(result).not.toBeNull();
      const fullEntry = result!.percentages.find((p) => p.percent === 100);
      expect(fullEntry).toBeDefined();
      expect(fullEntry!.weight).toBeCloseTo(result!.average, 2);
    });

    it("heavier lift gives higher 1RM estimate", () => {
      const light = calculateOneRepMax({ weight: 60, reps: 5 });
      const heavy = calculateOneRepMax({ weight: 120, reps: 5 });
      expect(light).not.toBeNull();
      expect(heavy).not.toBeNull();
      expect(heavy!.average).toBeGreaterThan(light!.average);
    });
  });
});
