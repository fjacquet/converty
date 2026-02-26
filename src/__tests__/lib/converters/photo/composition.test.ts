import { describe, expect, it } from "vitest";
import { calculateComposition } from "@/lib/converters/photo/composition";

describe("calculateComposition", () => {
  it("returns null for zero focal length", () => {
    expect(calculateComposition(0, 5)).toBeNull();
  });

  it("returns null for zero distance", () => {
    expect(calculateComposition(50, 0)).toBeNull();
  });

  it("returns null for zero crop factor", () => {
    expect(calculateComposition(50, 5, 0)).toBeNull();
  });

  it("calculates composition for 50mm on full frame at 5m", () => {
    const result = calculateComposition(50, 5);
    expect(result).not.toBeNull();
    expect(result?.fieldOfView).toBeGreaterThan(0);
    expect(result?.horizontalFOV).toBeGreaterThan(0);
    expect(result?.verticalFOV).toBeGreaterThan(0);
    expect(result?.effectiveFocalLength).toBe(50);
  });

  it("applies crop factor to effective focal length", () => {
    const fullFrame = calculateComposition(50, 5, 1);
    const apsC = calculateComposition(50, 5, 1.5);
    expect(fullFrame).not.toBeNull();
    expect(apsC).not.toBeNull();
    expect(apsC?.effectiveFocalLength).toBe(75);
    // APS-C has narrower FOV due to crop factor
    expect(apsC?.horizontalFOV).toBeLessThan(fullFrame?.horizontalFOV ?? 0);
  });

  it("calculates subject coverage percentage", () => {
    const result = calculateComposition(50, 5);
    expect(result).not.toBeNull();
    expect(result?.subjectCoverage).toBeGreaterThan(0);
    expect(result?.subjectCoverage).toBeLessThanOrEqual(100);
  });

  it("wider angle gives larger FOV", () => {
    const wide = calculateComposition(24, 5);
    const tele = calculateComposition(200, 5);
    expect(wide).not.toBeNull();
    expect(tele).not.toBeNull();
    expect(wide?.fieldOfView ?? 0).toBeGreaterThan(tele?.fieldOfView ?? 0);
  });
});
