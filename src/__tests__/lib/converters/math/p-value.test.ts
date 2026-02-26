import { describe, expect, it } from "vitest";
import { calculatePValue } from "@/lib/converters/math/p-value";

describe("calculatePValue", () => {
  describe("fromZScore mode", () => {
    it("two-tailed: z=1.96 gives p ≈ 0.05", () => {
      const result = calculatePValue({ mode: "fromZScore", testStatistic: 1.96, twoTailed: true });
      expect(result).not.toBeNull();
      expect(result?.pValue).toBeCloseTo(0.05, 2);
      expect(result?.twoTailed).toBe(true);
    });

    it("one-tailed: z=1.645 gives p ≈ 0.05", () => {
      const result = calculatePValue({
        mode: "fromZScore",
        testStatistic: 1.645,
        twoTailed: false,
      });
      expect(result).not.toBeNull();
      expect(result?.pValue).toBeCloseTo(0.05, 2);
      expect(result?.twoTailed).toBe(false);
    });

    it("two-tailed: z=2.576 gives p ≈ 0.01", () => {
      const result = calculatePValue({ mode: "fromZScore", testStatistic: 2.576, twoTailed: true });
      expect(result).not.toBeNull();
      expect(result?.pValue).toBeCloseTo(0.01, 2);
    });

    it("large z gives very small p-value (highly significant)", () => {
      const result = calculatePValue({ mode: "fromZScore", testStatistic: 5, twoTailed: true });
      expect(result).not.toBeNull();
      expect(result?.pValue).toBeLessThan(0.001);
      expect(result?.significantAt001).toBe(true);
    });

    it("z=0 gives p=1 for two-tailed", () => {
      const result = calculatePValue({ mode: "fromZScore", testStatistic: 0, twoTailed: true });
      expect(result).not.toBeNull();
      expect(result?.pValue).toBeCloseTo(1, 1);
    });

    it("includes significance fields", () => {
      const result = calculatePValue({ mode: "fromZScore", testStatistic: 1.96, twoTailed: true });
      expect(result).not.toBeNull();
      expect(result?.significantAt05).toBe(true);
      expect(result?.significantAt01).toBe(false);
    });
  });

  describe("fromTScore mode", () => {
    it("t-test with df=30 gives similar result to z-test", () => {
      const result = calculatePValue({
        mode: "fromTScore",
        testStatistic: 2.042,
        degreesOfFreedom: 30,
        twoTailed: true,
      });
      expect(result).not.toBeNull();
      expect(result?.pValue).toBeCloseTo(0.05, 1);
    });

    it("returns null for df <= 0", () => {
      const result = calculatePValue({
        mode: "fromTScore",
        testStatistic: 2,
        degreesOfFreedom: 0,
        twoTailed: true,
      });
      expect(result).toBeNull();
    });

    it("returns null for missing df", () => {
      const result = calculatePValue({
        mode: "fromTScore",
        testStatistic: 2,
        twoTailed: true,
      });
      expect(result).toBeNull();
    });
  });

  describe("fromChiSquare mode", () => {
    it("chi-square test with known values", () => {
      const result = calculatePValue({
        mode: "fromChiSquare",
        testStatistic: 3.841,
        degreesOfFreedom: 1,
      });
      expect(result).not.toBeNull();
      // Chi-square 3.841 with df=1 corresponds to p ≈ 0.05
      expect(result?.pValue).toBeCloseTo(0.05, 1);
    });

    it("returns null for df <= 0", () => {
      const result = calculatePValue({
        mode: "fromChiSquare",
        testStatistic: 5,
        degreesOfFreedom: 0,
      });
      expect(result).toBeNull();
    });

    it("returns null for missing df", () => {
      const result = calculatePValue({
        mode: "fromChiSquare",
        testStatistic: 5,
      });
      expect(result).toBeNull();
    });
  });

  describe("fromFScore mode", () => {
    it("F-test with known values", () => {
      const result = calculatePValue({
        mode: "fromFScore",
        testStatistic: 4,
        degreesOfFreedom: 2,
        degreesOfFreedom2: 30,
      });
      expect(result).not.toBeNull();
      expect(result?.pValue).toBeGreaterThan(0);
      expect(result?.pValue).toBeLessThan(1);
    });

    it("returns null for missing df2", () => {
      const result = calculatePValue({
        mode: "fromFScore",
        testStatistic: 4,
        degreesOfFreedom: 2,
      });
      expect(result).toBeNull();
    });

    it("returns null for df <= 0", () => {
      const result = calculatePValue({
        mode: "fromFScore",
        testStatistic: 4,
        degreesOfFreedom: 0,
        degreesOfFreedom2: 30,
      });
      expect(result).toBeNull();
    });
  });

  describe("result structure", () => {
    it("includes interpretation string", () => {
      const result = calculatePValue({ mode: "fromZScore", testStatistic: 1.96, twoTailed: true });
      expect(result).not.toBeNull();
      expect(typeof result?.interpretation).toBe("string");
      expect(result?.interpretation.length).toBeGreaterThan(0);
    });

    it("p-value is always in [0, 1]", () => {
      const result = calculatePValue({
        mode: "fromZScore",
        testStatistic: 100,
        twoTailed: true,
      });
      expect(result).not.toBeNull();
      expect(result!.pValue).toBeGreaterThanOrEqual(0);
      expect(result!.pValue).toBeLessThanOrEqual(1);
    });

    it("includes steps array", () => {
      const result = calculatePValue({ mode: "fromZScore", testStatistic: 2, twoTailed: true });
      expect(result).not.toBeNull();
      expect(result?.steps.length).toBeGreaterThan(0);
    });
  });
});
