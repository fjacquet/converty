import { describe, expect, it } from "vitest";
import { calculateBodyFat } from "@/lib/converters/health/body-fat";

describe("calculateBodyFat", () => {
  describe("null for invalid inputs", () => {
    it("returns null for weight <= 0", () => {
      expect(
        calculateBodyFat({
          gender: "male",
          age: 25,
          weight: 0,
          height: 175,
          neck: 38,
          waist: 80,
        })
      ).toBeNull();
    });

    it("returns null for height <= 0", () => {
      expect(
        calculateBodyFat({
          gender: "male",
          age: 25,
          weight: 70,
          height: 0,
          neck: 38,
          waist: 80,
        })
      ).toBeNull();
    });

    it("returns null for neck <= 0", () => {
      expect(
        calculateBodyFat({
          gender: "male",
          age: 25,
          weight: 70,
          height: 175,
          neck: 0,
          waist: 80,
        })
      ).toBeNull();
    });

    it("returns null for female without hip", () => {
      expect(
        calculateBodyFat({
          gender: "female",
          age: 25,
          weight: 60,
          height: 165,
          neck: 33,
          waist: 70,
        })
      ).toBeNull();
    });
  });

  describe("male Navy method calculation", () => {
    it("calculates body fat for a male", () => {
      const result = calculateBodyFat({
        gender: "male",
        age: 25,
        weight: 80,
        height: 175,
        neck: 38,
        waist: 85,
      });
      expect(result).not.toBeNull();
      expect(result!.bodyFatPercent).toBeGreaterThan(0);
      expect(result!.bodyFatPercent).toBeLessThanOrEqual(60);
    });

    it("returns fat mass and lean mass that sum to weight", () => {
      const result = calculateBodyFat({
        gender: "male",
        age: 30,
        weight: 80,
        height: 175,
        neck: 38,
        waist: 85,
      });
      expect(result).not.toBeNull();
      expect(result!.fatMass + result!.leanMass).toBeCloseTo(80, 2);
    });

    it("returns category for male", () => {
      const result = calculateBodyFat({
        gender: "male",
        age: 25,
        weight: 75,
        height: 175,
        neck: 38,
        waist: 80,
      });
      expect(result).not.toBeNull();
      expect(["essential", "athletes", "fitness", "average", "obese"]).toContain(result!.category);
    });
  });

  describe("female Navy method calculation", () => {
    it("calculates body fat for a female", () => {
      const result = calculateBodyFat({
        gender: "female",
        age: 25,
        weight: 60,
        height: 165,
        neck: 33,
        waist: 70,
        hip: 95,
      });
      expect(result).not.toBeNull();
      expect(result!.bodyFatPercent).toBeGreaterThan(0);
      expect(result!.bodyFatPercent).toBeLessThanOrEqual(60);
    });

    it("idealBodyFatMin/Max differ for male vs female", () => {
      const maleResult = calculateBodyFat({
        gender: "male",
        age: 25,
        weight: 75,
        height: 175,
        neck: 38,
        waist: 80,
      });
      const femaleResult = calculateBodyFat({
        gender: "female",
        age: 25,
        weight: 60,
        height: 165,
        neck: 33,
        waist: 70,
        hip: 95,
      });
      expect(maleResult).not.toBeNull();
      expect(femaleResult).not.toBeNull();
      expect(femaleResult!.idealBodyFatMin).toBeGreaterThan(maleResult!.idealBodyFatMin);
    });
  });
});
