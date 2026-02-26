import { describe, expect, it } from "vitest";
import { calculatePregnancyWeightGain } from "@/lib/converters/health/pregnancy-weight-gain";

describe("calculatePregnancyWeightGain", () => {
  describe("null for invalid inputs", () => {
    it("returns null for prePregnancyWeight <= 0", () => {
      expect(
        calculatePregnancyWeightGain({
          prePregnancyWeight: 0,
          currentWeight: 65,
          height: 165,
          weeksPregnant: 20,
          twins: false,
        })
      ).toBeNull();
    });

    it("returns null for height <= 0", () => {
      expect(
        calculatePregnancyWeightGain({
          prePregnancyWeight: 60,
          currentWeight: 65,
          height: 0,
          weeksPregnant: 20,
          twins: false,
        })
      ).toBeNull();
    });

    it("returns null for weeksPregnant > 42", () => {
      expect(
        calculatePregnancyWeightGain({
          prePregnancyWeight: 60,
          currentWeight: 65,
          height: 165,
          weeksPregnant: 43,
          twins: false,
        })
      ).toBeNull();
    });
  });

  describe("normal BMI — recommended gain 11.3-15.9 kg", () => {
    it("normal BMI classification and recommended range", () => {
      // BMI = 60 / (1.65)^2 = 60 / 2.7225 ≈ 22.0 → normal
      const result = calculatePregnancyWeightGain({
        prePregnancyWeight: 60,
        currentWeight: 67,
        height: 165,
        weeksPregnant: 20,
        twins: false,
      });
      expect(result).not.toBeNull();
      expect(result!.bmiCategory).toBe("normal");
      expect(result!.recommendedGainMin).toBeCloseTo(11.3, 1);
      expect(result!.recommendedGainMax).toBeCloseTo(15.9, 1);
    });
  });

  describe("underweight BMI — higher gain range", () => {
    it("underweight BMI has higher recommended gain than normal", () => {
      // BMI = 45 / (1.65)^2 ≈ 16.5 → underweight
      const underweight = calculatePregnancyWeightGain({
        prePregnancyWeight: 45,
        currentWeight: 50,
        height: 165,
        weeksPregnant: 20,
        twins: false,
      });
      // BMI = 60 / (1.65)^2 ≈ 22.0 → normal
      const normal = calculatePregnancyWeightGain({
        prePregnancyWeight: 60,
        currentWeight: 67,
        height: 165,
        weeksPregnant: 20,
        twins: false,
      });
      expect(underweight).not.toBeNull();
      expect(normal).not.toBeNull();
      expect(underweight!.bmiCategory).toBe("underweight");
      expect(underweight!.recommendedGainMin).toBeGreaterThan(normal!.recommendedGainMin);
    });
  });

  describe("overweight BMI — lower gain range", () => {
    it("overweight BMI has lower recommended gain than normal", () => {
      // BMI = 80 / (1.65)^2 ≈ 29.4 → overweight
      const overweight = calculatePregnancyWeightGain({
        prePregnancyWeight: 80,
        currentWeight: 85,
        height: 165,
        weeksPregnant: 20,
        twins: false,
      });
      const normal = calculatePregnancyWeightGain({
        prePregnancyWeight: 60,
        currentWeight: 67,
        height: 165,
        weeksPregnant: 20,
        twins: false,
      });
      expect(overweight).not.toBeNull();
      expect(normal).not.toBeNull();
      expect(overweight!.bmiCategory).toBe("overweight");
      expect(overweight!.recommendedGainMax).toBeLessThan(normal!.recommendedGainMax);
    });
  });

  describe("current weight gain", () => {
    it("currentWeightGain = currentWeight - prePregnancyWeight", () => {
      const result = calculatePregnancyWeightGain({
        prePregnancyWeight: 60,
        currentWeight: 67,
        height: 165,
        weeksPregnant: 20,
        twins: false,
      });
      expect(result).not.toBeNull();
      expect(result!.currentWeightGain).toBeCloseTo(7, 1);
    });
  });
});
