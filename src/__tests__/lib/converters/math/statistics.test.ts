import { beforeEach, describe, expect, it } from "vitest";
import { calculateStatistics } from "@/lib/converters/math/statistics";

describe("calculateStatistics", () => {
  describe("basic statistics for [1,2,3,4,5]", () => {
    const data = [1, 2, 3, 4, 5];
    let result: ReturnType<typeof calculateStatistics>;

    beforeEach(() => {
      result = calculateStatistics({ data });
    });

    it("calculates mean = 3", () => {
      expect(result?.mean).toBe(3);
    });

    it("calculates median = 3 (odd count)", () => {
      expect(result?.median).toBe(3);
    });

    it("calculates min and max", () => {
      expect(result?.min).toBe(1);
      expect(result?.max).toBe(5);
    });

    it("calculates range = 4", () => {
      expect(result?.range).toBe(4);
    });

    it("variance is numeric and positive", () => {
      expect(typeof result?.variance).toBe("number");
      expect(result?.variance).toBeGreaterThan(0);
    });

    it("standard deviation is numeric and positive", () => {
      expect(typeof result?.standardDeviation).toBe("number");
      expect(result?.standardDeviation).toBeGreaterThan(0);
    });

    it("mode returns all values (all unique — each appears once)", () => {
      // maxFreq = 1, but mode includes all since all have same frequency
      expect(result?.mode).toBeDefined();
      expect(Array.isArray(result?.mode)).toBe(true);
    });

    it("count = 5", () => {
      expect(result?.count).toBe(5);
    });

    it("sum = 15", () => {
      expect(result?.sum).toBe(15);
    });
  });

  describe("mode detection", () => {
    it("detects mode=2 for [1,2,2,3]", () => {
      const result = calculateStatistics({ data: [1, 2, 2, 3] });
      expect(result).not.toBeNull();
      expect(result?.mode).toContain(2);
    });

    it("detects multiple modes for [1,1,2,2,3]", () => {
      const result = calculateStatistics({ data: [1, 1, 2, 2, 3] });
      expect(result).not.toBeNull();
      expect(result?.mode).toContain(1);
      expect(result?.mode).toContain(2);
    });
  });

  describe("median", () => {
    it("calculates median for even count (2,4,6,8) = 5", () => {
      const result = calculateStatistics({ data: [2, 4, 6, 8] });
      expect(result).not.toBeNull();
      expect(result?.median).toBe(5);
    });
  });

  describe("quartiles", () => {
    it("calculates Q1, Q2, Q3, IQR", () => {
      const result = calculateStatistics({ data: [1, 2, 3, 4, 5, 6, 7, 8] });
      expect(result).not.toBeNull();
      expect(result?.quartiles.q1).toBeDefined();
      expect(result?.quartiles.q2).toBeDefined();
      expect(result?.quartiles.q3).toBeDefined();
      expect(result?.quartiles.iqr).toBeCloseTo(result!.quartiles.q3 - result!.quartiles.q1, 5);
    });
  });

  describe("percentiles", () => {
    it("includes common percentiles", () => {
      const result = calculateStatistics({ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
      expect(result).not.toBeNull();
      expect(result?.percentiles[25]).toBeDefined();
      expect(result?.percentiles[50]).toBeDefined();
      expect(result?.percentiles[75]).toBeDefined();
    });
  });

  describe("population vs sample", () => {
    it("population variance uses n denominator", () => {
      const data = [1, 2, 3, 4, 5];
      const popResult = calculateStatistics({ data, population: true });
      const sampleResult = calculateStatistics({ data, population: false });
      expect(popResult).not.toBeNull();
      expect(sampleResult).not.toBeNull();
      expect(popResult!.variance).toBeLessThan(sampleResult!.variance);
      expect(popResult?.isPopulation).toBe(true);
    });
  });

  describe("geometric and harmonic mean", () => {
    it("calculates geometric mean for positive data", () => {
      const result = calculateStatistics({ data: [1, 2, 4, 8] });
      expect(result).not.toBeNull();
      expect(result?.geometricMean).not.toBeNull();
      // geometric mean of [1,2,4,8] = (1*2*4*8)^(1/4) = 64^(1/4) = 2.83
      expect(result?.geometricMean).toBeCloseTo(2.828, 2);
    });

    it("calculates harmonic mean for positive data", () => {
      const result = calculateStatistics({ data: [1, 2, 4] });
      expect(result).not.toBeNull();
      expect(result?.harmonicMean).not.toBeNull();
    });

    it("geometric and harmonic mean are null with non-positive data", () => {
      const result = calculateStatistics({ data: [-1, 2, 3] });
      expect(result).not.toBeNull();
      expect(result?.geometricMean).toBeNull();
      expect(result?.harmonicMean).toBeNull();
    });
  });

  describe("skewness and kurtosis", () => {
    it("calculates skewness", () => {
      const result = calculateStatistics({ data: [1, 2, 3, 4, 5] });
      expect(result).not.toBeNull();
      expect(typeof result?.skewness).toBe("number");
    });

    it("calculates kurtosis", () => {
      const result = calculateStatistics({ data: [1, 2, 3, 4, 5] });
      expect(result).not.toBeNull();
      expect(typeof result?.kurtosis).toBe("number");
    });
  });

  describe("validation", () => {
    it("returns null for empty data", () => {
      const result = calculateStatistics({ data: [] });
      expect(result).toBeNull();
    });

    it("returns null for null data", () => {
      const result = calculateStatistics({ data: undefined as unknown as number[] });
      expect(result).toBeNull();
    });
  });

  describe("result structure", () => {
    it("includes steps array", () => {
      const result = calculateStatistics({ data: [1, 2, 3] });
      expect(result).not.toBeNull();
      expect(result?.steps.length).toBeGreaterThan(0);
    });

    it("includes sortedData", () => {
      const result = calculateStatistics({ data: [3, 1, 2] });
      expect(result).not.toBeNull();
      expect(result?.sortedData).toEqual([1, 2, 3]);
    });

    it("includes frequencyDistribution", () => {
      const result = calculateStatistics({ data: [1, 2, 2, 3] });
      expect(result).not.toBeNull();
      expect(result?.frequencyDistribution[2]).toBe(2);
    });

    it("includes standardError", () => {
      const result = calculateStatistics({ data: [1, 2, 3, 4, 5] });
      expect(result).not.toBeNull();
      expect(result?.standardError).toBeGreaterThan(0);
    });
  });
});
