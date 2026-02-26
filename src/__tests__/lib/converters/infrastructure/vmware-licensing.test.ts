import { describe, expect, it } from "vitest";
import { calculateVmwareLicensing } from "@/lib/converters/infrastructure/vmware-licensing";

const BASE_INPUT = {
  hostCount: 4,
  cpusPerHost: 2,
  coresPerCpu: 16,
  productType: "vcf" as const,
  termYears: 3 as const,
};

describe("calculateVmwareLicensing", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for hostCount = 0", () => {
      expect(calculateVmwareLicensing({ ...BASE_INPUT, hostCount: 0 })).toBeNull();
    });

    it("returns null for cpusPerHost = 0", () => {
      expect(calculateVmwareLicensing({ ...BASE_INPUT, cpusPerHost: 0 })).toBeNull();
    });

    it("returns null for coresPerCpu = 0", () => {
      expect(calculateVmwareLicensing({ ...BASE_INPUT, coresPerCpu: 0 })).toBeNull();
    });

    it("returns null for invalid termYears", () => {
      expect(calculateVmwareLicensing({ ...BASE_INPUT, termYears: 2 as 1 | 3 | 5 })).toBeNull();
    });
  });

  describe("core licensing math", () => {
    it("returns non-null result for valid inputs", () => {
      const result = calculateVmwareLicensing(BASE_INPUT);
      expect(result).not.toBeNull();
    });

    it("totalPhysicalCores = hostCount × cpusPerHost × coresPerCpu", () => {
      const result = calculateVmwareLicensing(BASE_INPUT);
      const expected = BASE_INPUT.hostCount * BASE_INPUT.cpusPerHost * BASE_INPUT.coresPerCpu;
      expect(result!.totalPhysicalCores).toBe(expected);
    });

    it("annualCost is positive", () => {
      const result = calculateVmwareLicensing(BASE_INPUT);
      expect(result!.annualCost).toBeGreaterThan(0);
    });

    it("totalCost = annualCost × termYears", () => {
      const result = calculateVmwareLicensing(BASE_INPUT);
      expect(result!.totalCost).toBeCloseTo(result!.annualCost * BASE_INPUT.termYears, 0);
    });
  });

  describe("16-core minimum enforcement", () => {
    it("minCoreEnforced=true when coresPerCpu < 16", () => {
      const result = calculateVmwareLicensing({ ...BASE_INPUT, coresPerCpu: 8 });
      expect(result!.minCoreEnforced).toBe(true);
      expect(result!.coresPerCpuLicensed).toBe(16);
    });

    it("minCoreEnforced=false when coresPerCpu >= 16", () => {
      const result = calculateVmwareLicensing({ ...BASE_INPUT, coresPerCpu: 20 });
      expect(result!.minCoreEnforced).toBe(false);
      expect(result!.coresPerCpuLicensed).toBe(20);
    });
  });

  describe("vSAN entitlement", () => {
    it("vcf product has vsanEntitlementTib > 0", () => {
      const result = calculateVmwareLicensing({ ...BASE_INPUT, productType: "vcf" });
      expect(result!.vsanEntitlementTib).not.toBeNull();
      expect(result!.vsanEntitlementTib).toBeGreaterThan(0);
    });

    it("vvf product has vsanEntitlementTib > 0", () => {
      const result = calculateVmwareLicensing({ ...BASE_INPUT, productType: "vvf" });
      expect(result!.vsanEntitlementTib).not.toBeNull();
      expect(result!.vsanEntitlementTib).toBeGreaterThan(0);
    });

    it("vsphere-ep has no vSAN entitlement", () => {
      const result = calculateVmwareLicensing({ ...BASE_INPUT, productType: "vsphere-ep" });
      expect(result!.vsanEntitlementTib).toBeNull();
    });
  });

  describe("different product types", () => {
    it.each([
      "vcf",
      "vvf",
      "vsphere-ep",
      "vsphere-std",
    ] as const)("productType %s returns non-null result", (productType) => {
      const result = calculateVmwareLicensing({ ...BASE_INPUT, productType });
      expect(result).not.toBeNull();
    });

    it("vcf is more expensive per core than vsphere-std", () => {
      const vcf = calculateVmwareLicensing({ ...BASE_INPUT, productType: "vcf" });
      const std = calculateVmwareLicensing({ ...BASE_INPUT, productType: "vsphere-std" });
      expect(vcf!.pricePerCorePerYear).toBeGreaterThan(std!.pricePerCorePerYear);
    });
  });

  describe("result structure", () => {
    it("has steps array", () => {
      const result = calculateVmwareLicensing(BASE_INPUT);
      expect(result!.steps).toBeInstanceOf(Array);
      expect(result!.steps.length).toBeGreaterThan(0);
    });
  });
});
