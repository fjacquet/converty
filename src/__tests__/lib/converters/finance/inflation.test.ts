import { describe, expect, it } from "vitest";
import { calculateInflation } from "@/lib/converters/finance/inflation";

describe("calculateInflation", () => {
  describe("null returns for invalid input", () => {
    it("returns null for zero amount", () => {
      expect(calculateInflation({ amount: 0, inflationRate: 3, years: 10 })).toBeNull();
    });

    it("returns null for negative amount", () => {
      expect(calculateInflation({ amount: -100, inflationRate: 3, years: 10 })).toBeNull();
    });

    it("returns null for negative years", () => {
      expect(calculateInflation({ amount: 100, inflationRate: 3, years: -1 })).toBeNull();
    });

    it("returns null for years > 100", () => {
      expect(calculateInflation({ amount: 100, inflationRate: 3, years: 101 })).toBeNull();
    });
  });

  describe("inflation calculation", () => {
    it("$100 at 3% for 10 years → futureValue ≈ $134", () => {
      const result = calculateInflation({ amount: 100, inflationRate: 3, years: 10 });
      expect(result).not.toBeNull();
      // 100 * (1.03)^10 ≈ 134.39
      expect(result!.futureValue).toBeCloseTo(134, 0);
    });

    it("0% inflation → futureValue equals amount", () => {
      const result = calculateInflation({ amount: 100, inflationRate: 0, years: 10 });
      expect(result).not.toBeNull();
      expect(result!.futureValue).toBeCloseTo(100, 2);
    });

    it("higher inflation rate → larger future value", () => {
      const low = calculateInflation({ amount: 100, inflationRate: 2, years: 10 });
      const high = calculateInflation({ amount: 100, inflationRate: 5, years: 10 });
      expect(low).not.toBeNull();
      expect(high).not.toBeNull();
      expect(high!.futureValue).toBeGreaterThan(low!.futureValue);
    });

    it("purchasingPowerLoss is positive for positive inflation", () => {
      const result = calculateInflation({ amount: 1000, inflationRate: 3, years: 10 });
      expect(result).not.toBeNull();
      expect(result!.purchasingPowerLoss).toBeGreaterThan(0);
    });

    it("yearlyBreakdown has correct number of entries", () => {
      const result = calculateInflation({ amount: 100, inflationRate: 3, years: 5 });
      expect(result).not.toBeNull();
      expect(result!.yearlyBreakdown).toHaveLength(5);
    });

    it("yearlyBreakdown values increase each year", () => {
      const result = calculateInflation({ amount: 100, inflationRate: 3, years: 3 });
      expect(result).not.toBeNull();
      const values = result!.yearlyBreakdown.map((e) => e.value);
      expect(values[1]).toBeGreaterThan(values[0]);
      expect(values[2]).toBeGreaterThan(values[1]);
    });
  });
});
