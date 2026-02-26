import { describe, expect, it } from "vitest";
import { calculateSampleSize } from "@/lib/converters/math/sample-size";

describe("calculateSampleSize", () => {
  describe("proportion mode", () => {
    it("confidence=95%, margin=5% gives ~385 for unknown proportion", () => {
      const result = calculateSampleSize({
        mode: "proportion",
        confidenceLevel: 95,
        marginOfError: 0.05,
        populationProportion: 0.5,
      });
      expect(result).not.toBeNull();
      // Standard result for 95%, 5% margin, p=0.5
      expect(result?.sampleSize).toBeGreaterThanOrEqual(384);
      expect(result?.sampleSize).toBeLessThanOrEqual(386);
    });

    it("confidence=99% gives larger sample than 95%", () => {
      const result95 = calculateSampleSize({
        mode: "proportion",
        confidenceLevel: 95,
        marginOfError: 0.05,
      });
      const result99 = calculateSampleSize({
        mode: "proportion",
        confidenceLevel: 99,
        marginOfError: 0.05,
      });
      expect(result95).not.toBeNull();
      expect(result99).not.toBeNull();
      expect(result99!.sampleSize).toBeGreaterThan(result95!.sampleSize);
    });

    it("smaller margin of error requires larger sample", () => {
      const result5 = calculateSampleSize({
        mode: "proportion",
        confidenceLevel: 95,
        marginOfError: 0.05,
      });
      const result3 = calculateSampleSize({
        mode: "proportion",
        confidenceLevel: 95,
        marginOfError: 0.03,
      });
      expect(result5).not.toBeNull();
      expect(result3).not.toBeNull();
      expect(result3!.sampleSize).toBeGreaterThan(result5!.sampleSize);
    });

    it("applies finite population correction when populationSize given", () => {
      const result = calculateSampleSize({
        mode: "proportion",
        confidenceLevel: 95,
        marginOfError: 0.05,
        populationSize: 500,
      });
      expect(result).not.toBeNull();
      expect(result?.finiteCorrected).toBeDefined();
      expect(result!.finiteCorrected!).toBeLessThan(385); // smaller due to finite correction
    });
  });

  describe("mean mode", () => {
    it("calculates sample size for a mean estimate", () => {
      const result = calculateSampleSize({
        mode: "mean",
        confidenceLevel: 95,
        marginOfError: 0.5,
        standardDeviation: 2,
      });
      expect(result).not.toBeNull();
      // n = (1.96 * 2 / 0.5)^2 = (7.84)^2 ≈ 61.5 → 62
      expect(result?.sampleSize).toBeGreaterThanOrEqual(61);
      expect(result?.sampleSize).toBeLessThanOrEqual(63);
    });

    it("returns null when standardDeviation is 0", () => {
      const result = calculateSampleSize({
        mode: "mean",
        confidenceLevel: 95,
        marginOfError: 5,
        standardDeviation: 0,
      });
      expect(result).toBeNull();
    });

    it("returns null when standardDeviation is missing", () => {
      const result = calculateSampleSize({
        mode: "mean",
        confidenceLevel: 95,
        marginOfError: 5,
      });
      expect(result).toBeNull();
    });
  });

  describe("fromMarginOfError mode", () => {
    it("calculates margin of error from sample size", () => {
      const result = calculateSampleSize({
        mode: "fromMarginOfError",
        sampleSize: 400,
        confidenceLevel: 95,
      });
      expect(result).not.toBeNull();
      // For n=400, p=0.5: E = 1.96 * sqrt(0.5*0.5/400) = 1.96 * 0.025 ≈ 0.049
      expect(result?.marginOfError).toBeCloseTo(0.049, 2);
    });

    it("returns null for sampleSize <= 0", () => {
      const result = calculateSampleSize({
        mode: "fromMarginOfError",
        sampleSize: 0,
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });

    it("returns null for missing sampleSize", () => {
      const result = calculateSampleSize({
        mode: "fromMarginOfError",
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });
  });

  describe("validation", () => {
    it("returns null for marginOfError = 0", () => {
      const result = calculateSampleSize({
        mode: "proportion",
        marginOfError: 0,
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });

    it("returns null for marginOfError >= 1", () => {
      const result = calculateSampleSize({
        mode: "proportion",
        marginOfError: 1,
        confidenceLevel: 95,
      });
      expect(result).toBeNull();
    });
  });

  describe("result structure", () => {
    it("includes required fields", () => {
      const result = calculateSampleSize({
        mode: "proportion",
        confidenceLevel: 95,
        marginOfError: 0.05,
      });
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("sampleSize");
      expect(result).toHaveProperty("marginOfError");
      expect(result).toHaveProperty("confidenceLevel");
      expect(result).toHaveProperty("zScore");
      expect(result).toHaveProperty("formula");
      expect(result).toHaveProperty("steps");
      expect(result).toHaveProperty("interpretation");
      expect(result?.steps.length).toBeGreaterThan(0);
    });
  });
});
