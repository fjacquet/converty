import { describe, expect, it } from "vitest";
import { calculateDepthOfField } from "@/lib/converters/photo/depth-of-field";

describe("calculateDepthOfField", () => {
  it("returns null for zero aperture", () => {
    expect(calculateDepthOfField(0, 50, 3)).toBeNull();
  });

  it("returns null for zero focal length", () => {
    expect(calculateDepthOfField(1.8, 0, 3)).toBeNull();
  });

  it("returns null for zero distance", () => {
    expect(calculateDepthOfField(1.8, 50, 0)).toBeNull();
  });

  it("near limit is less than focus distance", () => {
    const result = calculateDepthOfField(8, 50, 3);
    expect(result).not.toBeNull();
    expect(result?.nearLimit ?? 0).toBeLessThan(3);
  });

  it("wide aperture gives smaller DOF than narrow aperture", () => {
    const wide = calculateDepthOfField(1.8, 50, 3);
    const narrow = calculateDepthOfField(16, 50, 3);
    expect(wide).not.toBeNull();
    expect(narrow).not.toBeNull();
    // wide aperture gives smaller total DOF
    const wideDof = wide?.totalDoF === Infinity ? 999 : (wide?.totalDoF ?? 0);
    const narrowDof = narrow?.totalDoF === Infinity ? 999 : (narrow?.totalDoF ?? 0);
    expect(wideDof).toBeLessThan(narrowDof);
  });

  it("returns hyperfocal distance > 0", () => {
    const result = calculateDepthOfField(8, 50, 3);
    expect(result?.hyperfocalDistance).toBeGreaterThan(0);
  });

  it("at or beyond hyperfocal distance, far limit is infinity", () => {
    // Set distance to well beyond hyperfocal
    const result = calculateDepthOfField(8, 50, 10000);
    expect(result?.farLimit).toBe(Infinity);
  });

  it("in-front-of-subject distance > 0", () => {
    const result = calculateDepthOfField(8, 50, 3);
    expect(result?.inFrontOfSubject).toBeGreaterThan(0);
  });
});
