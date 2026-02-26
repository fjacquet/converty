import { calculateConfidenceInterval } from "@/lib/converters/math/confidence-interval";

describe("calculateConfidenceInterval", () => {
  describe("mean mode", () => {
    it("calculates 95% CI for known values (large sample)", () => {
      const result = calculateConfidenceInterval({
        mode: "mean",
        sampleMean: 50,
        sampleSize: 100,
        standardDeviation: 10,
        confidenceLevel: 95,
      });
      expect(result).not.toBeNull();
      expect(result?.pointEstimate).toBe(50);
      expect(result?.lowerBound).toBeLessThan(50);
      expect(result?.upperBound).toBeGreaterThan(50);
      // 95% CI: 50 ± 1.96 * (10/√100) = 50 ± 1.96
      expect(result?.lowerBound).toBeCloseTo(48.04, 1);
      expect(result?.upperBound).toBeCloseTo(51.96, 1);
    });

    it("calculates 99% CI with larger margin of error", () => {
      const result95 = calculateConfidenceInterval({
        mode: "mean",
        sampleMean: 50,
        sampleSize: 100,
        standardDeviation: 10,
        confidenceLevel: 95,
      });
      const result99 = calculateConfidenceInterval({
        mode: "mean",
        sampleMean: 50,
        sampleSize: 100,
        standardDeviation: 10,
        confidenceLevel: 99,
      });
      expect(result95).not.toBeNull();
      expect(result99).not.toBeNull();
      expect(result99!.marginOfError).toBeGreaterThan(result95!.marginOfError);
    });

    it("lower < mean < upper", () => {
      const result = calculateConfidenceInterval({
        mode: "mean",
        sampleMean: 75,
        sampleSize: 50,
        standardDeviation: 15,
        confidenceLevel: 90,
      });
      expect(result).not.toBeNull();
      expect(result!.lowerBound).toBeLessThan(75);
      expect(result!.upperBound).toBeGreaterThan(75);
    });

    it("uses t-distribution for small samples (n < 30)", () => {
      const result = calculateConfidenceInterval({
        mode: "mean",
        sampleMean: 20,
        sampleSize: 10,
        standardDeviation: 5,
        confidenceLevel: 95,
      });
      expect(result).not.toBeNull();
      expect(result?.formula).toContain("t");
      expect(result?.criticalValue).toBeGreaterThan(1.96); // t > z for same confidence level
    });

    it("returns null for n=0", () => {
      const result = calculateConfidenceInterval({
        mode: "mean",
        sampleMean: 50,
        sampleSize: 0,
        standardDeviation: 10,
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });

    it("returns null for negative n", () => {
      const result = calculateConfidenceInterval({
        mode: "mean",
        sampleMean: 50,
        sampleSize: -1,
        standardDeviation: 10,
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });

    it("returns null when standardDeviation is 0", () => {
      const result = calculateConfidenceInterval({
        mode: "mean",
        sampleMean: 50,
        sampleSize: 100,
        standardDeviation: 0,
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });

    it("returns null when sampleMean is undefined", () => {
      const result = calculateConfidenceInterval({
        mode: "mean",
        sampleSize: 100,
        standardDeviation: 10,
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });
  });

  describe("proportion mode", () => {
    it("calculates CI for a proportion", () => {
      const result = calculateConfidenceInterval({
        mode: "proportion",
        successes: 60,
        sampleSize: 100,
        confidenceLevel: 95,
      });
      expect(result).not.toBeNull();
      expect(result?.pointEstimate).toBeCloseTo(0.6, 4);
      expect(result?.lowerBound).toBeLessThan(0.6);
      expect(result?.upperBound).toBeGreaterThan(0.6);
    });

    it("returns null when successes > sampleSize", () => {
      const result = calculateConfidenceInterval({
        mode: "proportion",
        successes: 110,
        sampleSize: 100,
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });

    it("returns null when successes is negative", () => {
      const result = calculateConfidenceInterval({
        mode: "proportion",
        successes: -1,
        sampleSize: 100,
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });

    it("includes proportion interpretation", () => {
      const result = calculateConfidenceInterval({
        mode: "proportion",
        successes: 50,
        sampleSize: 100,
        confidenceLevel: 95,
      });
      expect(result).not.toBeNull();
      expect(result?.interpretation).toContain("proportion");
    });
  });

  describe("difference mode", () => {
    it("calculates CI for difference of means", () => {
      const result = calculateConfidenceInterval({
        mode: "difference",
        sampleMean: 80,
        sampleSize: 50,
        standardDeviation: 10,
        sampleMean2: 70,
        sampleSize2: 50,
        standardDeviation2: 12,
        confidenceLevel: 95,
      });
      expect(result).not.toBeNull();
      expect(result?.pointEstimate).toBeCloseTo(10, 4);
    });

    it("returns null when required fields are missing", () => {
      const result = calculateConfidenceInterval({
        mode: "difference",
        sampleMean: 80,
        sampleSize: 50,
        standardDeviation: 10,
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });
  });

  describe("result structure", () => {
    it("includes all required fields", () => {
      const result = calculateConfidenceInterval({
        mode: "mean",
        sampleMean: 50,
        sampleSize: 100,
        standardDeviation: 10,
        confidenceLevel: 95,
      });
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("lowerBound");
      expect(result).toHaveProperty("upperBound");
      expect(result).toHaveProperty("marginOfError");
      expect(result).toHaveProperty("criticalValue");
      expect(result).toHaveProperty("standardError");
      expect(result).toHaveProperty("formula");
      expect(result).toHaveProperty("steps");
      expect(result).toHaveProperty("interpretation");
      expect(result?.steps.length).toBeGreaterThan(0);
    });
  });
});
