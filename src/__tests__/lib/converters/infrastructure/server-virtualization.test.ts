import { describe, expect, it } from "vitest";
import { calculateServerVirtualization } from "@/lib/converters/infrastructure/server-virtualization";

const BASE_INPUT = {
  platform: "vmware" as const,
  vmCount: 100,
  vCpuPerVm: 4,
  ramPerVmGb: 16,
  hostCores: 32,
  hostRamGb: 512,
  vCpuToCoreRatio: 4,
  targetCpuUtilization: 80,
  targetRamUtilization: 85,
  highAvailability: false,
};

describe("calculateServerVirtualization", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for vmCount = 0", () => {
      expect(calculateServerVirtualization({ ...BASE_INPUT, vmCount: 0 })).toBeNull();
    });

    it("returns null for hostCores = 0", () => {
      expect(calculateServerVirtualization({ ...BASE_INPUT, hostCores: 0 })).toBeNull();
    });

    it("returns null for hostRamGb = 0", () => {
      expect(calculateServerVirtualization({ ...BASE_INPUT, hostRamGb: 0 })).toBeNull();
    });

    it("returns null for vCpuToCoreRatio = 0", () => {
      expect(calculateServerVirtualization({ ...BASE_INPUT, vCpuToCoreRatio: 0 })).toBeNull();
    });

    it("returns null for targetCpuUtilization = 0", () => {
      expect(calculateServerVirtualization({ ...BASE_INPUT, targetCpuUtilization: 0 })).toBeNull();
    });
  });

  describe("basic virtualization calculations", () => {
    it("returns non-null result for valid inputs", () => {
      const result = calculateServerVirtualization(BASE_INPUT);
      expect(result).not.toBeNull();
    });

    it("hostsNeededTotal is positive", () => {
      const result = calculateServerVirtualization(BASE_INPUT);
      expect(result!.hostsNeededTotal).toBeGreaterThan(0);
    });

    it("totalVCpuRequired = vmCount × vCpuPerVm", () => {
      const result = calculateServerVirtualization(BASE_INPUT);
      expect(result!.totalVCpuRequired).toBe(BASE_INPUT.vmCount * BASE_INPUT.vCpuPerVm);
    });

    it("totalRamRequiredGb = vmCount × ramPerVmGb", () => {
      const result = calculateServerVirtualization(BASE_INPUT);
      expect(result!.totalRamRequiredGb).toBe(BASE_INPUT.vmCount * BASE_INPUT.ramPerVmGb);
    });
  });

  describe("overcommit ratio effect", () => {
    it("higher vCPU ratio → effective CPU capacity increases per host", () => {
      const lowRatio = calculateServerVirtualization({ ...BASE_INPUT, vCpuToCoreRatio: 2 });
      const highRatio = calculateServerVirtualization({ ...BASE_INPUT, vCpuToCoreRatio: 8 });
      expect(highRatio!.effectiveCpuPerHost).toBeGreaterThan(lowRatio!.effectiveCpuPerHost);
    });
  });

  describe("high availability", () => {
    it("N+1 HA adds extra host", () => {
      const noHA = calculateServerVirtualization({ ...BASE_INPUT, highAvailability: false });
      const withHA = calculateServerVirtualization({ ...BASE_INPUT, highAvailability: true });
      expect(withHA!.hostsNeededTotal).toBeGreaterThan(noHA!.hostsNeededTotal);
    });
  });

  describe("multi-platform support", () => {
    it.each([
      "vmware",
      "hyperv",
      "proxmox",
    ] as const)("platform %s returns non-null result", (platform) => {
      const result = calculateServerVirtualization({ ...BASE_INPUT, platform });
      expect(result).not.toBeNull();
    });
  });

  describe("limiting factor", () => {
    it("limitingFactor is either cpu or ram", () => {
      const result = calculateServerVirtualization(BASE_INPUT);
      expect(["cpu", "ram"]).toContain(result!.limitingFactor);
    });

    it("hostsNeededTotal = max(hostsNeededByCpu, hostsNeededByRam) + HA", () => {
      const result = calculateServerVirtualization({ ...BASE_INPUT, highAvailability: false });
      const expected = Math.max(result!.hostsNeededByCpu, result!.hostsNeededByRam);
      expect(result!.hostsNeededBeforeHa).toBe(expected);
    });
  });

  describe("result structure", () => {
    it("has steps array", () => {
      const result = calculateServerVirtualization(BASE_INPUT);
      expect(result!.steps).toBeInstanceOf(Array);
      expect(result!.steps.length).toBeGreaterThan(0);
    });
  });
});
