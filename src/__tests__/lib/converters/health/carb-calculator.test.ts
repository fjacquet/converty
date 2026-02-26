import { describe, expect, it } from "vitest";
import { calculateCarbs } from "@/lib/converters/health/carb-calculator";

describe("calculateCarbs", () => {
  describe("null for invalid inputs", () => {
    it("returns null for calories <= 0", () => {
      expect(
        calculateCarbs({ calories: 0, goal: "maintenance", activityLevel: "sedentary" })
      ).toBeNull();
    });
  });

  describe("maintenance goal calculation", () => {
    it("calculates carb grams for 2000kcal maintenance sedentary", () => {
      // maintenance 45% - 5% sedentary adjustment = 40%
      // 2000 * 0.40 / 4 = 200g carbs
      const result = calculateCarbs({
        calories: 2000,
        goal: "maintenance",
        activityLevel: "sedentary",
      });
      expect(result).not.toBeNull();
      expect(result!.dailyCarbGrams).toBeCloseTo(200, 0);
      expect(result!.carbPercent).toBe(40);
    });
  });

  describe("keto goal keeps carbs very low", () => {
    it("keto goal gives < 30g carbs per 2000 calories", () => {
      // keto: 5% - 5% sedentary = 5% (min clamped)
      // 2000 * 0.05 / 4 = 25g
      const result = calculateCarbs({
        calories: 2000,
        goal: "keto",
        activityLevel: "sedentary",
      });
      expect(result).not.toBeNull();
      expect(result!.dailyCarbGrams).toBeLessThan(30);
    });
  });

  describe("athlete goal maximizes carbs", () => {
    it("athlete goal + athlete activity gives more carbs than sedentary maintenance", () => {
      const athlete = calculateCarbs({
        calories: 2000,
        goal: "athlete",
        activityLevel: "athlete",
      });
      const sedentary = calculateCarbs({
        calories: 2000,
        goal: "maintenance",
        activityLevel: "sedentary",
      });
      expect(athlete).not.toBeNull();
      expect(sedentary).not.toBeNull();
      expect(athlete!.dailyCarbGrams).toBeGreaterThan(sedentary!.dailyCarbGrams);
    });
  });

  describe("result structure", () => {
    it("dailyCarbCalories = dailyCarbGrams × 4", () => {
      const result = calculateCarbs({
        calories: 2000,
        goal: "muscleGain",
        activityLevel: "moderate",
      });
      expect(result).not.toBeNull();
      expect(result!.dailyCarbCalories).toBeCloseTo(result!.dailyCarbGrams * 4, 1);
    });

    it("returns food source keys", () => {
      const result = calculateCarbs({
        calories: 2000,
        goal: "maintenance",
        activityLevel: "moderate",
      });
      expect(result).not.toBeNull();
      expect(result!.foodSourceKeys.complex.length).toBeGreaterThan(0);
      expect(result!.foodSourceKeys.avoid.length).toBeGreaterThan(0);
    });
  });
});
