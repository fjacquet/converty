import { describe, expect, it } from "vitest";
import { calculateSurfaceArea } from "@/lib/converters/math/surface-area";

describe("calculateSurfaceArea", () => {
  it("returns null for non-positive dimensions", () => {
    expect(calculateSurfaceArea({ shape: "cube", side: 0 })).toBeNull();
    expect(calculateSurfaceArea({ shape: "cube", side: -2 })).toBeNull();
  });

  it("calculates sphere surface area from r=1 ≈ 12.566", () => {
    const result = calculateSurfaceArea({ shape: "sphere", radius: 1 });
    expect(result).not.toBeNull();
    expect(result!.totalSurfaceArea).toBeCloseTo(4 * Math.PI, 3);
  });

  it("calculates cube surface area from side=2 = 24", () => {
    const result = calculateSurfaceArea({ shape: "cube", side: 2 });
    expect(result).not.toBeNull();
    expect(result!.totalSurfaceArea).toBe(24);
  });

  it.each([
    ["cube", { shape: "cube" as const, side: 3 }, 54],
    [
      "rectangularPrism",
      { shape: "rectangularPrism" as const, length: 2, width: 3, height: 4 },
      52,
    ],
  ])("calculates %s surface area", (_name, input, expectedSA) => {
    const result = calculateSurfaceArea(input);
    expect(result).not.toBeNull();
    expect(result!.totalSurfaceArea).toBeCloseTo(expectedSA, 3);
  });

  it("calculates cylinder total surface area", () => {
    const result = calculateSurfaceArea({ shape: "cylinder", radius: 1, height: 1 });
    expect(result).not.toBeNull();
    // SA = 2πr(r+h) = 2π×1×2 = 4π ≈ 12.566
    expect(result!.totalSurfaceArea).toBeCloseTo(4 * Math.PI, 3);
  });
});
