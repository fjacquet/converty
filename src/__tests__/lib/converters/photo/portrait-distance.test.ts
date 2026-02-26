import { describe, expect, it } from "vitest";
import { calculatePortraitDistance } from "@/lib/converters/photo/portrait-distance";

describe("calculatePortraitDistance", () => {
  it("returns null for zero focal length", () => {
    expect(calculatePortraitDistance(0, "headshot")).toBeNull();
  });

  it("returns null for zero crop factor", () => {
    expect(calculatePortraitDistance(85, "headshot", 0)).toBeNull();
  });

  it("calculates portrait distance for 85mm headshot", () => {
    const result = calculatePortraitDistance(85, "headshot");
    expect(result).not.toBeNull();
    expect(result?.recommendedDistance).toBeGreaterThan(0);
  });

  it("longer focal length gives greater working distance", () => {
    const short = calculatePortraitDistance(50, "head-shoulders");
    const long = calculatePortraitDistance(135, "head-shoulders");
    expect(short).not.toBeNull();
    expect(long).not.toBeNull();
    expect(long?.recommendedDistance ?? 0).toBeGreaterThan(short?.recommendedDistance ?? 0);
  });

  it("full-body portrait requires more distance than headshot", () => {
    const headshot = calculatePortraitDistance(85, "headshot");
    const fullBody = calculatePortraitDistance(85, "full-body");
    expect(headshot).not.toBeNull();
    expect(fullBody).not.toBeNull();
    expect(fullBody?.recommendedDistance ?? 0).toBeGreaterThan(headshot?.recommendedDistance ?? 0);
  });

  it("returns minimum and maximum distance range", () => {
    const result = calculatePortraitDistance(85, "half-body");
    expect(result).not.toBeNull();
    expect(result?.minimumDistance ?? 0).toBeLessThan(result?.recommendedDistance ?? 0);
    expect(result?.maximumDistance ?? 0).toBeGreaterThan(result?.recommendedDistance ?? 0);
  });

  it("85mm is labeled as flattering compression", () => {
    const result = calculatePortraitDistance(85, "headshot");
    expect(result?.compressionEffect).toBe("Flattering");
  });
});
