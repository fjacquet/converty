import { describe, expect, it } from "vitest";
import { calculateArea } from "@/lib/converters/math/area";

describe("calculateArea", () => {
  describe("rectangle", () => {
    it("returns null for non-positive dimensions", () => {
      expect(calculateArea({ shape: "rectangle", length: -1, width: 5 })).toBeNull();
      expect(calculateArea({ shape: "rectangle", length: 0, width: 5 })).toBeNull();
    });

    it("calculates rectangle area", () => {
      const result = calculateArea({ shape: "rectangle", length: 4, width: 5 });
      expect(result).not.toBeNull();
      expect(result!.area).toBe(20);
      expect(result!.perimeter).toBe(18);
    });
  });

  describe("circle", () => {
    it("returns null for non-positive radius", () => {
      expect(calculateArea({ shape: "circle", radius: 0 })).toBeNull();
      expect(calculateArea({ shape: "circle", radius: -3 })).toBeNull();
    });

    it("calculates circle area from radius 5", () => {
      const result = calculateArea({ shape: "circle", radius: 5 });
      expect(result).not.toBeNull();
      expect(result!.area).toBeCloseTo(Math.PI * 25, 5);
    });
  });

  describe("triangle", () => {
    it("calculates triangle area", () => {
      const result = calculateArea({ shape: "triangle", base: 6, height: 4 });
      expect(result).not.toBeNull();
      expect(result!.area).toBe(12);
    });

    it("returns null for non-positive dimensions", () => {
      expect(calculateArea({ shape: "triangle", base: 0, height: 4 })).toBeNull();
    });
  });

  describe("shapes via it.each", () => {
    it.each([
      ["square", { shape: "square" as const, length: 3 }, 9],
      ["parallelogram", { shape: "parallelogram" as const, base: 5, height: 3 }, 15],
    ])("calculates %s area", (_name, input, expectedArea) => {
      const result = calculateArea(input);
      expect(result).not.toBeNull();
      expect(result!.area).toBe(expectedArea);
    });
  });

  describe("trapezoid", () => {
    it("returns null for missing required fields on trapezoid", () => {
      expect(calculateArea({ shape: "trapezoid" })).toBeNull();
    });

    it("calculates trapezoid area: (b1+b2)/2 * h", () => {
      const result = calculateArea({ shape: "trapezoid", base1: 3, base2: 5, height: 4 });
      expect(result).not.toBeNull();
      // (3+5)/2 * 4 = 16
      expect(result!.area).toBe(16);
    });

    it("returns null for zero base in trapezoid", () => {
      expect(calculateArea({ shape: "trapezoid", base1: 0, base2: 5, height: 4 })).toBeNull();
    });
  });

  describe("ellipse", () => {
    it("calculates ellipse area: π * a * b", () => {
      const result = calculateArea({ shape: "ellipse", radiusA: 3, radiusB: 4 });
      expect(result).not.toBeNull();
      expect(result!.area).toBeCloseTo(Math.PI * 3 * 4, 4);
    });

    it("returns null for missing radii", () => {
      expect(calculateArea({ shape: "ellipse" })).toBeNull();
    });
  });

  describe("sector", () => {
    it("calculates sector area for 90 degree sector", () => {
      // A = (90/360) * π * r² = 0.25 * π * 25
      const result = calculateArea({ shape: "sector", radius: 5, angle: 90 });
      expect(result).not.toBeNull();
      expect(result!.area).toBeCloseTo(0.25 * Math.PI * 25, 4);
    });

    it("returns null for angle > 360", () => {
      expect(calculateArea({ shape: "sector", radius: 5, angle: 361 })).toBeNull();
    });

    it("returns null for missing angle", () => {
      expect(calculateArea({ shape: "sector", radius: 5 })).toBeNull();
    });
  });

  describe("rhombus", () => {
    it("calculates rhombus area: (d1 * d2) / 2", () => {
      const result = calculateArea({ shape: "rhombus", diagonal1: 6, diagonal2: 8 });
      expect(result).not.toBeNull();
      expect(result!.area).toBe(24);
    });

    it("returns null for missing diagonals", () => {
      expect(calculateArea({ shape: "rhombus" })).toBeNull();
    });
  });
});
