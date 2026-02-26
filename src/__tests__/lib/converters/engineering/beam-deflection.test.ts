import { describe, expect, it } from "vitest";
import { calculateBeamDeflection } from "@/lib/converters/engineering/beam-deflection";

// Beam properties: steel I-beam typical values
const BASE_INPUT = {
  beamType: "simply-supported" as const,
  loadType: "point-load" as const,
  length: 5, // m
  momentOfInertia: 100e6, // mm⁴ (100×10⁶ mm⁴)
  youngsModulus: 200, // GPa (steel)
  pointLoad: 10, // kN
};

describe("calculateBeamDeflection", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for length = 0", () => {
      expect(calculateBeamDeflection({ ...BASE_INPUT, length: 0 })).toBeNull();
    });

    it("returns null for youngsModulus = 0", () => {
      expect(calculateBeamDeflection({ ...BASE_INPUT, youngsModulus: 0 })).toBeNull();
    });

    it("returns null for momentOfInertia = 0", () => {
      expect(calculateBeamDeflection({ ...BASE_INPUT, momentOfInertia: 0 })).toBeNull();
    });

    it("returns null for point-load type with no pointLoad", () => {
      const input = { ...BASE_INPUT, pointLoad: undefined };
      expect(calculateBeamDeflection(input)).toBeNull();
    });
  });

  describe("simply-supported beam with point load at midspan", () => {
    it("returns non-null result", () => {
      const result = calculateBeamDeflection(BASE_INPUT);
      expect(result).not.toBeNull();
    });

    it("maxDeflection is positive", () => {
      const result = calculateBeamDeflection(BASE_INPUT);
      expect(result!.maxDeflection).toBeGreaterThan(0);
    });

    it("has shearDiagram, momentDiagram, deflectionCurve arrays", () => {
      const result = calculateBeamDeflection(BASE_INPUT);
      expect(result!.shearDiagram).toBeInstanceOf(Array);
      expect(result!.momentDiagram).toBeInstanceOf(Array);
      expect(result!.deflectionCurve).toBeInstanceOf(Array);
    });

    it("deflectionRatios.actual is positive", () => {
      const result = calculateBeamDeflection(BASE_INPUT);
      expect(result!.deflectionRatios.actual).toBeGreaterThan(0);
    });
  });

  describe("simply-supported beam with distributed load", () => {
    it("δ = 5wL⁴/(384EI): returns valid deflection for uniform load", () => {
      const result = calculateBeamDeflection({
        beamType: "simply-supported",
        loadType: "distributed-load",
        length: 5,
        momentOfInertia: 100e6,
        youngsModulus: 200,
        distributedLoad: 10, // kN/m
      });
      expect(result).not.toBeNull();
      expect(result!.maxDeflection).toBeGreaterThan(0);
    });
  });

  describe("cantilever beam", () => {
    it("cantilever beam with point load returns non-null result", () => {
      const result = calculateBeamDeflection({
        ...BASE_INPUT,
        beamType: "cantilever",
      });
      expect(result).not.toBeNull();
    });

    it("cantilever deflection is greater than simply-supported (same load)", () => {
      const ssResult = calculateBeamDeflection(BASE_INPUT);
      const cantResult = calculateBeamDeflection({ ...BASE_INPUT, beamType: "cantilever" });
      expect(cantResult!.maxDeflection).toBeGreaterThan(ssResult!.maxDeflection);
    });
  });

  describe("fixed-fixed beam", () => {
    it("fixed-fixed beam returns non-null result", () => {
      const result = calculateBeamDeflection({
        ...BASE_INPUT,
        beamType: "fixed-fixed",
      });
      expect(result).not.toBeNull();
    });

    it("fixed-fixed deflection is less than simply-supported (stiffer)", () => {
      const ssResult = calculateBeamDeflection(BASE_INPUT);
      const ffResult = calculateBeamDeflection({ ...BASE_INPUT, beamType: "fixed-fixed" });
      expect(ffResult!.maxDeflection).toBeLessThan(ssResult!.maxDeflection);
    });
  });

  describe("units output", () => {
    it("returns deflection in mm, in, cm", () => {
      const result = calculateBeamDeflection(BASE_INPUT);
      expect(result!.units.deflection.mm).toBeGreaterThan(0);
      expect(result!.units.deflection.in).toBeGreaterThan(0);
      expect(result!.units.deflection.cm).toBeGreaterThan(0);
    });
  });

  describe("longer beam deflects more", () => {
    it("10m beam deflects more than 5m beam (same load & section)", () => {
      const short = calculateBeamDeflection(BASE_INPUT);
      const long = calculateBeamDeflection({ ...BASE_INPUT, length: 10 });
      expect(long!.maxDeflection).toBeGreaterThan(short!.maxDeflection);
    });
  });
});
