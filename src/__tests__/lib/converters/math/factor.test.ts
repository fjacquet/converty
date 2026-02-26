import { describe, expect, it } from "vitest";
import { calculateFactor } from "@/lib/converters/math/factor";

describe("calculateFactor", () => {
  it("returns null for zero", () => {
    expect(calculateFactor({ mode: "factors", number: 0 })).toBeNull();
  });

  it("returns null for negative numbers", () => {
    expect(calculateFactor({ mode: "factors", number: -5 })).toBeNull();
  });

  it("returns null for non-integer", () => {
    expect(calculateFactor({ mode: "factors", number: 3.5 })).toBeNull();
  });

  it("finds factors of 12", () => {
    const result = calculateFactor({ mode: "factors", number: 12 });
    expect(result).not.toBeNull();
    expect(result!.factors).toEqual([1, 2, 3, 4, 6, 12]);
  });

  it("identifies prime number", () => {
    const result = calculateFactor({ mode: "factors", number: 7 });
    expect(result).not.toBeNull();
    expect(result!.isPrime).toBe(true);
    expect(result!.factors).toEqual([1, 7]);
  });

  it("identifies composite number as not prime", () => {
    const result = calculateFactor({ mode: "factors", number: 12 });
    expect(result).not.toBeNull();
    expect(result!.isPrime).toBe(false);
  });

  it("identifies perfect number 6", () => {
    const result = calculateFactor({ mode: "factors", number: 6 });
    expect(result).not.toBeNull();
    expect(result!.isPerfect).toBe(true);
  });

  it("finds common factors of two numbers", () => {
    const result = calculateFactor({ mode: "commonFactors", number: 12, number2: 18 });
    expect(result).not.toBeNull();
    expect(result!.commonFactors).toBeDefined();
    expect(result!.commonFactors).toContain(6);
    expect(result!.greatestCommonFactor).toBe(6);
  });
});
