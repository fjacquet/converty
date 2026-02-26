import { describe, expect, it } from "vitest";
import { calculateBasicCalculator } from "@/lib/converters/math/basic-calculator";

describe("calculateBasicCalculator", () => {
  it("returns null for empty expression", () => {
    expect(calculateBasicCalculator({ expression: "" })).toBeNull();
    expect(calculateBasicCalculator({ expression: "   " })).toBeNull();
  });

  it("adds two numbers", () => {
    const result = calculateBasicCalculator({ expression: "2 + 3" });
    expect(result).not.toBeNull();
    expect(result!.result).toBe(5);
  });

  it("subtracts two numbers", () => {
    const result = calculateBasicCalculator({ expression: "10 - 4" });
    expect(result).not.toBeNull();
    expect(result!.result).toBe(6);
  });

  it("multiplies two numbers", () => {
    const result = calculateBasicCalculator({ expression: "3 * 7" });
    expect(result).not.toBeNull();
    expect(result!.result).toBe(21);
  });

  it("returns null for division by zero", () => {
    const result = calculateBasicCalculator({ expression: "5 / 0" });
    expect(result).toBeNull();
  });

  it("divides two numbers", () => {
    const result = calculateBasicCalculator({ expression: "10 / 2" });
    expect(result).not.toBeNull();
    expect(result!.result).toBe(5);
  });

  it("evaluates power operator", () => {
    const result = calculateBasicCalculator({ expression: "2 ^ 10" });
    expect(result).not.toBeNull();
    expect(result!.result).toBe(1024);
  });

  it("respects operator precedence", () => {
    const result = calculateBasicCalculator({ expression: "2 + 3 * 4" });
    expect(result).not.toBeNull();
    expect(result!.result).toBe(14);
  });
});
