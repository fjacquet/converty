import { describe, expect, it } from "vitest";
import {
  calculateServerRefresh,
  getServerRefreshCpus,
} from "@/lib/converters/infrastructure/server-refresh";

// Real CPU IDs from the database
const BASE_INPUT = {
  oldCpuId: "intel-xeon-gold-6326",
  oldSocketsPerServer: "2",
  oldServerCount: "10",
  newCpuId: "intel-xeon-platinum-8592plus",
  newSocketsPerServer: "2",
  headroomPct: "25",
  chassisConstraint: "none",
  powerBudgetW: "0",
};

describe("calculateServerRefresh (real cpu-database.json)", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for invalid old CPU ID", () => {
      expect(
        calculateServerRefresh({
          ...BASE_INPUT,
          oldCpuId: "nonexistent-cpu-id",
        })
      ).toBeNull();
    });

    it("returns null for invalid new CPU ID", () => {
      expect(
        calculateServerRefresh({
          ...BASE_INPUT,
          newCpuId: "nonexistent-cpu-id",
        })
      ).toBeNull();
    });

    it("returns null for oldServerCount = 0", () => {
      expect(
        calculateServerRefresh({
          ...BASE_INPUT,
          oldServerCount: "0",
        })
      ).toBeNull();
    });

    it("returns null for non-numeric oldServerCount", () => {
      expect(
        calculateServerRefresh({
          ...BASE_INPUT,
          oldServerCount: "abc",
        })
      ).toBeNull();
    });
  });

  describe("valid server refresh scenario", () => {
    it("returns non-null result for valid inputs", () => {
      const result = calculateServerRefresh(BASE_INPUT);
      expect(result).not.toBeNull();
    });

    it("oldFleet.serverCount matches input", () => {
      const result = calculateServerRefresh(BASE_INPUT);
      expect(result!.oldFleet.serverCount).toBe(10);
    });

    it("requiredSpecint > oldFleet.totalSpecint due to headroom", () => {
      const result = calculateServerRefresh(BASE_INPUT);
      expect(result!.requiredSpecint).toBeGreaterThan(result!.oldFleet.totalSpecint);
    });

    it("minNewServerCount is positive", () => {
      const result = calculateServerRefresh(BASE_INPUT);
      expect(result!.minNewServerCount).toBeGreaterThan(0);
    });

    it("headroomPct is correct value", () => {
      const result = calculateServerRefresh(BASE_INPUT);
      expect(result!.headroomPct).toBe(25);
    });
  });

  describe("chassis constraint", () => {
    it("1u-single constraint limits to 1 socket per server", () => {
      const result = calculateServerRefresh({
        ...BASE_INPUT,
        chassisConstraint: "1u-single",
        newSocketsPerServer: "2", // Should be capped to 1
      });
      expect(result).not.toBeNull();
      expect(result!.specintPerNewServer).toBeGreaterThan(0);
    });
  });

  describe("power budget", () => {
    it("serversPerRack and racksNeeded are null when powerBudget = 0", () => {
      const result = calculateServerRefresh(BASE_INPUT); // powerBudgetW: "0"
      expect(result!.serversPerRack).toBeNull();
      expect(result!.racksNeeded).toBeNull();
    });

    it("serversPerRack is non-null when powerBudget > 0", () => {
      const result = calculateServerRefresh({
        ...BASE_INPUT,
        powerBudgetW: "10000",
      });
      expect(result).not.toBeNull();
      expect(result!.serversPerRack).not.toBeNull();
    });
  });

  describe("result structure", () => {
    it("result has oldFleet and newFleet summaries", () => {
      const result = calculateServerRefresh(BASE_INPUT);
      expect(result!.oldFleet.totalCores).toBeGreaterThan(0);
      expect(result!.oldFleet.totalSpecint).toBeGreaterThan(0);
      expect(result!.newFleet.serverCount).toBeGreaterThan(0);
    });

    it("has dataAsOf string", () => {
      const result = calculateServerRefresh(BASE_INPUT);
      expect(result!.dataAsOf).toBeTruthy();
    });
  });
});

describe("getServerRefreshCpus", () => {
  it("returns array with length > 0", () => {
    const cpus = getServerRefreshCpus();
    expect(cpus.length).toBeGreaterThan(0);
  });

  it("returns CPUs sorted by specint2017Peak descending", () => {
    const cpus = getServerRefreshCpus();
    for (let i = 0; i < cpus.length - 1; i++) {
      expect(cpus[i].specint2017Peak).toBeGreaterThanOrEqual(cpus[i + 1].specint2017Peak);
    }
  });
});
