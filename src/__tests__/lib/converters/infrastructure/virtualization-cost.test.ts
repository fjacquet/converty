import { describe, expect, it } from "vitest";
import { calculateVirtualizationCost } from "@/lib/converters/infrastructure/virtualization-cost";

const BASE_INPUT = {
  platform: "vmware" as const,
  serverCost: 100000,
  storageCost: 50000,
  networkCost: 20000,
  hypervisorLicenseCost: 35000,
  osLicenseCost: 10000,
  backupSoftwareCost: 5000,
  powerCostPerKwh: 0.12,
  totalPowerKw: 10,
  pue: 1.5,
  datacenterCostPerRu: 50,
  totalRackUnits: 20,
  laborCostAnnual: 80000,
  vmCount: 100,
  termYears: 3 as const,
};

describe("calculateVirtualizationCost", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for vmCount = 0", () => {
      expect(calculateVirtualizationCost({ ...BASE_INPUT, vmCount: 0 })).toBeNull();
    });

    it("returns null for pue < 1.0", () => {
      expect(calculateVirtualizationCost({ ...BASE_INPUT, pue: 0.5 })).toBeNull();
    });

    it("returns null for negative serverCost", () => {
      expect(calculateVirtualizationCost({ ...BASE_INPUT, serverCost: -1 })).toBeNull();
    });

    it("returns null for invalid termYears", () => {
      expect(calculateVirtualizationCost({ ...BASE_INPUT, termYears: 2 as 1 | 3 | 5 })).toBeNull();
    });
  });

  describe("TCO calculations", () => {
    it("returns non-null result for valid inputs", () => {
      const result = calculateVirtualizationCost(BASE_INPUT);
      expect(result).not.toBeNull();
    });

    it("tco > capex (OPEX adds to cost over time)", () => {
      const result = calculateVirtualizationCost(BASE_INPUT);
      expect(result!.tco).toBeGreaterThan(result!.capex);
    });

    it("capex = serverCost + storageCost + networkCost", () => {
      const result = calculateVirtualizationCost(BASE_INPUT);
      const expected = BASE_INPUT.serverCost + BASE_INPUT.storageCost + BASE_INPUT.networkCost;
      expect(result!.capex).toBe(expected);
    });

    it("costPerVm > 0", () => {
      const result = calculateVirtualizationCost(BASE_INPUT);
      expect(result!.costPerVm).toBeGreaterThan(0);
    });

    it("costPerVmMonthly > 0", () => {
      const result = calculateVirtualizationCost(BASE_INPUT);
      expect(result!.costPerVmMonthly).toBeGreaterThan(0);
    });
  });

  describe("longer term = higher total cost", () => {
    it("5-year TCO > 3-year TCO", () => {
      const threeYear = calculateVirtualizationCost({ ...BASE_INPUT, termYears: 3 });
      const fiveYear = calculateVirtualizationCost({ ...BASE_INPUT, termYears: 5 });
      expect(fiveYear!.tco).toBeGreaterThan(threeYear!.tco);
    });
  });

  describe("breakdown structure", () => {
    it("breakdown has hardware, software, power, datacenter, labor", () => {
      const result = calculateVirtualizationCost(BASE_INPUT);
      expect(result!.breakdown.hardware).toBeGreaterThan(0);
      expect(result!.breakdown.software).toBeGreaterThan(0);
      expect(result!.breakdown.power).toBeGreaterThan(0);
    });

    it("percentages sum to approximately 100", () => {
      const result = calculateVirtualizationCost(BASE_INPUT);
      const total =
        result!.percentages.hardware +
        result!.percentages.software +
        result!.percentages.power +
        result!.percentages.datacenter +
        result!.percentages.labor;
      expect(total).toBeCloseTo(100, 0);
    });
  });

  describe("result structure", () => {
    it("has steps array", () => {
      const result = calculateVirtualizationCost(BASE_INPUT);
      expect(result!.steps).toBeInstanceOf(Array);
      expect(result!.steps.length).toBeGreaterThan(0);
    });
  });
});
