import { describe, expect, it } from "vitest";
import {
  calculateAspectRatio,
  calculateDimensionFromRatio,
} from "@/lib/converters/photo/aspect-ratio";

describe("calculateAspectRatio", () => {
  it("returns null for zero width", () => {
    expect(calculateAspectRatio(0, 1080)).toBeNull();
  });

  it("returns null for zero height", () => {
    expect(calculateAspectRatio(1920, 0)).toBeNull();
  });

  it("calculates 1920x1080 as 16:9", () => {
    const result = calculateAspectRatio(1920, 1080);
    expect(result).not.toBeNull();
    expect(result?.ratio).toBe("16:9");
  });

  it("calculates 1600x1200 as 4:3", () => {
    const result = calculateAspectRatio(1600, 1200);
    expect(result).not.toBeNull();
    expect(result?.ratio).toBe("4:3");
  });

  it("detects landscape orientation", () => {
    const result = calculateAspectRatio(1920, 1080);
    expect(result?.isLandscape).toBe(true);
    expect(result?.isPortrait).toBe(false);
  });

  it("detects portrait orientation", () => {
    const result = calculateAspectRatio(1080, 1920);
    expect(result?.isPortrait).toBe(true);
    expect(result?.isLandscape).toBe(false);
  });

  it("detects square", () => {
    const result = calculateAspectRatio(500, 500);
    expect(result?.isSquare).toBe(true);
  });

  it("calculates decimal ratio", () => {
    const result = calculateAspectRatio(1920, 1080);
    expect(result?.decimal).toBeCloseTo(1.778, 2);
  });
});

describe("calculateDimensionFromRatio", () => {
  it("returns null for zero ratio width", () => {
    expect(calculateDimensionFromRatio(0, 9, 1920)).toBeNull();
  });

  it("calculates height from target width using 16:9 ratio", () => {
    const result = calculateDimensionFromRatio(16, 9, 1920);
    expect(result).not.toBeNull();
    expect(result?.width).toBe(1920);
    expect(result?.height).toBe(1080);
  });

  it("calculates width from target height using 16:9 ratio", () => {
    const result = calculateDimensionFromRatio(16, 9, undefined, 1080);
    expect(result).not.toBeNull();
    expect(result?.width).toBe(1920);
    expect(result?.height).toBe(1080);
  });
});
