import { describe, expect, it } from "vitest";
import { calculateVolume } from "@/lib/converters/math/volume";

describe("calculateVolume", () => {
  it("returns null for non-positive dimensions in cube", () => {
    expect(calculateVolume({ shape: "cube", length: 0 })).toBeNull();
    expect(calculateVolume({ shape: "cube", length: -3 })).toBeNull();
  });

  it("calculates cube volume: side=3 = 27", () => {
    const result = calculateVolume({ shape: "cube", length: 3 });
    expect(result).not.toBeNull();
    expect(result!.volume).toBe(27);
  });

  it("calculates cylinder volume: r=1, h=1 ≈ 3.14159", () => {
    const result = calculateVolume({ shape: "cylinder", radius: 1, height: 1 });
    expect(result).not.toBeNull();
    expect(result!.volume).toBeCloseTo(Math.PI, 4);
  });

  it.each([
    ["rectangular", { shape: "rectangular" as const, length: 2, width: 3, height: 4 }, 24],
    ["sphere", { shape: "sphere" as const, radius: 1 }, (4 / 3) * Math.PI],
    ["cone", { shape: "cone" as const, radius: 1, height: 3 }, Math.PI],
  ])("calculates %s volume", (_name, input, expectedVolume) => {
    const result = calculateVolume(input);
    expect(result).not.toBeNull();
    expect(result!.volume).toBeCloseTo(expectedVolume, 3);
  });

  it("returns null for missing height in rectangular", () => {
    expect(calculateVolume({ shape: "rectangular", length: 2, width: 3 })).toBeNull();
  });

  describe("pyramid", () => {
    it("calculates pyramid volume: (1/3) * baseArea * h", () => {
      // V = (1/3) * 9 * 6 = 18
      const result = calculateVolume({ shape: "pyramid", baseArea: 9, height: 6 });
      expect(result).not.toBeNull();
      expect(result!.volume).toBeCloseTo(18, 5);
    });

    it("returns null for missing baseArea", () => {
      expect(calculateVolume({ shape: "pyramid", height: 6 })).toBeNull();
    });
  });

  describe("prism", () => {
    it("calculates prism volume: baseArea * h", () => {
      const result = calculateVolume({ shape: "prism", baseArea: 12, height: 5 });
      expect(result).not.toBeNull();
      expect(result!.volume).toBe(60);
    });

    it("returns null for missing height", () => {
      expect(calculateVolume({ shape: "prism", baseArea: 12 })).toBeNull();
    });
  });

  describe("torus", () => {
    it("calculates torus volume: 2π² * R * r²", () => {
      const result = calculateVolume({ shape: "torus", majorRadius: 5, minorRadius: 2 });
      expect(result).not.toBeNull();
      const expectedVol = 2 * Math.PI * Math.PI * 5 * 4;
      expect(result!.volume).toBeCloseTo(expectedVol, 4);
    });

    it("returns null when minorRadius >= majorRadius", () => {
      expect(calculateVolume({ shape: "torus", majorRadius: 2, minorRadius: 2 })).toBeNull();
      expect(calculateVolume({ shape: "torus", majorRadius: 1, minorRadius: 3 })).toBeNull();
    });

    it("returns null for missing radii", () => {
      expect(calculateVolume({ shape: "torus" })).toBeNull();
    });
  });
});
