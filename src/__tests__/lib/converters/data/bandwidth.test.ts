import { describe, expect, it } from "vitest";
import { BANDWIDTH_UNITS, convertBandwidth } from "@/lib/converters/data/bandwidth";

describe("convertBandwidth", () => {
  it("returns null for value <= 0", () => {
    expect(convertBandwidth(0, "mbps")).toBeNull();
    expect(convertBandwidth(-1, "mbps")).toBeNull();
  });

  it("returns null for unknown unit", () => {
    expect(convertBandwidth(100, "unknown")).toBeNull();
  });

  it("converts 1 Gbps to 1000 Mbps", () => {
    const result = convertBandwidth(1, "gbps");
    expect(result).not.toBeNull();
    const mbps = result?.conversions.find((c) => c.unit === "Mbps");
    expect(mbps?.value).toBeCloseTo(1000, 0);
  });

  it("1 GBps = 8 Gbps", () => {
    const result = convertBandwidth(1, "GBps");
    expect(result).not.toBeNull();
    const gbps = result?.conversions.find((c) => c.unit === "Gbps");
    expect(gbps?.value).toBeCloseTo(8, 0);
  });

  it("returns time-based usage (perDay, perWeek, perMonth)", () => {
    const result = convertBandwidth(100, "mbps");
    expect(result).not.toBeNull();
    expect(result?.perDay.GB).toBeGreaterThan(0);
    expect(result?.perWeek.GB).toBeGreaterThan(result?.perDay.GB ?? 0);
    expect(result?.perMonth.GB).toBeGreaterThan(result?.perWeek.GB ?? 0);
  });

  it("returns bitsPerSecond correctly", () => {
    const result = convertBandwidth(1, "mbps");
    expect(result?.bitsPerSecond).toBe(1000000);
  });
});

describe("BANDWIDTH_UNITS", () => {
  it("contains bps, kbps, mbps, gbps", () => {
    const ids = BANDWIDTH_UNITS.map((u) => u.id);
    expect(ids).toContain("bps");
    expect(ids).toContain("kbps");
    expect(ids).toContain("mbps");
    expect(ids).toContain("gbps");
  });
});
