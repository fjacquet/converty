import { describe, expect, it } from "vitest";
import {
  calculateDimensionsFromMegapixels,
  calculateMegapixels,
} from "@/lib/converters/photo/megapixels";

describe("calculateMegapixels", () => {
  it("returns null for zero width", () => {
    expect(calculateMegapixels(0, 3000)).toBeNull();
  });

  it("returns null for zero height", () => {
    expect(calculateMegapixels(4000, 0)).toBeNull();
  });

  it("calculates 4000x3000 as 12MP", () => {
    const result = calculateMegapixels(4000, 3000);
    expect(result).not.toBeNull();
    expect(result?.megapixels).toBe(12);
  });

  it("calculates 1920x1080 as ~2.07MP", () => {
    const result = calculateMegapixels(1920, 1080);
    expect(result).not.toBeNull();
    expect(result?.megapixels).toBeCloseTo(2.07, 1);
  });

  it("detects landscape orientation", () => {
    const result = calculateMegapixels(4000, 3000);
    expect(result?.orientation).toBe("landscape");
  });

  it("detects portrait orientation", () => {
    const result = calculateMegapixels(3000, 4000);
    expect(result?.orientation).toBe("portrait");
  });

  it("detects square orientation", () => {
    const result = calculateMegapixels(1000, 1000);
    expect(result?.orientation).toBe("square");
  });

  it("calculates correct total pixels", () => {
    const result = calculateMegapixels(4000, 3000);
    expect(result?.totalPixels).toBe(12000000);
  });
});

describe("calculateDimensionsFromMegapixels", () => {
  it("returns null for zero megapixels", () => {
    expect(calculateDimensionsFromMegapixels(0, 16, 9)).toBeNull();
  });

  it("calculates 12MP at 4:3 ratio", () => {
    const result = calculateDimensionsFromMegapixels(12, 4, 3);
    expect(result).not.toBeNull();
    expect(result?.width).toBeCloseTo(4000, -1);
    expect(result?.height).toBeCloseTo(3000, -1);
  });
});
