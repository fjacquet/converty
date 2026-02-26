import { describe, expect, it } from "vitest";
import {
  calculateVideoFileSize,
  durationToSeconds,
  secondsToDuration,
} from "@/lib/converters/video/video-file-size";

describe("calculateVideoFileSize", () => {
  it("returns null for zero duration", () => {
    expect(calculateVideoFileSize({ duration: 0, bitrateMbps: 10 })).toBeNull();
  });

  it("returns null for zero bitrate", () => {
    expect(calculateVideoFileSize({ duration: 3600, bitrateMbps: 0 })).toBeNull();
  });

  it("calculates file size for 10 Mbps × 60 minutes", () => {
    // Video bytes = 10 × 10^6 × 3600 / 8 = 4,500,000,000 bytes ≈ 4.19 GB
    const result = calculateVideoFileSize({ duration: 3600, bitrateMbps: 10 });
    expect(result).not.toBeNull();
    expect(result?.totalGB).toBeCloseTo(4.19, 0);
  });

  it("higher bitrate gives larger file", () => {
    const low = calculateVideoFileSize({ duration: 3600, bitrateMbps: 5 });
    const high = calculateVideoFileSize({ duration: 3600, bitrateMbps: 50 });
    expect(low).not.toBeNull();
    expect(high).not.toBeNull();
    expect(high?.totalBytes ?? 0).toBeGreaterThan(low?.totalBytes ?? 0);
  });

  it("includes audio bytes in total", () => {
    const result = calculateVideoFileSize({
      duration: 3600,
      bitrateMbps: 10,
      audioBitrateKbps: 192,
    });
    expect(result?.audioBytes).toBeGreaterThan(0);
    expect(result?.totalBytes ?? 0).toBeGreaterThan(result?.videoBytes ?? 0);
  });

  it("returns formatted string", () => {
    const result = calculateVideoFileSize({ duration: 3600, bitrateMbps: 10 });
    expect(result?.formatted).toMatch(/GB|MB/);
  });
});

describe("durationToSeconds", () => {
  it("converts 1h 30m 0s to 5400s", () => {
    expect(durationToSeconds(1, 30, 0)).toBe(5400);
  });
});

describe("secondsToDuration", () => {
  it("converts 5400s to 1h 30m 0s", () => {
    const result = secondsToDuration(5400);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(0);
  });
});
