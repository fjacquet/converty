import { describe, expect, it } from "vitest";
import { calculateQuadratic } from "@/lib/converters/math/quadratic";

describe("calculateQuadratic", () => {
  it("returns null when a = 0 (not a quadratic equation)", () => {
    expect(calculateQuadratic({ a: 0, b: 2, c: 1 })).toBeNull();
  });

  it("solves x^2 - 5x + 6 = 0 to get roots x=3 and x=2 (discriminant > 0)", () => {
    const result = calculateQuadratic({ a: 1, b: -5, c: 6 });
    expect(result).not.toBeNull();
    expect(result!.discriminant).toBeGreaterThan(0);
    expect(result!.discriminantType).toBe("positive");
    expect(result!.hasRealRoots).toBe(true);
    const roots = [result!.roots.x1, result!.roots.x2].sort((a, b) => (a ?? 0) - (b ?? 0));
    expect(roots[0]).toBeCloseTo(2, 5);
    expect(roots[1]).toBeCloseTo(3, 5);
  });

  it("solves x^2 - 2x + 1 = 0 to get one repeated root x=1 (discriminant = 0)", () => {
    const result = calculateQuadratic({ a: 1, b: -2, c: 1 });
    expect(result).not.toBeNull();
    expect(result!.discriminant).toBe(0);
    expect(result!.discriminantType).toBe("zero");
    expect(result!.roots.x1).toBeCloseTo(1, 5);
    expect(result!.roots.x2).toBeCloseTo(1, 5);
  });

  it("returns complex roots for x^2 + 1 = 0 (discriminant < 0)", () => {
    const result = calculateQuadratic({ a: 1, b: 0, c: 1 });
    expect(result).not.toBeNull();
    expect(result!.discriminant).toBeLessThan(0);
    expect(result!.discriminantType).toBe("negative");
    expect(result!.hasRealRoots).toBe(false);
    expect(result!.complexRoots).not.toBeNull();
    expect(result!.complexRoots!.imaginary).toBeCloseTo(1, 5);
  });

  it("provides vertex and axis of symmetry", () => {
    const result = calculateQuadratic({ a: 1, b: -2, c: 1 });
    expect(result).not.toBeNull();
    expect(result!.vertex.x).toBeCloseTo(1, 5);
    expect(result!.axisOfSymmetry).toBeCloseTo(1, 5);
  });
});
