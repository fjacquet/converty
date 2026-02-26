import { describe, expect, it } from "vitest";
import { calculateVolume } from "@/lib/converters/math/volume";

describe("calculateVolume", () => {
  it("returns null for non-positive dimensions in cube", () => {
    expect(calculateVolume({ shape: "cube", length: 0 })).toBeNull();
    expect(calculateVolume({ shape: "cube", length: -3 })).toBeNull();
  });

  it("calculates cube volume: side=3 = 27", () => {
    const result = calculateVolume({ shape: "cube", length: 3 });
    expect(result).not.toBeNull();
    expect(result!.volume).toBe(27);
  });

  it("calculates cylinder volume: r=1, h=1 ≈ 3.14159", () => {
    const result = calculateVolume({ shape: "cylinder", radius: 1, height: 1 });
    expect(result).not.toBeNull();
    expect(result!.volume).toBeCloseTo(Math.PI, 4);
  });

  it.each([
    ["rectangular", { shape: "rectangular" as const, length: 2, width: 3, height: 4 }, 24],
    ["sphere", { shape: "sphere" as const, radius: 1 }, (4 / 3) * Math.PI],
    ["cone", { shape: "cone" as const, radius: 1, height: 3 }, Math.PI],
  ])("calculates %s volume", (_name, input, expectedVolume) => {
    const result = calculateVolume(input);
    expect(result).not.toBeNull();
    expect(result!.volume).toBeCloseTo(expectedVolume, 3);
  });

  it("returns null for missing height in rectangular", () => {
    expect(calculateVolume({ shape: "rectangular", length: 2, width: 3 })).toBeNull();
  });
});
