import { describe, expect, it } from "vitest";
import { calculateBreakEven } from "@/lib/converters/finance/break-even";

describe("calculateBreakEven", () => {
  describe("null returns for invalid input", () => {
    it("returns null when price equals variable cost (zero contribution margin)", () => {
      expect(
        calculateBreakEven({
          fixedCosts: 10000,
          variableCostPerUnit: 50,
          pricePerUnit: 50,
        })
      ).toBeNull();
    });

    it("returns null when price is less than variable cost", () => {
      expect(
        calculateBreakEven({
          fixedCosts: 10000,
          variableCostPerUnit: 60,
          pricePerUnit: 50,
        })
      ).toBeNull();
    });

    it("returns null for zero price per unit", () => {
      expect(
        calculateBreakEven({
          fixedCosts: 10000,
          variableCostPerUnit: 0,
          pricePerUnit: 0,
        })
      ).toBeNull();
    });

    it("returns null for negative fixed costs", () => {
      expect(
        calculateBreakEven({
          fixedCosts: -100,
          variableCostPerUnit: 30,
          pricePerUnit: 50,
        })
      ).toBeNull();
    });
  });

  describe("basic break-even calculation", () => {
    it("fixed=10000, price=50, variable=30 → break-even=500 units", () => {
      const result = calculateBreakEven({
        fixedCosts: 10000,
        variableCostPerUnit: 30,
        pricePerUnit: 50,
      });
      expect(result).not.toBeNull();
      expect(result!.breakEvenUnits).toBeCloseTo(500, 0);
    });

    it("higher fixed costs → more units needed to break even", () => {
      const low = calculateBreakEven({
        fixedCosts: 5000,
        variableCostPerUnit: 20,
        pricePerUnit: 50,
      });
      const high = calculateBreakEven({
        fixedCosts: 20000,
        variableCostPerUnit: 20,
        pricePerUnit: 50,
      });
      expect(low).not.toBeNull();
      expect(high).not.toBeNull();
      expect(high!.breakEvenUnits).toBeGreaterThan(low!.breakEvenUnits);
    });

    it("breakEvenRevenue = breakEvenUnits × pricePerUnit", () => {
      const result = calculateBreakEven({
        fixedCosts: 10000,
        variableCostPerUnit: 30,
        pricePerUnit: 50,
      });
      expect(result).not.toBeNull();
      expect(result!.breakEvenRevenue).toBeCloseTo(result!.breakEvenUnits * 50, 0);
    });

    it("contributionMargin = pricePerUnit - variableCostPerUnit", () => {
      const result = calculateBreakEven({
        fixedCosts: 10000,
        variableCostPerUnit: 30,
        pricePerUnit: 50,
      });
      expect(result).not.toBeNull();
      expect(result!.contributionMargin).toBeCloseTo(20, 2);
    });

    it("profitAtUnits array is non-empty", () => {
      const result = calculateBreakEven({
        fixedCosts: 10000,
        variableCostPerUnit: 30,
        pricePerUnit: 50,
      });
      expect(result).not.toBeNull();
      expect(result!.profitAtUnits).toBeDefined();
      expect(result!.profitAtUnits!.length).toBeGreaterThan(0);
    });
  });
});
