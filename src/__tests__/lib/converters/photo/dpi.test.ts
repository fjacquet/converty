import { describe, expect, it } from "vitest";
import { calculateDPI, calculatePixelsToDPI } from "@/lib/converters/photo/dpi";

describe("calculateDPI", () => {
  it("returns null for zero dpi", () => {
    expect(calculateDPI(8, 10, 0)).toBeNull();
  });

  it("returns null for zero print width", () => {
    expect(calculateDPI(0, 10, 300)).toBeNull();
  });

  it("returns null for zero print height", () => {
    expect(calculateDPI(8, 0, 300)).toBeNull();
  });

  it("calculates 8x10 at 300dpi correctly", () => {
    const result = calculateDPI(8, 10, 300);
    expect(result).not.toBeNull();
    expect(result?.pixelWidth).toBe(2400);
    expect(result?.pixelHeight).toBe(3000);
  });

  it("calculates total pixels correctly", () => {
    const result = calculateDPI(8, 10, 300);
    expect(result?.totalPixels).toBe(7200000);
  });

  it("calculates megapixels correctly", () => {
    const result = calculateDPI(8, 10, 300);
    expect(result?.megapixels).toBeCloseTo(7.2, 1);
  });

  it("returns Excellent print quality at 300dpi", () => {
    const result = calculateDPI(8, 10, 300);
    expect(result?.printQuality).toBe("Excellent");
  });

  it("returns Poor print quality at 50dpi", () => {
    const result = calculateDPI(8, 10, 50);
    expect(result?.printQuality).toBe("Poor");
  });
});

describe("calculatePixelsToDPI", () => {
  it("returns null for zero pixel width", () => {
    expect(calculatePixelsToDPI(0, 1080, 8, 10)).toBeNull();
  });

  it("calculates DPI from 2400x3000 at 8x10 inches", () => {
    const result = calculatePixelsToDPI(2400, 3000, 8, 10);
    expect(result).not.toBeNull();
    expect(result?.horizontalDPI).toBe(300);
    expect(result?.verticalDPI).toBe(300);
    expect(result?.effectiveDPI).toBe(300);
  });
});
