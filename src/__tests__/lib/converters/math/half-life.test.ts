import { describe, expect, it } from "vitest";
import { calculateHalfLife } from "@/lib/converters/math/half-life";

describe("calculateHalfLife", () => {
  it("returns null for negative initial amount in decay mode", () => {
    expect(
      calculateHalfLife({ mode: "decay", initialAmount: -100, halfLife: 10, time: 5 })
    ).toBeNull();
  });

  it("returns null for negative half-life in decay mode", () => {
    expect(
      calculateHalfLife({ mode: "decay", initialAmount: 100, halfLife: -10, time: 5 })
    ).toBeNull();
  });

  it("after 1 half-life 100g becomes approximately 50g", () => {
    const result = calculateHalfLife({ mode: "decay", initialAmount: 100, halfLife: 10, time: 10 });
    expect(result).not.toBeNull();
    expect(result!.remainingAmount).toBeCloseTo(50, 5);
    expect(result!.numberOfHalfLives).toBe(1);
  });

  it("after 2 half-lives 100g becomes approximately 25g", () => {
    const result = calculateHalfLife({ mode: "decay", initialAmount: 100, halfLife: 10, time: 20 });
    expect(result).not.toBeNull();
    expect(result!.remainingAmount).toBeCloseTo(25, 5);
  });

  it("finds time given initial and remaining amounts", () => {
    const result = calculateHalfLife({
      mode: "remaining",
      initialAmount: 100,
      remainingAmount: 50,
      halfLife: 10,
    });
    expect(result).not.toBeNull();
    expect(result!.time).toBeCloseTo(10, 5);
  });

  it("carbon14 mode returns result for valid percent remaining", () => {
    const result = calculateHalfLife({ mode: "carbon14", percentRemaining: 50 });
    expect(result).not.toBeNull();
    expect(result!.halfLife).toBe(5730);
    expect(result!.time).toBeCloseTo(5730, 0);
  });
});
