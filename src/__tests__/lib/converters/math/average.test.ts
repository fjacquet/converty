import { describe, expect, it } from "vitest";
import { calculateAverage } from "@/lib/converters/math/average";

describe("calculateAverage", () => {
  it("returns null for empty array", () => {
    expect(calculateAverage({ numbers: [] })).toBeNull();
  });

  it("calculates mean of [1, 2, 3]", () => {
    const result = calculateAverage({ numbers: [1, 2, 3] });
    expect(result).not.toBeNull();
    expect(result!.mean).toBe(2);
    expect(result!.sum).toBe(6);
    expect(result!.count).toBe(3);
  });

  it("calculates median of even-length array", () => {
    const result = calculateAverage({ numbers: [1, 2, 3, 4] });
    expect(result).not.toBeNull();
    expect(result!.median).toBe(2.5);
  });

  it("calculates median of odd-length array", () => {
    const result = calculateAverage({ numbers: [1, 2, 3] });
    expect(result).not.toBeNull();
    expect(result!.median).toBe(2);
  });

  it("identifies mode for array with repeated value", () => {
    const result = calculateAverage({ numbers: [1, 2, 2, 3] });
    expect(result).not.toBeNull();
    expect(result!.mode).toContain(2);
  });

  it("calculates min, max, and range", () => {
    const result = calculateAverage({ numbers: [3, 1, 4, 1, 5] });
    expect(result).not.toBeNull();
    expect(result!.min).toBe(1);
    expect(result!.max).toBe(5);
    expect(result!.range).toBe(4);
  });

  it("calculates weighted mean when weights provided", () => {
    const result = calculateAverage({ numbers: [10, 20], weights: [1, 3] });
    expect(result).not.toBeNull();
    expect(result!.weightedMean).toBeCloseTo(17.5, 5);
  });

  it("returns null weightedMean when weights have different length", () => {
    const result = calculateAverage({ numbers: [1, 2, 3], weights: [1, 1] });
    expect(result).not.toBeNull();
    expect(result!.weightedMean).toBeNull();
  });
});
