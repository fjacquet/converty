import { describe, expect, it } from "vitest";
import { calculateAspectFit } from "@/lib/converters/photo/aspect-fit";

describe("calculateAspectFit", () => {
  it("returns null for zero screen width", () => {
    expect(calculateAspectFit(1920, 1080, 0, 600)).toBeNull();
  });

  it("returns null for zero screen height", () => {
    expect(calculateAspectFit(1920, 1080, 800, 0)).toBeNull();
  });

  it("returns null for zero image width", () => {
    expect(calculateAspectFit(0, 1080, 800, 600)).toBeNull();
  });

  it("fits 1920x1080 into 800x600 with horizontal letterboxing", () => {
    const result = calculateAspectFit(1920, 1080, 800, 600);
    expect(result).not.toBeNull();
    expect(result?.fittedWidth).toBe(800);
    expect(result?.fittedHeight).toBe(450);
    expect(result?.letterboxing).toBe("horizontal");
  });

  it("fits portrait 600x800 into 400x400 with vertical letterboxing", () => {
    const result = calculateAspectFit(600, 800, 400, 400);
    expect(result).not.toBeNull();
    expect(result?.fittedHeight).toBe(400);
    expect(result?.fittedWidth).toBe(300);
    expect(result?.letterboxing).toBe("vertical");
  });

  it("returns no letterboxing for exact aspect match", () => {
    const result = calculateAspectFit(1920, 1080, 1920, 1080);
    expect(result).not.toBeNull();
    expect(result?.letterboxing).toBe("none");
    expect(result?.fillPercentage).toBe(100);
  });

  it("returns a valid scale factor", () => {
    const result = calculateAspectFit(1920, 1080, 800, 600);
    expect(result).not.toBeNull();
    expect(result?.scale).toBeGreaterThan(0);
    expect(result?.scale).toBeLessThanOrEqual(1);
  });
});
