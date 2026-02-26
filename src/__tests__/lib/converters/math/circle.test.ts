import { describe, expect, it } from "vitest";
import { calculateCircle } from "@/lib/converters/math/circle";

describe("calculateCircle", () => {
  it("returns null for non-positive radius", () => {
    expect(calculateCircle({ mode: "radius", value: 0 })).toBeNull();
    expect(calculateCircle({ mode: "radius", value: -3 })).toBeNull();
  });

  it("calculates circumference from radius 5", () => {
    const result = calculateCircle({ mode: "radius", value: 5 });
    expect(result).not.toBeNull();
    expect(result!.circumference).toBeCloseTo(2 * Math.PI * 5, 5);
  });

  it("calculates area from radius 5", () => {
    const result = calculateCircle({ mode: "radius", value: 5 });
    expect(result).not.toBeNull();
    expect(result!.area).toBeCloseTo(Math.PI * 25, 5);
  });

  it("calculates radius from diameter", () => {
    const result = calculateCircle({ mode: "diameter", value: 10 });
    expect(result).not.toBeNull();
    expect(result!.radius).toBe(5);
    expect(result!.diameter).toBe(10);
  });

  it("provides common angles array", () => {
    const result = calculateCircle({ mode: "radius", value: 5 });
    expect(result).not.toBeNull();
    expect(result!.commonAngles.length).toBeGreaterThan(0);
  });
});
