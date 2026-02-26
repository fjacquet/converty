import { describe, expect, it } from "vitest";
import { convertLatency, LATENCY_UNITS } from "@/lib/converters/network/latency-converter";

describe("convertLatency", () => {
  describe("invalid inputs return null", () => {
    it("returns null for value of 0", () => {
      expect(convertLatency(0, "ms")).toBeNull();
    });

    it("returns null for negative value", () => {
      expect(convertLatency(-1, "ms")).toBeNull();
    });

    it("returns null for unknown unit", () => {
      expect(convertLatency(100, "unknown")).toBeNull();
    });
  });

  describe("unit conversions: milliseconds as source", () => {
    it("1 ms equals 1000 microseconds", () => {
      const result = convertLatency(1, "ms");
      expect(result).not.toBeNull();
      const usConversion = result!.conversions.find((c) => c.unit.id === "us");
      expect(usConversion?.value).toBeCloseTo(1000, 5);
    });

    it("1 ms equals 1,000,000 nanoseconds", () => {
      const result = convertLatency(1, "ms");
      const nsConversion = result!.conversions.find((c) => c.unit.id === "ns");
      expect(nsConversion?.value).toBeCloseTo(1_000_000, -1);
    });

    it("1 ms equals 0.001 seconds", () => {
      const result = convertLatency(1, "ms");
      const sConversion = result!.conversions.find((c) => c.unit.id === "s");
      expect(sConversion?.value).toBeCloseTo(0.001, 5);
    });

    it("1000 ms equals 1 second", () => {
      const result = convertLatency(1000, "ms");
      const sConversion = result!.conversions.find((c) => c.unit.id === "s");
      expect(sConversion?.value).toBeCloseTo(1, 5);
    });
  });

  describe("unit conversions: seconds as source", () => {
    it("1 second equals 1000 milliseconds", () => {
      const result = convertLatency(1, "s");
      const msConversion = result!.conversions.find((c) => c.unit.id === "ms");
      expect(msConversion?.value).toBeCloseTo(1000, 5);
    });
  });

  describe("nanosecond base value", () => {
    it("returns correct nanoseconds for 1ms input", () => {
      const result = convertLatency(1, "ms");
      expect(result!.nanoseconds).toBeCloseTo(1_000_000, -1);
    });

    it("returns correct nanoseconds for 1s input", () => {
      const result = convertLatency(1, "s");
      expect(result!.nanoseconds).toBeCloseTo(1_000_000_000, -3);
    });
  });

  describe("latency categories", () => {
    it("categorizes < 1ms as ultraLow", () => {
      const result = convertLatency(0.5, "ms");
      expect(result!.category).toBe("ultraLow");
    });

    it("categorizes 10ms as low", () => {
      const result = convertLatency(10, "ms");
      expect(result!.category).toBe("low");
    });

    it("categorizes 50ms as moderate", () => {
      const result = convertLatency(50, "ms");
      expect(result!.category).toBe("moderate");
    });

    it("categorizes 200ms as high", () => {
      const result = convertLatency(200, "ms");
      expect(result!.category).toBe("high");
    });
  });

  describe("typical use cases", () => {
    it("returns a typicalUseCase string", () => {
      const result = convertLatency(100, "ms");
      expect(typeof result!.typicalUseCase).toBe("string");
      expect(result!.typicalUseCase.length).toBeGreaterThan(0);
    });

    it("very low latency (0.0005ms) maps to sameRack", () => {
      const result = convertLatency(500, "ns");
      expect(result!.typicalUseCase).toBe("sameRack");
    });

    it("satellite latency (200ms) maps to satellite", () => {
      const result = convertLatency(200, "ms");
      expect(result!.typicalUseCase).toBe("satellite");
    });
  });

  describe("LATENCY_UNITS constant", () => {
    it("contains 4 units", () => {
      expect(LATENCY_UNITS).toHaveLength(4);
    });

    it("includes s, ms, us, ns unit ids", () => {
      const ids = LATENCY_UNITS.map((u) => u.id);
      expect(ids).toContain("s");
      expect(ids).toContain("ms");
      expect(ids).toContain("us");
      expect(ids).toContain("ns");
    });
  });
});
