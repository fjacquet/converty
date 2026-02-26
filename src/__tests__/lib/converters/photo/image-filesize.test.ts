import { describe, expect, it } from "vitest";
import { calculateImageFilesize } from "@/lib/converters/photo/image-filesize";

describe("calculateImageFilesize", () => {
  it("returns null for zero width", () => {
    expect(calculateImageFilesize(0, 1080, "jpeg")).toBeNull();
  });

  it("returns null for zero height", () => {
    expect(calculateImageFilesize(1920, 0, "jpeg")).toBeNull();
  });

  it("calculates jpeg typical size for 1920x1080", () => {
    const result = calculateImageFilesize(1920, 1080, "jpeg");
    expect(result).not.toBeNull();
    expect(result?.estimatedMB).toBeGreaterThan(0);
    expect(result?.totalPixels).toBe(2073600);
    expect(result?.megapixels).toBeCloseTo(2.07, 1);
  });

  it("raw format has larger size than jpeg", () => {
    const jpeg = calculateImageFilesize(4000, 3000, "jpeg");
    const raw = calculateImageFilesize(4000, 3000, "raw");
    expect(jpeg).not.toBeNull();
    expect(raw).not.toBeNull();
    expect(raw?.estimatedBytes ?? 0).toBeGreaterThan(jpeg?.estimatedBytes ?? 0);
  });

  it("high quality is larger than low quality", () => {
    const low = calculateImageFilesize(4000, 3000, "jpeg", "low");
    const high = calculateImageFilesize(4000, 3000, "jpeg", "high");
    expect(low).not.toBeNull();
    expect(high).not.toBeNull();
    expect(high?.estimatedBytes ?? 0).toBeGreaterThan(low?.estimatedBytes ?? 0);
  });

  it("calculates formatted size string", () => {
    const result = calculateImageFilesize(4000, 3000, "jpeg");
    expect(result?.formatted).toMatch(/MB|KB|bytes/);
  });
});
