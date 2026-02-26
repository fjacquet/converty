import { describe, expect, it } from "vitest";
import { calculateFootLambert } from "@/lib/converters/video/foot-lambert";

describe("calculateFootLambert", () => {
  it("returns null for value <= 0", () => {
    expect(calculateFootLambert(0, "fl")).toBeNull();
    expect(calculateFootLambert(-1, "fl")).toBeNull();
  });

  it("converts 14 fl to nits: 14 × 3.426 ≈ 47.96", () => {
    const result = calculateFootLambert(14, "fl");
    expect(result).not.toBeNull();
    expect(result?.nits).toBeCloseTo(14 * 3.426, 1);
  });

  it("converts nits back to fl (round-trip)", () => {
    const nits = 14 * 3.426;
    const result = calculateFootLambert(nits, "nits");
    expect(result).not.toBeNull();
    expect(result?.footLamberts).toBeCloseTo(14, 0);
  });

  it("candelasPerM2 equals nits", () => {
    const result = calculateFootLambert(14, "fl");
    expect(result?.candelasPerM2).toBe(result?.nits);
  });

  it("returns description key string", () => {
    const result = calculateFootLambert(14, "fl");
    expect(typeof result?.descriptionKey).toBe("string");
    expect(result?.descriptionKey.length).toBeGreaterThan(0);
  });

  it("returns null when converting lumens without screen size", () => {
    expect(calculateFootLambert(10000, "lumens")).toBeNull();
  });

  it("converts lumens with screen size", () => {
    const result = calculateFootLambert(10000, "lumens", 20, 10);
    expect(result).not.toBeNull();
    expect(result?.footLamberts).toBeGreaterThan(0);
  });
});
