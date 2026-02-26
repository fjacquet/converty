import { describe, expect, it } from "vitest";
import { calculateAdvancedDoF, formatDistance } from "@/lib/converters/photo/advanced-dof";

const validInput = {
  aperture: 8,
  focalLength: 50,
  subjectDistance: 3,
  sensorWidth: 36,
  sensorHeight: 24,
  printWidth: 254,
  viewingDistance: 450,
  visualAcuity: 30,
};

describe("calculateAdvancedDoF", () => {
  it("returns null for zero aperture", () => {
    expect(calculateAdvancedDoF({ ...validInput, aperture: 0 })).toBeNull();
  });

  it("returns null for zero focal length", () => {
    expect(calculateAdvancedDoF({ ...validInput, focalLength: 0 })).toBeNull();
  });

  it("returns null for zero subject distance", () => {
    expect(calculateAdvancedDoF({ ...validInput, subjectDistance: 0 })).toBeNull();
  });

  it("calculates near and far limits", () => {
    const result = calculateAdvancedDoF(validInput);
    expect(result).not.toBeNull();
    expect(result?.nearLimit).toBeGreaterThan(0);
    expect(result?.nearLimit ?? 0).toBeLessThan(3);
  });

  it("provides adjustedCoC and standardCoC fields", () => {
    const result = calculateAdvancedDoF(validInput);
    expect(result).not.toBeNull();
    expect(result?.adjustedCoC).toBeGreaterThan(0);
    expect(result?.standardCoC).toBeGreaterThan(0);
  });

  it("provides hyperfocalDistance field", () => {
    const result = calculateAdvancedDoF(validInput);
    expect(result?.hyperfocalDistance).toBeGreaterThan(0);
  });

  it("comparison object has standardNear, standardFar, standardDoF fields", () => {
    const result = calculateAdvancedDoF(validInput);
    expect(result?.comparison).toHaveProperty("standardNear");
    expect(result?.comparison).toHaveProperty("standardFar");
    expect(result?.comparison).toHaveProperty("standardDoF");
  });

  it("wider aperture gives smaller DOF than narrower aperture", () => {
    const wide = calculateAdvancedDoF({ ...validInput, aperture: 1.8 });
    const narrow = calculateAdvancedDoF({ ...validInput, aperture: 16 });
    expect(wide).not.toBeNull();
    expect(narrow).not.toBeNull();
    const wideDof = wide?.totalDoF === Infinity ? 9999 : (wide?.totalDoF ?? 0);
    const narrowDof = narrow?.totalDoF === Infinity ? 9999 : (narrow?.totalDoF ?? 0);
    expect(wideDof).toBeLessThan(narrowDof);
  });
});

describe("formatDistance", () => {
  it("formats infinity as ∞", () => {
    expect(formatDistance(Infinity)).toBe("∞");
  });

  it("formats sub-meter as cm", () => {
    expect(formatDistance(0.5)).toBe("50 cm");
  });

  it("formats meters with 2 decimal places for < 10m", () => {
    expect(formatDistance(3.5)).toBe("3.50 m");
  });

  it("formats large distances with 1 decimal place", () => {
    expect(formatDistance(25.5)).toBe("25.5 m");
  });
});
