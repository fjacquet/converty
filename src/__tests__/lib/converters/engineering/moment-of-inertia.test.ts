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

  describe("hollow circle", () => {
    it("hollow circle Ix < solid circle of same outer diameter", () => {
      const solid = calculateMomentOfInertia({ shape: "circle", diameter: 100 });
      const hollow = calculateMomentOfInertia({
        shape: "hollow-circle",
        diameter: 100,
        innerDiameter: 80,
      });
      expect(hollow).not.toBeNull();
      expect(hollow!.Ix).toBeLessThan(solid!.Ix);
    });

    it("returns null for hollow circle without innerDiameter", () => {
      expect(calculateMomentOfInertia({ shape: "hollow-circle", diameter: 100 })).toBeNull();
    });
  });

  describe("triangle", () => {
    it("calculates triangle moment of inertia", () => {
      const result = calculateMomentOfInertia({ shape: "triangle", width: 100, height: 200 });
      expect(result).not.toBeNull();
      // Ix = bh³/36
      expect(result!.Ix).toBeCloseTo((100 * 200 ** 3) / 36, 0);
    });

    it("returns null for triangle without height", () => {
      expect(calculateMomentOfInertia({ shape: "triangle", width: 100 })).toBeNull();
    });
  });

  describe("i-beam", () => {
    it("calculates i-beam moment of inertia", () => {
      const result = calculateMomentOfInertia({
        shape: "i-beam",
        depth: 200,
        flangeWidth: 100,
        flangeThickness: 10,
        webThickness: 8,
      });
      expect(result).not.toBeNull();
      expect(result!.Ix).toBeGreaterThan(0);
      expect(result!.area).toBeGreaterThan(0);
    });

    it("returns null for i-beam without flangeWidth", () => {
      expect(
        calculateMomentOfInertia({
          shape: "i-beam",
          depth: 200,
          flangeThickness: 10,
          webThickness: 8,
        })
      ).toBeNull();
    });
  });

  describe("channel", () => {
    it("calculates channel section moment of inertia", () => {
      const result = calculateMomentOfInertia({
        shape: "channel",
        channelDepth: 150,
        channelWidth: 65,
        channelWebThickness: 8,
        channelFlangeThickness: 12,
      });
      expect(result).not.toBeNull();
      expect(result!.Ix).toBeGreaterThan(0);
    });

    it("returns null for channel without channelDepth", () => {
      expect(
        calculateMomentOfInertia({
          shape: "channel",
          channelWidth: 65,
          channelWebThickness: 8,
          channelFlangeThickness: 12,
        })
      ).toBeNull();
    });
  });

  describe("angle", () => {
    it("calculates angle section moment of inertia", () => {
      const result = calculateMomentOfInertia({
        shape: "angle",
        legWidth1: 75,
        legWidth2: 75,
        thickness: 8,
      });
      expect(result).not.toBeNull();
      expect(result!.Ix).toBeGreaterThan(0);
    });

    it("returns null for angle without thickness", () => {
      expect(calculateMomentOfInertia({ shape: "angle", legWidth1: 75, legWidth2: 75 })).toBeNull();
    });
  });

  describe("parallel axis theorem", () => {
    it("applying offset increases moment of inertia", () => {
      const noOffset = calculateMomentOfInertia({ shape: "rectangle", width: 100, height: 100 });
      const withOffset = calculateMomentOfInertia({
        shape: "rectangle",
        width: 100,
        height: 100,
        offsetX: 50,
        offsetY: 50,
      });
      expect(withOffset).not.toBeNull();
      expect(withOffset!.Ix).toBeGreaterThan(noOffset!.Ix);
    });
  });
});
