import { describe, expect, it } from "vitest";
import { calculateMomentOfInertia } from "@/lib/converters/engineering/moment-of-inertia";

describe("calculateMomentOfInertia", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for rectangle without width", () => {
      expect(calculateMomentOfInertia({ shape: "rectangle", height: 200 })).toBeNull();
    });

    it("returns null for rectangle without height", () => {
      expect(calculateMomentOfInertia({ shape: "rectangle", width: 100 })).toBeNull();
    });

    it("returns null for circle without diameter", () => {
      expect(calculateMomentOfInertia({ shape: "circle" })).toBeNull();
    });
  });

  describe("rectangle b=100mm h=200mm → Ix = bh³/12", () => {
    it("calculates Ix ≈ 66,666,667 mm⁴", () => {
      // Ix = 100 × 200³ / 12 = 100 × 8,000,000 / 12 = 66,666,667 mm⁴
      const result = calculateMomentOfInertia({ shape: "rectangle", width: 100, height: 200 });
      expect(result).not.toBeNull();
      expect(result!.Ix).toBeCloseTo(66666667, 0);
    });

    it("calculates Iy = hb³/12 ≈ 16,666,667 mm⁴", () => {
      // Iy = 200 × 100³ / 12 = 200 × 1,000,000 / 12 = 16,666,667 mm⁴
      const result = calculateMomentOfInertia({ shape: "rectangle", width: 100, height: 200 });
      expect(result!.Iy).toBeCloseTo(16666667, 0);
    });

    it("area = 100 × 200 = 20,000 mm²", () => {
      const result = calculateMomentOfInertia({ shape: "rectangle", width: 100, height: 200 });
      expect(result!.area).toBeCloseTo(20000, 0);
    });
  });

  describe("circle r=50mm → I = πd⁴/64", () => {
    it("calculates Ix = Iy = π×100⁴/64 ≈ 4,909,000 mm⁴", () => {
      // I = π × (100)⁴ / 64 = π × 10^8 / 64 ≈ 4,908,739 mm⁴
      const result = calculateMomentOfInertia({ shape: "circle", diameter: 100 });
      expect(result).not.toBeNull();
      // For a circle Ix = Iy
      expect(result!.Ix).toBeCloseTo(result!.Iy, 0);
      expect(result!.Ix).toBeCloseTo(4908739, 0);
    });
  });

  describe("hollow rectangle", () => {
    it("hollow rectangle Ix < solid rectangle of same outer dimensions", () => {
      const solid = calculateMomentOfInertia({ shape: "rectangle", width: 100, height: 200 });
      const hollow = calculateMomentOfInertia({
        shape: "hollow-rectangle",
        width: 100,
        height: 200,
        innerWidth: 80,
        innerHeight: 160,
      });
      expect(hollow).not.toBeNull();
      expect(hollow!.Ix).toBeLessThan(solid!.Ix);
    });
  });

  describe("result structure", () => {
    it("returns steps array", () => {
      const result = calculateMomentOfInertia({ shape: "rectangle", width: 100, height: 100 });
      expect(result!.steps).toBeInstanceOf(Array);
      expect(result!.steps.length).toBeGreaterThan(0);
    });

    it("returns units in mm4, in4, cm4", () => {
      const result = calculateMomentOfInertia({ shape: "rectangle", width: 100, height: 200 });
      expect(result!.units.mm4.Ix).toBeGreaterThan(0);
      expect(result!.units.in4.Ix).toBeGreaterThan(0);
      expect(result!.units.cm4.Ix).toBeGreaterThan(0);
    });

    it("returns radiusOfGyration values", () => {
      const result = calculateMomentOfInertia({ shape: "rectangle", width: 100, height: 200 });
      expect(result!.radiusOfGyrationX).toBeGreaterThan(0);
      expect(result!.radiusOfGyrationY).toBeGreaterThan(0);
    });
  });

  describe.each([
    ["rectangle", { shape: "rectangle" as const, width: 100, height: 100 }],
    ["circle", { shape: "circle" as const, diameter: 100 }],
  ])("%s shape", (_shapeName, input) => {
    it("returns non-null for valid inputs", () => {
      expect(calculateMomentOfInertia(input)).not.toBeNull();
    });
  });
});
