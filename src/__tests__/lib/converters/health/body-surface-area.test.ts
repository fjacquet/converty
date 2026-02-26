import { describe, expect, it } from "vitest";
import { calculateBodySurfaceArea } from "@/lib/converters/health/body-surface-area";

describe("calculateBodySurfaceArea", () => {
  describe("null for invalid inputs", () => {
    it("returns null for height <= 0", () => {
      expect(calculateBodySurfaceArea({ weight: 70, height: 0 })).toBeNull();
    });

    it("returns null for weight <= 0", () => {
      expect(calculateBodySurfaceArea({ weight: 0, height: 175 })).toBeNull();
    });
  });

  describe("Mosteller formula", () => {
    it("calculates BSA for 70kg / 175cm using Mosteller formula", () => {
      // Mosteller: sqrt((175 * 70) / 3600) = sqrt(3.402...) ≈ 1.845
      const result = calculateBodySurfaceArea({ weight: 70, height: 175 });
      expect(result).not.toBeNull();
      expect(result!.mosteller).toBeCloseTo(1.845, 2);
    });
  });

  describe("all formulas return positive values", () => {
    it("returns positive values for all formulas", () => {
      const result = calculateBodySurfaceArea({ weight: 70, height: 175 });
      expect(result).not.toBeNull();
      expect(result!.duBois).toBeGreaterThan(0);
      expect(result!.mosteller).toBeGreaterThan(0);
      expect(result!.haycock).toBeGreaterThan(0);
      expect(result!.gehanGeorge).toBeGreaterThan(0);
      expect(result!.boyd).toBeGreaterThan(0);
      expect(result!.average).toBeGreaterThan(0);
    });

    it("average is between min and max of all formulas", () => {
      const result = calculateBodySurfaceArea({ weight: 70, height: 175 });
      expect(result).not.toBeNull();
      const vals = [
        result!.duBois,
        result!.mosteller,
        result!.haycock,
        result!.gehanGeorge,
        result!.boyd,
      ];
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      expect(result!.average).toBeGreaterThanOrEqual(min);
      expect(result!.average).toBeLessThanOrEqual(max);
    });
  });

  describe("BSA increases with weight and height", () => {
    it("larger person has larger BSA", () => {
      const small = calculateBodySurfaceArea({ weight: 50, height: 155 });
      const large = calculateBodySurfaceArea({ weight: 100, height: 190 });
      expect(small).not.toBeNull();
      expect(large).not.toBeNull();
      expect(large!.mosteller).toBeGreaterThan(small!.mosteller);
    });
  });
});
