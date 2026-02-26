import { describe, expect, it } from "vitest";
import { calculateSlope } from "@/lib/converters/math/slope";

describe("calculateSlope", () => {
  it("returns null for missing points in twoPoints mode", () => {
    expect(calculateSlope({ mode: "twoPoints", x1: 0, y1: 0 })).toBeNull();
  });

  it("calculates slope of (0,0)-(2,4) = 2", () => {
    const result = calculateSlope({ mode: "twoPoints", x1: 0, y1: 0, x2: 2, y2: 4 });
    expect(result).not.toBeNull();
    expect(result!.slope).toBeCloseTo(2, 5);
    expect(result!.isVertical).toBe(false);
    expect(result!.isHorizontal).toBe(false);
  });

  it("null slope for vertical line (x1 = x2)", () => {
    const result = calculateSlope({ mode: "twoPoints", x1: 3, y1: 0, x2: 3, y2: 5 });
    expect(result).not.toBeNull();
    expect(result!.slope).toBeNull();
    expect(result!.isVertical).toBe(true);
  });

  it("y-intercept of line through (0,3) and (1,5) is 3", () => {
    const result = calculateSlope({ mode: "twoPoints", x1: 0, y1: 3, x2: 1, y2: 5 });
    expect(result).not.toBeNull();
    expect(result!.yIntercept).toBe(3);
    expect(result!.slope).toBe(2);
  });

  it("slopeIntercept mode returns correct slope and intercept", () => {
    const result = calculateSlope({ mode: "slopeIntercept", slope: 3, yIntercept: -2 });
    expect(result).not.toBeNull();
    expect(result!.slope).toBe(3);
    expect(result!.yIntercept).toBe(-2);
  });

  it("calculates distance between two points", () => {
    const result = calculateSlope({ mode: "twoPoints", x1: 0, y1: 0, x2: 3, y2: 4 });
    expect(result).not.toBeNull();
    expect(result!.distance).toBeCloseTo(5, 5);
  });
});
