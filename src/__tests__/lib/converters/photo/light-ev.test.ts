import { describe, expect, it } from "vitest";
import { calculateEV, calculateSettingsForEV } from "@/lib/converters/photo/light-ev";

describe("calculateEV", () => {
  it("returns null for zero aperture", () => {
    expect(calculateEV(0, 1 / 125, 100)).toBeNull();
  });

  it("returns null for zero shutter speed", () => {
    expect(calculateEV(4, 0, 100)).toBeNull();
  });

  it("returns null for zero ISO", () => {
    expect(calculateEV(4, 1 / 125, 0)).toBeNull();
  });

  it("calculates EV for f/4, 1/125s, ISO100 ≈ EV 9", () => {
    // EV = log2(N²/t) = log2(16 * 125) = log2(2000) ≈ 11
    // EV100 = EV + log2(100/100) = EV + 0 = EV
    const result = calculateEV(4, 1 / 125, 100);
    expect(result).not.toBeNull();
    expect(result?.ev).toBeCloseTo(11, 0);
  });

  it("higher ISO increases EV100", () => {
    const low = calculateEV(4, 1 / 125, 100);
    const high = calculateEV(4, 1 / 125, 800);
    expect(low).not.toBeNull();
    expect(high).not.toBeNull();
    expect(high?.ev100 ?? 0).toBeGreaterThan(low?.ev100 ?? 0);
  });

  it("returns a valid light level string", () => {
    const result = calculateEV(4, 1 / 125, 100);
    expect(result?.lightLevel).toBeTruthy();
    expect(typeof result?.lightLevel).toBe("string");
  });

  it("returns lux > 0", () => {
    const result = calculateEV(4, 1 / 125, 100);
    expect(result?.lux).toBeGreaterThan(0);
  });
});

describe("calculateSettingsForEV", () => {
  it("calculates shutter speed for fixed aperture", () => {
    const result = calculateSettingsForEV(10, 4);
    expect(result.shutterSpeed).toBeDefined();
    expect(result.shutterSpeed).toBeGreaterThan(0);
  });

  it("calculates aperture for fixed shutter speed", () => {
    const result = calculateSettingsForEV(10, undefined, 1 / 125);
    expect(result.aperture).toBeDefined();
    expect(result.aperture).toBeGreaterThan(0);
  });
});
