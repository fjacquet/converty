import { describe, expect, it } from "vitest";
import { calculateRoi } from "@/lib/converters/finance/roi";

describe("calculateRoi", () => {
  describe("null returns for invalid input", () => {
    it("returns null for zero initial investment", () => {
      expect(calculateRoi({ initialInvestment: 0, finalValue: 1500 })).toBeNull();
    });

    it("returns null for negative initial investment", () => {
      expect(calculateRoi({ initialInvestment: -100, finalValue: 1500 })).toBeNull();
    });

    it("returns null for negative final value", () => {
      expect(calculateRoi({ initialInvestment: 1000, finalValue: -100 })).toBeNull();
    });
  });

  describe("basic ROI calculation", () => {
    it("gain=$1500, cost=$1000 → ROI = 50%", () => {
      const result = calculateRoi({ initialInvestment: 1000, finalValue: 1500 });
      expect(result).not.toBeNull();
      expect(result!.roiPercent).toBeCloseTo(50, 2);
    });

    it("profit = finalValue - initialInvestment", () => {
      const result = calculateRoi({ initialInvestment: 1000, finalValue: 1500 });
      expect(result).not.toBeNull();
      expect(result!.profit).toBeCloseTo(500, 2);
    });

    it("negative ROI for loss scenario (finalValue < initialInvestment)", () => {
      const result = calculateRoi({ initialInvestment: 1000, finalValue: 700 });
      expect(result).not.toBeNull();
      expect(result!.roiPercent).toBeLessThan(0);
      expect(result!.profit).toBeLessThan(0);
    });

    it("zero profit when finalValue equals initialInvestment", () => {
      const result = calculateRoi({ initialInvestment: 1000, finalValue: 1000 });
      expect(result).not.toBeNull();
      expect(result!.roiPercent).toBeCloseTo(0, 2);
    });
  });

  describe("annualized ROI", () => {
    it("provides annualizedRoi when years provided", () => {
      const result = calculateRoi({ initialInvestment: 1000, finalValue: 1500, years: 5 });
      expect(result).not.toBeNull();
      expect(result!.annualizedRoiPercent).toBeDefined();
      expect(result!.annualizedRoiPercent!).toBeGreaterThan(0);
    });

    it("annualized ROI is less than total ROI for multi-year period", () => {
      const result = calculateRoi({ initialInvestment: 1000, finalValue: 2000, years: 5 });
      expect(result).not.toBeNull();
      // Total ROI = 100%, annualized should be ~14.87%
      expect(result!.annualizedRoiPercent!).toBeLessThan(result!.roiPercent);
    });

    it("no annualizedRoi when years not provided", () => {
      const result = calculateRoi({ initialInvestment: 1000, finalValue: 1500 });
      expect(result).not.toBeNull();
      expect(result!.annualizedRoiPercent).toBeUndefined();
    });
  });
});
