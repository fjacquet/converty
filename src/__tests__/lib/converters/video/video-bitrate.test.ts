import { describe, expect, it } from "vitest";
import { calculateVideoBitrate } from "@/lib/converters/video/video-bitrate";

describe("calculateVideoBitrate", () => {
  it("returns null for zero width", () => {
    expect(calculateVideoBitrate(0, 1080, 30)).toBeNull();
  });

  it("returns null for zero height", () => {
    expect(calculateVideoBitrate(1920, 0, 30)).toBeNull();
  });

  it("returns null for zero fps", () => {
    expect(calculateVideoBitrate(1920, 1080, 0)).toBeNull();
  });

  it("1920x1080/30fps/h264/medium returns bitrateMbps > 0", () => {
    const result = calculateVideoBitrate(1920, 1080, 30, 8, "h264", "medium");
    expect(result).not.toBeNull();
    expect(result?.bitrateMbps).toBeGreaterThan(0);
  });

  it("h265 returns lower bitrate than h264 at same settings", () => {
    const h264 = calculateVideoBitrate(1920, 1080, 30, 8, "h264", "medium");
    const h265 = calculateVideoBitrate(1920, 1080, 30, 8, "h265", "medium");
    expect(h264).not.toBeNull();
    expect(h265).not.toBeNull();
    expect(h265?.bitrateMbps ?? 0).toBeLessThan(h264?.bitrateMbps ?? 0);
  });

  it("4K gives higher bitrate than 1080p", () => {
    const hd = calculateVideoBitrate(1920, 1080, 30, 8, "h264", "medium");
    const fourK = calculateVideoBitrate(3840, 2160, 30, 8, "h264", "medium");
    expect(hd).not.toBeNull();
    expect(fourK).not.toBeNull();
    expect(fourK?.bitrateMbps ?? 0).toBeGreaterThan(hd?.bitrateMbps ?? 0);
  });

  it("returns qualityLevel string", () => {
    const result = calculateVideoBitrate(1920, 1080, 30);
    expect(typeof result?.qualityLevel).toBe("string");
  });

  it("bitrateKbps is approximately bitrateMbps × 1000", () => {
    const result = calculateVideoBitrate(1920, 1080, 30);
    expect(result).not.toBeNull();
    // Due to rounding in source, bitrateKbps ≈ bitrateMbps × 1000 within a few kbps
    expect(result?.bitrateKbps).toBeGreaterThan(0);
    expect(result?.bitrateMbps).toBeGreaterThan(0);
    // bitrateKbps should be in the same order of magnitude as bitrateMbps * 1000
    expect(Math.abs((result?.bitrateKbps ?? 0) - (result?.bitrateMbps ?? 0) * 1000)).toBeLessThan(
      10
    );
  });
});
