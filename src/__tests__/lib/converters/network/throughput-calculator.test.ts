import { describe, expect, it } from "vitest";
import { calculateThroughput, TIME_UNITS } from "@/lib/converters/network/throughput-calculator";

describe("calculateThroughput", () => {
  describe("invalid inputs return null", () => {
    it("returns null for dataSize of 0", () => {
      expect(
        calculateThroughput({
          dataSize: 0,
          dataSizeUnit: "MB",
          transferTime: 10,
          transferTimeUnit: "s",
        })
      ).toBeNull();
    });

    it("returns null for transferTime of 0", () => {
      expect(
        calculateThroughput({
          dataSize: 100,
          dataSizeUnit: "MB",
          transferTime: 0,
          transferTimeUnit: "s",
        })
      ).toBeNull();
    });

    it("returns null for negative dataSize", () => {
      expect(
        calculateThroughput({
          dataSize: -1,
          dataSizeUnit: "MB",
          transferTime: 10,
          transferTimeUnit: "s",
        })
      ).toBeNull();
    });

    it("returns null for unknown dataSizeUnit", () => {
      expect(
        calculateThroughput({
          dataSize: 100,
          dataSizeUnit: "XB",
          transferTime: 10,
          transferTimeUnit: "s",
        })
      ).toBeNull();
    });

    it("returns null for unknown transferTimeUnit", () => {
      expect(
        calculateThroughput({
          dataSize: 100,
          dataSizeUnit: "MB",
          transferTime: 10,
          transferTimeUnit: "year",
        })
      ).toBeNull();
    });
  });

  describe("basic throughput calculations", () => {
    it("calculates ~80 Mbps for 100 MB in 10 seconds", () => {
      // 100 MB = 100 * 1024 * 1024 bytes; / 10s → ~10.5 MB/s → ~83 Mbps
      const result = calculateThroughput({
        dataSize: 100,
        dataSizeUnit: "MB",
        transferTime: 10,
        transferTimeUnit: "s",
      });
      expect(result).not.toBeNull();
      // 100 MB * 8 bits/byte / 10s = 83.9 Mbps
      expect(result!.bitsPerSecond).toBeGreaterThan(0);
      expect(result!.bytesPerSecond).toBeGreaterThan(0);
    });

    it("larger file size with same time yields higher throughput", () => {
      const small = calculateThroughput({
        dataSize: 10,
        dataSizeUnit: "MB",
        transferTime: 10,
        transferTimeUnit: "s",
      });
      const large = calculateThroughput({
        dataSize: 100,
        dataSizeUnit: "MB",
        transferTime: 10,
        transferTimeUnit: "s",
      });
      expect(large!.bitsPerSecond).toBeGreaterThan(small!.bitsPerSecond);
    });

    it("same file size with shorter time yields higher throughput", () => {
      const slow = calculateThroughput({
        dataSize: 100,
        dataSizeUnit: "MB",
        transferTime: 100,
        transferTimeUnit: "s",
      });
      const fast = calculateThroughput({
        dataSize: 100,
        dataSizeUnit: "MB",
        transferTime: 10,
        transferTimeUnit: "s",
      });
      expect(fast!.bitsPerSecond).toBeGreaterThan(slow!.bitsPerSecond);
    });

    it("bitsPerSecond equals 8 * bytesPerSecond", () => {
      const result = calculateThroughput({
        dataSize: 1,
        dataSizeUnit: "GB",
        transferTime: 60,
        transferTimeUnit: "s",
      });
      expect(result!.bitsPerSecond).toBeCloseTo(result!.bytesPerSecond * 8, 5);
    });
  });

  describe("result structure", () => {
    it("includes conversions array with multiple units", () => {
      const result = calculateThroughput({
        dataSize: 1,
        dataSizeUnit: "GB",
        transferTime: 1,
        transferTimeUnit: "min",
      });
      expect(result!.conversions.length).toBeGreaterThan(0);
    });

    it("includes steps array", () => {
      const result = calculateThroughput({
        dataSize: 100,
        dataSizeUnit: "MB",
        transferTime: 10,
        transferTimeUnit: "s",
      });
      expect(result!.steps.length).toBeGreaterThan(0);
    });

    it("includes comparison key string", () => {
      const result = calculateThroughput({
        dataSize: 100,
        dataSizeUnit: "MB",
        transferTime: 10,
        transferTimeUnit: "s",
      });
      expect(typeof result!.comparison).toBe("string");
      expect(result!.comparison.length).toBeGreaterThan(0);
    });

    it("includes comparisonRatio number", () => {
      const result = calculateThroughput({
        dataSize: 100,
        dataSizeUnit: "MB",
        transferTime: 10,
        transferTimeUnit: "s",
      });
      expect(typeof result!.comparisonRatio).toBe("number");
      expect(result!.comparisonRatio).toBeGreaterThan(0);
    });
  });

  describe("TIME_UNITS constant", () => {
    it("contains ms, s, min, hr units", () => {
      const ids = TIME_UNITS.map((u) => u.id);
      expect(ids).toContain("ms");
      expect(ids).toContain("s");
      expect(ids).toContain("min");
      expect(ids).toContain("hr");
    });
  });
});
