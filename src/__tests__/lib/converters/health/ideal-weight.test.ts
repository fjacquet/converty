import { describe, expect, it } from "vitest";
import { calculateIdealWeight } from "@/lib/converters/health/ideal-weight";

describe("calculateIdealWeight", () => {
  describe("null for invalid inputs", () => {
    it("returns null for height <= 0", () => {
      expect(calculateIdealWeight({ gender: "male", height: 0, frameSize: "medium" })).toBeNull();
    });
  });

  describe("male formulas", () => {
    it("calculates Devine formula for male 180cm (medium frame)", () => {
      // heightInches = 180 / 2.54 = 70.87, over5feet = 70.87 - 60 = 10.87
      // Devine male: 50 + 2.3 × 10.87 ≈ 75.0, medium: × 1.0 = 75.0
      const result = calculateIdealWeight({ gender: "male", height: 180, frameSize: "medium" });
      expect(result).not.toBeNull();
      expect(result!.devine).toBeCloseTo(75.0, 0);
    });

    it("male ideal weight is higher than female for same height", () => {
      const male = calculateIdealWeight({ gender: "male", height: 175, frameSize: "medium" });
      const female = calculateIdealWeight({
        gender: "female",
        height: 175,
        frameSize: "medium",
      });
      expect(male).not.toBeNull();
      expect(female).not.toBeNull();
      expect(male!.devine).toBeGreaterThan(female!.devine);
    });
  });

  describe("frame size adjustments", () => {
    it.each([
      ["small", 0.9],
      ["large", 1.1],
    ])("frame size %s applies adjustment factor %s", (frameSize, factor) => {
      const medium = calculateIdealWeight({
        gender: "male",
        height: 175,
        frameSize: "medium",
      });
      const adjusted = calculateIdealWeight({
        gender: "male",
        height: 175,
        frameSize: frameSize as "small" | "large",
      });
      expect(medium).not.toBeNull();
      expect(adjusted).not.toBeNull();
      expect(adjusted!.devine).toBeCloseTo(medium!.devine * factor, 1);
    });
  });

  describe("BMI-based range", () => {
    it("bmiBasedMin corresponds to BMI 18.5", () => {
      const result = calculateIdealWeight({ gender: "male", height: 175, frameSize: "medium" });
      expect(result).not.toBeNull();
      const heightM = 1.75;
      expect(result!.bmiBasedMin).toBeCloseTo(18.5 * heightM * heightM, 1);
    });

    it("bmiBasedMax corresponds to BMI 24.9", () => {
      const result = calculateIdealWeight({ gender: "male", height: 175, frameSize: "medium" });
      expect(result).not.toBeNull();
      const heightM = 1.75;
      expect(result!.bmiBasedMax).toBeCloseTo(24.9 * heightM * heightM, 1);
    });
  });

  describe("all four formulas return positive values", () => {
    it("returns positive robinson, miller, devine, hamwi", () => {
      const result = calculateIdealWeight({ gender: "female", height: 165, frameSize: "medium" });
      expect(result).not.toBeNull();
      expect(result!.robinson).toBeGreaterThan(0);
      expect(result!.miller).toBeGreaterThan(0);
      expect(result!.devine).toBeGreaterThan(0);
      expect(result!.hamwi).toBeGreaterThan(0);
    });
  });
});
