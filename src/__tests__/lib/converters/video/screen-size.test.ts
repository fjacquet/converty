import { describe, expect, it } from "vitest";
import { calculateScreenSize } from "@/lib/converters/video/screen-size";

describe("calculateScreenSize", () => {
  it("returns null for zero diagonal", () => {
    expect(calculateScreenSize(0, 16, 9)).toBeNull();
  });

  it("returns null for zero aspect width", () => {
    expect(calculateScreenSize(55, 0, 9)).toBeNull();
  });

  it("calculates 16:9 screen width and height from diagonal", () => {
    const result = calculateScreenSize(55, 16, 9);
    expect(result).not.toBeNull();
    // Verify using Pythagorean theorem: width² + height² = diagonal²
    const calculatedDiagonal = Math.sqrt((result?.width ?? 0) ** 2 + (result?.height ?? 0) ** 2);
    expect(calculatedDiagonal).toBeCloseTo(55, 0);
  });

  it("aspect ratio string is set correctly", () => {
    const result = calculateScreenSize(55, 16, 9);
    expect(result?.aspectRatio).toBe("16:9");
  });

  it("calculates PPI when pixel dimensions are provided", () => {
    const result = calculateScreenSize(55, 16, 9, "inches", 1920, 1080);
    expect(result?.ppi).toBeDefined();
    expect(result?.ppi ?? 0).toBeGreaterThan(0);
  });

  it("PPI not defined when no pixel dimensions", () => {
    const result = calculateScreenSize(55, 16, 9);
    expect(result?.ppi).toBeUndefined();
  });

  it("area is width × height", () => {
    const result = calculateScreenSize(55, 16, 9);
    expect(result).not.toBeNull();
    const expectedArea = (result?.width ?? 0) * (result?.height ?? 0);
    expect(result?.area).toBeCloseTo(expectedArea, 0);
  });
});
