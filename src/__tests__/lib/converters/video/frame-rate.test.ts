import { describe, expect, it } from "vitest";
import { calculateFrameRateConversion } from "@/lib/converters/video/frame-rate";

describe("calculateFrameRateConversion", () => {
  it("returns null for zero source fps", () => {
    expect(calculateFrameRateConversion(0, 30)).toBeNull();
  });

  it("returns null for zero target fps", () => {
    expect(calculateFrameRateConversion(24, 0)).toBeNull();
  });

  it("same fps: no conversion needed", () => {
    const result = calculateFrameRateConversion(24, 24);
    expect(result).not.toBeNull();
    expect(result?.conversionMethod).toBe("None required");
    expect(result?.speedChange).toBeCloseTo(0, 1);
  });

  it("30 to 60 fps: frame duplication", () => {
    const result = calculateFrameRateConversion(30, 60);
    expect(result).not.toBeNull();
    expect(result?.conversionMethod).toBe("Frame duplication");
  });

  it("60 to 30 fps: frame dropping", () => {
    const result = calculateFrameRateConversion(60, 30);
    expect(result).not.toBeNull();
    expect(result?.conversionMethod).toBe("Frame dropping");
  });

  it("returns ffmpeg command", () => {
    const result = calculateFrameRateConversion(24, 30);
    expect(result?.ffmpegCommand).toBeTruthy();
    expect(typeof result?.ffmpegCommand).toBe("string");
  });

  it("PAL/Film conversion adds warning", () => {
    const result = calculateFrameRateConversion(24, 25);
    expect(result).not.toBeNull();
    expect(result?.warnings.length).toBeGreaterThan(0);
  });
});
