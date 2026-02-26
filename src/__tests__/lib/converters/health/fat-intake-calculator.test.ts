import { describe, expect, it } from "vitest";
import { calculateFatIntake } from "@/lib/converters/health/fat-intake-calculator";

describe("calculateFatIntake", () => {
  describe("null for invalid inputs", () => {
    it("returns null for calories <= 0", () => {
      expect(calculateFatIntake({ calories: 0, goal: "maintenance" })).toBeNull();
    });
  });

  describe("maintenance goal calculation", () => {
    it("calculates fat grams for 2000kcal maintenance (30% fat)", () => {
      // 2000 * 0.30 / 9 ≈ 66.67g
      const result = calculateFatIntake({ calories: 2000, goal: "maintenance" });
      expect(result).not.toBeNull();
      expect(result!.dailyFatGrams).toBeCloseTo(66.67, 1);
      expect(result!.fatPercent).toBe(30);
    });
  });

  describe("keto goal maximizes fat", () => {
    it("keto gives 70% fat", () => {
      // 2000 * 0.70 / 9 ≈ 155.56g
      const result = calculateFatIntake({ calories: 2000, goal: "keto" });
      expect(result).not.toBeNull();
      expect(result!.fatPercent).toBe(70);
      expect(result!.dailyFatGrams).toBeCloseTo(155.56, 1);
    });
  });

  describe("fat calorie calculations", () => {
    it("dailyFatCalories = dailyFatGrams × 9", () => {
      const result = calculateFatIntake({ calories: 2000, goal: "maintenance" });
      expect(result).not.toBeNull();
      expect(result!.dailyFatCalories).toBeCloseTo(result!.dailyFatGrams * 9, 1);
    });
  });

  describe("breakdown sums to 100%", () => {
    it("saturated + monounsaturated + polyunsaturated = 100%", () => {
      const result = calculateFatIntake({ calories: 2000, goal: "maintenance" });
      expect(result).not.toBeNull();
      const total =
        result!.breakdown.saturated.percent +
        result!.breakdown.monounsaturated.percent +
        result!.breakdown.polyunsaturated.percent;
      expect(total).toBe(100);
    });
  });

  describe("food source keys", () => {
    it("returns healthy, limit, and avoid food keys", () => {
      const result = calculateFatIntake({ calories: 2000, goal: "maintenance" });
      expect(result).not.toBeNull();
      expect(result!.foodSourceKeys.healthy.length).toBeGreaterThan(0);
      expect(result!.foodSourceKeys.limit.length).toBeGreaterThan(0);
      expect(result!.foodSourceKeys.avoid.length).toBeGreaterThan(0);
    });
  });
});
