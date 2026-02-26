import { describe, expect, it } from "vitest";
import { calculateHypervConsolidation } from "@/lib/converters/infrastructure/hyperv-consolidation";

const BASE_INPUT = {
  vmCount: 50,
  avgVcpusPerVm: 4,
  avgRamPerVm: 8, // GB
  avgStoragePerVm: 100, // GB
  haMode: "n_plus_1" as const,
  enableReplica: false,
  diskType: "fixed" as const,
  enableSnapshots: false,
  coresPerCpu: 16,
  cpusPerHost: 2,
  ramPerHost: 256, // GB
  storagePerHost: 10000, // GB
  vcpuRatio: 4,
  ramOvercommit: 1,
};

describe("calculateHypervConsolidation", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for vmCount = 0", () => {
      expect(calculateHypervConsolidation({ ...BASE_INPUT, vmCount: 0 })).toBeNull();
    });

    it("returns null for avgVcpusPerVm = 0", () => {
      expect(calculateHypervConsolidation({ ...BASE_INPUT, avgVcpusPerVm: 0 })).toBeNull();
    });

    it("returns null for avgRamPerVm = 0", () => {
      expect(calculateHypervConsolidation({ ...BASE_INPUT, avgRamPerVm: 0 })).toBeNull();
    });

    it("returns null for coresPerCpu = 0", () => {
      expect(calculateHypervConsolidation({ ...BASE_INPUT, coresPerCpu: 0 })).toBeNull();
    });

    it("returns null for ramPerHost = 0", () => {
      expect(calculateHypervConsolidation({ ...BASE_INPUT, ramPerHost: 0 })).toBeNull();
    });
  });

  describe("basic consolidation calculations", () => {
    it("returns non-null result for valid inputs", () => {
      const result = calculateHypervConsolidation(BASE_INPUT);
      expect(result).not.toBeNull();
    });

    it("hostsRequired is positive", () => {
      const result = calculateHypervConsolidation(BASE_INPUT);
      expect(result!.hostsRequired).toBeGreaterThan(0);
    });

    it("more VMs → more hosts required", () => {
      const small = calculateHypervConsolidation({ ...BASE_INPUT, vmCount: 10 });
      const large = calculateHypervConsolidation({ ...BASE_INPUT, vmCount: 100 });
      expect(large!.hostsRequired).toBeGreaterThanOrEqual(small!.hostsRequired);
    });
  });

  describe("storage calculation", () => {
    it("totalStorageRequired is positive", () => {
      const result = calculateHypervConsolidation(BASE_INPUT);
      expect(result!.totalStorageRequired).toBeGreaterThan(0);
    });

    it("enables snapshot storage when enableSnapshots=true", () => {
      const noSnaps = calculateHypervConsolidation({ ...BASE_INPUT, enableSnapshots: false });
      const withSnaps = calculateHypervConsolidation({ ...BASE_INPUT, enableSnapshots: true });
      expect(withSnaps!.storageBreakdown.snapshots).toBeGreaterThan(
        noSnaps!.storageBreakdown.snapshots
      );
    });

    it("enables replica storage when enableReplica=true", () => {
      const noReplica = calculateHypervConsolidation({ ...BASE_INPUT, enableReplica: false });
      const withReplica = calculateHypervConsolidation({ ...BASE_INPUT, enableReplica: true });
      expect(withReplica!.storageBreakdown.replica).toBeGreaterThan(
        noReplica!.storageBreakdown.replica
      );
    });
  });

  describe("licensing", () => {
    it("licensing object has datacenter and standard editions", () => {
      const result = calculateHypervConsolidation(BASE_INPUT);
      expect(result!.licensing.datacenter.totalCost).toBeGreaterThan(0);
      expect(result!.licensing.standard.totalCost).toBeGreaterThan(0);
    });

    it("licensing recommendation is either datacenter or standard", () => {
      const result = calculateHypervConsolidation(BASE_INPUT);
      expect(["datacenter", "standard"]).toContain(result!.licensing.recommendation);
    });
  });

  describe("HA configuration", () => {
    it("n_plus_1 results in extra host vs none", () => {
      const noHA = calculateHypervConsolidation({ ...BASE_INPUT, haMode: "none" as const });
      const withHA = calculateHypervConsolidation({ ...BASE_INPUT, haMode: "n_plus_1" as const });
      expect(withHA!.hostsRequired).toBeGreaterThan(noHA!.hostsRequired);
    });
  });

  describe("result structure", () => {
    it("has steps array", () => {
      const result = calculateHypervConsolidation(BASE_INPUT);
      expect(result!.steps).toBeInstanceOf(Array);
      expect(result!.steps.length).toBeGreaterThan(0);
    });
  });
});
