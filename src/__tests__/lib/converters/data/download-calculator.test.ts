import { describe, expect, it } from "vitest";
import { calculateDownloadTime } from "@/lib/converters/data/download-calculator";

describe("calculateDownloadTime", () => {
  it("returns null for zero file size", () => {
    expect(calculateDownloadTime(0, "GB", 10, "mbps")).toBeNull();
  });

  it("returns null for zero bandwidth", () => {
    expect(calculateDownloadTime(1, "GB", 0, "mbps")).toBeNull();
  });

  it("returns null for unknown file size unit", () => {
    expect(calculateDownloadTime(1, "ZB", 10, "mbps")).toBeNull();
  });

  it("returns null for unknown bandwidth unit", () => {
    expect(calculateDownloadTime(1, "GB", 10, "unknown")).toBeNull();
  });

  it("calculates 1 GB at 10 Mbps correctly", () => {
    // 1 GB = 1024 MB = 1024*1024*1024 bytes × 8 bits = 8589934592 bits
    // 10 Mbps = 10,000,000 bps
    // Time = 8589934592 / 10000000 = 858.99s ≈ 859s
    const result = calculateDownloadTime(1, "GB", 10, "mbps");
    expect(result).not.toBeNull();
    expect(result?.totalSeconds).toBeGreaterThan(800);
    expect(result?.totalSeconds).toBeLessThan(900);
  });

  it("faster connection gives shorter download time", () => {
    const slow = calculateDownloadTime(1, "GB", 10, "mbps");
    const fast = calculateDownloadTime(1, "GB", 100, "mbps");
    expect(slow).not.toBeNull();
    expect(fast).not.toBeNull();
    expect(fast?.totalSeconds ?? 0).toBeLessThan(slow?.totalSeconds ?? 0);
  });

  it("returns formatted string", () => {
    const result = calculateDownloadTime(1, "GB", 10, "mbps");
    expect(typeof result?.formatted).toBe("string");
    expect(result?.formatted.length).toBeGreaterThan(0);
  });

  it("decomposes time into days, hours, minutes, seconds", () => {
    const result = calculateDownloadTime(1, "GB", 10, "mbps");
    expect(result).toHaveProperty("days");
    expect(result).toHaveProperty("hours");
    expect(result).toHaveProperty("minutes");
    expect(result).toHaveProperty("seconds");
  });
});
