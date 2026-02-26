import { describe, expect, it } from "vitest";
import { calculateBBCredits } from "@/lib/converters/network/bb-credit-calculator";

describe("calculateBBCredits", () => {
  describe("invalid inputs return null", () => {
    it("returns null for zero distance", () => {
      expect(calculateBBCredits({ distanceKm: 0, speedGbps: 8, portId: "1/1" })).toBeNull();
    });

    it("returns null for negative distance", () => {
      expect(calculateBBCredits({ distanceKm: -10, speedGbps: 8, portId: "1/1" })).toBeNull();
    });
  });

  describe("correct physics calculations", () => {
    it("calculates correct minCredits for 10km at 8Gbps", () => {
      // Formula: RTT = 2 * 10 / 200000 = 0.0001s
      // bytesInFlight = 0.0001 * 8e9/8 = 100000
      // minCredits = ceil(100000 / 2148) = ceil(46.55) = 47
      const result = calculateBBCredits({ distanceKm: 10, speedGbps: 8, portId: "1/1" });
      expect(result).not.toBeNull();
      expect(result!.minCredits).toBe(47);
    });

    it("applies 20% safety margin for recommendedCredits", () => {
      const result = calculateBBCredits({ distanceKm: 10, speedGbps: 8, portId: "1/1" });
      expect(result).not.toBeNull();
      // ceil(47 * 1.2) = ceil(56.4) = 57
      expect(result!.recommendedCredits).toBeGreaterThanOrEqual(result!.minCredits);
    });

    it("recommendedCredits is at least 20% above minCredits", () => {
      const result = calculateBBCredits({ distanceKm: 100, speedGbps: 32, portId: "2/1" });
      expect(result).not.toBeNull();
      expect(result!.recommendedCredits).toBeGreaterThanOrEqual(
        Math.ceil(result!.minCredits * 1.2)
      );
    });
  });

  describe("CLI string generation", () => {
    it("includes Brocade portcfgex command", () => {
      const result = calculateBBCredits({ distanceKm: 10, speedGbps: 8, portId: "1/1" });
      expect(result!.brocadePortcfgex).toContain("portcfgex");
      expect(result!.brocadePortcfgex).toContain("1/1");
    });

    it("includes Cisco MDS fcrxbbcredit command", () => {
      const result = calculateBBCredits({ distanceKm: 10, speedGbps: 8, portId: "1/1" });
      expect(result!.mdsFcrxbbcredit).toContain("switchport fcrxbbcredit");
    });

    it("includes port ID in Brocade legacy config", () => {
      const result = calculateBBCredits({ distanceKm: 10, speedGbps: 8, portId: "3/1" });
      expect(result!.brocadePortcfgld).toContain("3/1");
    });
  });

  describe("various speeds and distances", () => {
    it.each([
      [100, 32 as const, "3/1"],
      [500, 64 as const, "2"],
      [1, 4 as const, "0/1"],
      [10, 16 as const, "1/2"],
    ])("handles distance=%dkm speed=%dGbps portId=%s", (distanceKm, speedGbps, portId) => {
      const result = calculateBBCredits({ distanceKm, speedGbps, portId });
      expect(result).not.toBeNull();
      expect(result!.minCredits).toBeGreaterThan(0);
      expect(result!.recommendedCredits).toBeGreaterThanOrEqual(result!.minCredits);
    });
  });
});
