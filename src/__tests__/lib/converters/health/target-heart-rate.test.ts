import { describe, expect, it } from "vitest";
import { calculateTargetHeartRate } from "@/lib/converters/health/target-heart-rate";

describe("calculateTargetHeartRate", () => {
  describe("null for invalid inputs", () => {
    it("returns null for age <= 0", () => {
      expect(calculateTargetHeartRate({ age: 0 })).toBeNull();
    });

    it("returns null for age > 120", () => {
      expect(calculateTargetHeartRate({ age: 121 })).toBeNull();
    });
  });

  describe("max heart rate — Tanaka formula (208 - 0.7 × age)", () => {
    it("calculates max HR for age 30", () => {
      // Tanaka: 208 - 0.7 × 30 = 208 - 21 = 187
      const result = calculateTargetHeartRate({ age: 30 });
      expect(result).not.toBeNull();
      expect(result!.maxHeartRate).toBe(187);
    });

    it("older person has lower max heart rate", () => {
      const young = calculateTargetHeartRate({ age: 25 });
      const old = calculateTargetHeartRate({ age: 60 });
      expect(young).not.toBeNull();
      expect(old).not.toBeNull();
      expect(old!.maxHeartRate).toBeLessThan(young!.maxHeartRate);
    });
  });

  describe("heart rate zones without resting HR", () => {
    it("returns 5 zones", () => {
      const result = calculateTargetHeartRate({ age: 30 });
      expect(result).not.toBeNull();
      expect(result!.zones.length).toBe(5);
    });

    it("fat burning zone is 60-70% of max HR", () => {
      const result = calculateTargetHeartRate({ age: 30 });
      expect(result).not.toBeNull();
      const maxHR = 187; // Tanaka for age 30
      expect(result!.fatBurningZone.min).toBe(Math.round(maxHR * 0.6));
      expect(result!.fatBurningZone.max).toBe(Math.round(maxHR * 0.7));
    });

    it("zones are in ascending order of intensity", () => {
      const result = calculateTargetHeartRate({ age: 30 });
      expect(result).not.toBeNull();
      for (let i = 1; i < result!.zones.length; i++) {
        expect(result!.zones[i].minBpm).toBeGreaterThanOrEqual(result!.zones[i - 1].minBpm);
      }
    });
  });

  describe("Karvonen method with resting HR", () => {
    it("calculates heart rate reserve when resting HR provided", () => {
      // HRR = 187 - 60 = 127
      const result = calculateTargetHeartRate({ age: 30, restingHeartRate: 60 });
      expect(result).not.toBeNull();
      expect(result!.heartRateReserve).toBe(127);
    });

    it("fat burning zone with Karvonen is different from simple percentage", () => {
      const simple = calculateTargetHeartRate({ age: 30 });
      const karvonen = calculateTargetHeartRate({ age: 30, restingHeartRate: 60 });
      expect(simple).not.toBeNull();
      expect(karvonen).not.toBeNull();
      // Karvonen adds resting HR back, so min > simple percentage alone
      expect(karvonen!.fatBurningZone.min).toBeGreaterThan(simple!.fatBurningZone.min);
    });
  });
});
