import { describe, expect, it } from "vitest";
import { calculateHypervisorComparison } from "@/lib/converters/infrastructure/hypervisor-comparison";

const BASE_INPUT = {
  vmCount: 50,
  avgVcpusPerVm: 4,
  avgRamPerVm: 8, // GB
  avgStoragePerVm: 100, // GB
  coresPerCpu: 16,
  cpusPerHost: 2,
  ramPerHost: 256, // GB
  storagePerHost: 10000, // GB
  haMode: "n_plus_1" as const,
  enableReplica: false,
  enableSnapshots: false,
  vcpuRatio: 4,
  ramOvercommit: 1,
  powerCostPerKwh: 0.12,
  hostPowerWatts: 500,
  laborHourlyRate: 100,
  hardwareCostPerHost: 20000,
  hardwareLifespanYears: 5,
  windowsEdition: "datacenter" as const,
};

describe("calculateHypervisorComparison", () => {
  describe("throws for invalid inputs", () => {
    it("throws for vmCount = 0", () => {
      expect(() => calculateHypervisorComparison({ ...BASE_INPUT, vmCount: 0 })).toThrow();
    });

    it("throws for avgVcpusPerVm = 0", () => {
      expect(() => calculateHypervisorComparison({ ...BASE_INPUT, avgVcpusPerVm: 0 })).toThrow();
    });

    it("throws for coresPerCpu = 0", () => {
      expect(() => calculateHypervisorComparison({ ...BASE_INPUT, coresPerCpu: 0 })).toThrow();
    });
  });

  describe("comparison results", () => {
    it("returns result with platforms array", () => {
      const result = calculateHypervisorComparison(BASE_INPUT);
      expect(result.platforms).toBeInstanceOf(Array);
      expect(result.platforms.length).toBeGreaterThan(0);
    });

    it("returns platforms for vmware, hyperv, proxmox, xcp-ng", () => {
      const result = calculateHypervisorComparison(BASE_INPUT);
      expect(result.platforms.length).toBeGreaterThanOrEqual(3);
    });

    it("each platform has a name and sizing info", () => {
      const result = calculateHypervisorComparison(BASE_INPUT);
      for (const platform of result.platforms) {
        expect(platform.platform).toBeTruthy();
        expect(platform.platformName).toBeTruthy();
        expect(platform.totalHostsRequired).toBeGreaterThan(0);
      }
    });

    it("each platform has costs.total.fiveYear > 0", () => {
      const result = calculateHypervisorComparison(BASE_INPUT);
      for (const platform of result.platforms) {
        expect(platform.costs.total.fiveYear).toBeGreaterThan(0);
      }
    });
  });

  describe("recommendation", () => {
    it("has costLeader, performanceLeader, bestOverall fields", () => {
      const result = calculateHypervisorComparison(BASE_INPUT);
      expect(result.recommendation.costLeader).toBeTruthy();
      expect(result.recommendation.performanceLeader).toBeTruthy();
      expect(result.recommendation.bestOverall).toBeTruthy();
    });

    it("has reasoning array", () => {
      const result = calculateHypervisorComparison(BASE_INPUT);
      expect(result.recommendation.reasoning).toBeInstanceOf(Array);
    });
  });

  describe("comparison metrics", () => {
    it("has costDifference with lowest and highest platform", () => {
      const result = calculateHypervisorComparison(BASE_INPUT);
      expect(result.comparison.costDifference.lowest).toBeTruthy();
      expect(result.comparison.costDifference.highest).toBeTruthy();
    });

    it("savingsPercent is between 0 and 100", () => {
      const result = calculateHypervisorComparison(BASE_INPUT);
      expect(result.comparison.costDifference.savingsPercent).toBeGreaterThanOrEqual(0);
      expect(result.comparison.costDifference.savingsPercent).toBeLessThanOrEqual(100);
    });
  });

  describe("features data", () => {
    it("returns features comparison data", () => {
      const result = calculateHypervisorComparison(BASE_INPUT);
      expect(result.features).toBeDefined();
    });
  });
});
