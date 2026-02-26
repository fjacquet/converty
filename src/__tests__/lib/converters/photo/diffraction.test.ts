import { describe, expect, it } from "vitest";
import { calculateDiffraction } from "@/lib/converters/photo/diffraction";

describe("calculateDiffraction", () => {
  it("returns null for zero aperture", () => {
    expect(
      calculateDiffraction({ aperture: 0, sensorWidth: 36, sensorHeight: 24, megapixels: 24 })
    ).toBeNull();
  });

  it("returns null for zero megapixels", () => {
    expect(
      calculateDiffraction({ aperture: 8, sensorWidth: 36, sensorHeight: 24, megapixels: 0 })
    ).toBeNull();
  });

  it("calculates airy disk diameter for f/8", () => {
    const result = calculateDiffraction({
      aperture: 8,
      sensorWidth: 36,
      sensorHeight: 24,
      megapixels: 24,
    });
    expect(result).not.toBeNull();
    // Airy disk = 2.44 × 0.55µm × 8 = 10.7µm
    expect(result?.airyDiskDiameter).toBeCloseTo(10.74, 1);
  });

  it("narrow aperture gives larger airy disk (more diffraction)", () => {
    const wide = calculateDiffraction({
      aperture: 2.8,
      sensorWidth: 36,
      sensorHeight: 24,
      megapixels: 24,
    });
    const narrow = calculateDiffraction({
      aperture: 22,
      sensorWidth: 36,
      sensorHeight: 24,
      megapixels: 24,
    });
    expect(wide).not.toBeNull();
    expect(narrow).not.toBeNull();
    expect(narrow?.airyDiskDiameter ?? 0).toBeGreaterThan(wide?.airyDiskDiameter ?? 0);
  });

  it("returns pixel pitch > 0", () => {
    const result = calculateDiffraction({
      aperture: 8,
      sensorWidth: 36,
      sensorHeight: 24,
      megapixels: 24,
    });
    expect(result?.pixelPitch).toBeGreaterThan(0);
  });

  it("returns isDiffractionLimited boolean", () => {
    const result = calculateDiffraction({
      aperture: 8,
      sensorWidth: 36,
      sensorHeight: 24,
      megapixels: 24,
    });
    expect(typeof result?.isDiffractionLimited).toBe("boolean");
  });

  it("returns optimal aperture range", () => {
    const result = calculateDiffraction({
      aperture: 8,
      sensorWidth: 36,
      sensorHeight: 24,
      megapixels: 24,
    });
    expect(result?.optimalApertureRange.min).toBeGreaterThan(0);
    expect(result?.optimalApertureRange.max).toBeGreaterThan(0);
  });
});
