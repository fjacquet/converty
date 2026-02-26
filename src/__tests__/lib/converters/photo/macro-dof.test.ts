import { describe, expect, it } from "vitest";
import {
  calculateFocusStackShots,
  calculateMacroDoF,
  calculateMacroDoFWithFocalLength,
} from "@/lib/converters/photo/macro-dof";

describe("calculateMacroDoF", () => {
  it("returns null for zero aperture", () => {
    expect(calculateMacroDoF({ aperture: 0, magnification: 1, coc: 0.03 })).toBeNull();
  });

  it("returns null for zero magnification", () => {
    expect(calculateMacroDoF({ aperture: 11, magnification: 0, coc: 0.03 })).toBeNull();
  });

  it("returns null for zero CoC", () => {
    expect(calculateMacroDoF({ aperture: 11, magnification: 1, coc: 0 })).toBeNull();
  });

  it("calculates shallow DOF at 1:1 macro", () => {
    const result = calculateMacroDoF({ aperture: 11, magnification: 1, coc: 0.03 });
    expect(result).not.toBeNull();
    // DOF should be in mm range
    expect(result?.totalDoF).toBeGreaterThan(0);
    expect(result?.totalDoF ?? 0).toBeLessThan(50); // less than 50mm
  });

  it("higher magnification gives shallower DOF", () => {
    const halfSize = calculateMacroDoF({ aperture: 11, magnification: 0.5, coc: 0.03 });
    const lifeSize = calculateMacroDoF({ aperture: 11, magnification: 1, coc: 0.03 });
    expect(halfSize).not.toBeNull();
    expect(lifeSize).not.toBeNull();
    expect(lifeSize?.totalDoF ?? 0).toBeLessThan(halfSize?.totalDoF ?? 0);
  });

  it("for symmetric lens: inFront equals behind", () => {
    const result = calculateMacroDoF({ aperture: 11, magnification: 1, coc: 0.03 });
    expect(result).not.toBeNull();
    expect(result?.inFront).toBeCloseTo(result?.behind ?? 0, 3);
  });

  it("returns effective aperture > marked aperture", () => {
    const result = calculateMacroDoF({ aperture: 11, magnification: 1, coc: 0.03 });
    expect(result?.effectiveAperture ?? 0).toBeGreaterThan(11);
  });
});

describe("calculateMacroDoFWithFocalLength", () => {
  it("returns working distance when focal length provided", () => {
    const result = calculateMacroDoFWithFocalLength(11, 1, 0.03, 100);
    expect(result).not.toBeNull();
    expect(result?.workingDistance).toBeGreaterThan(0);
  });
});

describe("calculateFocusStackShots", () => {
  it("returns at least 1 shot", () => {
    const shots = calculateFocusStackShots(10, 11, 1, 0.03);
    expect(shots).toBeGreaterThanOrEqual(1);
  });

  it("more depth needed → more shots", () => {
    const fewShots = calculateFocusStackShots(5, 11, 1, 0.03);
    const manyShots = calculateFocusStackShots(50, 11, 1, 0.03);
    expect(manyShots).toBeGreaterThan(fewShots);
  });
});
