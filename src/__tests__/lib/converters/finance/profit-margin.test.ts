import { describe, expect, it } from "vitest";
import { calculateProfitMargin } from "@/lib/converters/finance/profit-margin";

describe("calculateProfitMargin", () => {
  describe("null returns for invalid input", () => {
    it("returns null for zero revenue", () => {
      expect(calculateProfitMargin({ revenue: 0, costOfGoodsSold: 500 })).toBeNull();
    });

    it("returns null for negative revenue", () => {
      expect(calculateProfitMargin({ revenue: -100, costOfGoodsSold: 50 })).toBeNull();
    });

    it("returns null for negative costOfGoodsSold", () => {
      expect(calculateProfitMargin({ revenue: 1000, costOfGoodsSold: -200 })).toBeNull();
    });
  });

  describe("gross margin calculation", () => {
    it("revenue=$1000, cost=$600 → gross margin = 40%", () => {
      const result = calculateProfitMargin({ revenue: 1000, costOfGoodsSold: 600 });
      expect(result).not.toBeNull();
      expect(result!.grossMargin).toBeCloseTo(40, 2);
    });

    it("grossProfit = revenue - costOfGoodsSold", () => {
      const result = calculateProfitMargin({ revenue: 1000, costOfGoodsSold: 600 });
      expect(result).not.toBeNull();
      expect(result!.grossProfit).toBeCloseTo(400, 2);
    });

    it("100% margin when cost is 0", () => {
      const result = calculateProfitMargin({ revenue: 1000, costOfGoodsSold: 0 });
      expect(result).not.toBeNull();
      expect(result!.grossMargin).toBeCloseTo(100, 2);
    });
  });

  describe("operating margin (with operating expenses)", () => {
    it("provides operating margin when operatingExpenses provided", () => {
      const result = calculateProfitMargin({
        revenue: 1000,
        costOfGoodsSold: 400,
        operatingExpenses: 200,
      });
      expect(result).not.toBeNull();
      expect(result!.operatingMargin).toBeDefined();
      // grossProfit = 600, operating = 600 - 200 = 400, margin = 40%
      expect(result!.operatingMargin).toBeCloseTo(40, 2);
    });

    it("operatingProfit = grossProfit - operatingExpenses", () => {
      const result = calculateProfitMargin({
        revenue: 1000,
        costOfGoodsSold: 400,
        operatingExpenses: 150,
      });
      expect(result).not.toBeNull();
      expect(result!.operatingProfit).toBeCloseTo(450, 2);
    });
  });

  describe("net margin (with taxes)", () => {
    it("provides net margin when both operatingExpenses and taxes provided", () => {
      const result = calculateProfitMargin({
        revenue: 1000,
        costOfGoodsSold: 400,
        operatingExpenses: 200,
        taxes: 100,
      });
      expect(result).not.toBeNull();
      expect(result!.netMargin).toBeDefined();
      // netProfit = 300, netMargin = 30%
      expect(result!.netMargin).toBeCloseTo(30, 2);
    });
  });

  describe("markup field", () => {
    it("markup is zero when costOfGoodsSold is zero", () => {
      const result = calculateProfitMargin({ revenue: 1000, costOfGoodsSold: 0 });
      expect(result).not.toBeNull();
      expect(result!.markup).toBe(0);
    });

    it("markup = (grossProfit / cost) × 100", () => {
      // revenue=1000, cost=600, profit=400, markup = 400/600 * 100 ≈ 66.67%
      const result = calculateProfitMargin({ revenue: 1000, costOfGoodsSold: 600 });
      expect(result).not.toBeNull();
      expect(result!.markup).toBeCloseTo(66.67, 1);
    });
  });
});
