import { describe, expect, it } from "vitest";
import { calculateRoot } from "@/lib/converters/math/root";

describe("calculateRoot", () => {
  it("returns null for even root of negative number", () => {
    expect(calculateRoot({ radicand: -9, index: 2 })).toBeNull();
    expect(calculateRoot({ radicand: -16, index: 4 })).toBeNull();
  });

  it("returns null for index < 1", () => {
    expect(calculateRoot({ radicand: 9, index: 0 })).toBeNull();
  });

  it("calculates square root of 9 = 3", () => {
    const result = calculateRoot({ radicand: 9, index: 2 });
    expect(result).not.toBeNull();
    expect(result!.result).toBeCloseTo(3, 5);
    expect(result!.isRational).toBe(true);
  });

  it("calculates cube root of 27 = 3", () => {
    const result = calculateRoot({ radicand: 27, index: 3 });
    expect(result).not.toBeNull();
    expect(result!.result).toBeCloseTo(3, 5);
  });

  it("calculates odd root of negative number", () => {
    const result = calculateRoot({ radicand: -27, index: 3 });
    expect(result).not.toBeNull();
    expect(result!.result).toBeCloseTo(-3, 5);
  });

  it("returns irrational for non-perfect square", () => {
    const result = calculateRoot({ radicand: 2, index: 2 });
    expect(result).not.toBeNull();
    expect(result!.isRational).toBe(false);
    expect(result!.result).toBeCloseTo(Math.SQRT2, 5);
  });
});
