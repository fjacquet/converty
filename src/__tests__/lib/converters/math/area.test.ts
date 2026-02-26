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

  it("returns null for missing required fields on trapezoid", () => {
    expect(calculateArea({ shape: "trapezoid" })).toBeNull();
  });
});
