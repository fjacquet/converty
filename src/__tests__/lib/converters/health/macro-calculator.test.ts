import { describe, expect, it } from "vitest";
import { calculateMacros } from "@/lib/converters/health/macro-calculator";

describe("calculateMacros", () => {
  describe("null for invalid inputs", () => {
    it("returns null for calories <= 0", () => {
      expect(calculateMacros({ calories: 0, goal: "maintenance" })).toBeNull();
    });
  });

  describe("maintenance goal (30/40/30 split)", () => {
    it("calculates macros for 2000kcal maintenance", () => {
      const result = calculateMacros({ calories: 2000, goal: "maintenance" });
      expect(result).not.toBeNull();
      // protein: 30% = 600kcal / 4 = 150g
      expect(result!.proteinGrams).toBeCloseTo(150, 1);
      // carbs: 40% = 800kcal / 4 = 200g
      expect(result!.carbsGrams).toBeCloseTo(200, 1);
      // fat: 30% = 600kcal / 9 ≈ 66.67g
      expect(result!.fatGrams).toBeCloseTo(66.67, 1);
    });
  });

  describe("macro calorie totals", () => {
    it("protein + carb + fat calories sum to total calories", () => {
      const result = calculateMacros({ calories: 2000, goal: "maintenance" });
      expect(result).not.toBeNull();
      const total = result!.proteinCalories + result!.carbsCalories + result!.fatCalories;
      expect(total).toBeCloseTo(2000, 0);
    });
  });

  describe("macro percentages sum to 100", () => {
    it.each([
      "maintenance",
      "cutting",
      "bulking",
      "keto",
      "highProtein",
    ] as const)("goal %s percentages sum to 100", (goal) => {
      const result = calculateMacros({ calories: 2000, goal });
      expect(result).not.toBeNull();
      const total = result!.proteinPercent + result!.carbsPercent + result!.fatPercent;
      expect(total).toBe(100);
    });
  });

  describe("keto goal minimizes carbs", () => {
    it("keto has lowest carb percentage", () => {
      const keto = calculateMacros({ calories: 2000, goal: "keto" });
      const maintenance = calculateMacros({ calories: 2000, goal: "maintenance" });
      expect(keto).not.toBeNull();
      expect(maintenance).not.toBeNull();
      expect(keto!.carbsPercent).toBeLessThan(maintenance!.carbsPercent);
    });
  });

  describe("meals breakdown", () => {
    it("returns breakdown for 3, 4, 5, 6 meals", () => {
      const result = calculateMacros({ calories: 2000, goal: "maintenance" });
      expect(result).not.toBeNull();
      expect(result!.mealsBreakdown.length).toBe(4);
      expect(result!.mealsBreakdown[0].meals).toBe(3);
      expect(result!.mealsBreakdown[3].meals).toBe(6);
    });

    it("protein per meal decreases as meal count increases", () => {
      const result = calculateMacros({ calories: 2000, goal: "maintenance" });
      expect(result).not.toBeNull();
      const threeM = result!.mealsBreakdown.find((m) => m.meals === 3)!.protein;
      const sixM = result!.mealsBreakdown.find((m) => m.meals === 6)!.protein;
      expect(sixM).toBeLessThan(threeM);
    });
  });
});
