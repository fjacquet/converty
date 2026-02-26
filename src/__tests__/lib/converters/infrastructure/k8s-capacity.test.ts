import { describe, expect, it } from "vitest";
import { calculateK8sCapacity } from "@/lib/converters/infrastructure/k8s-capacity";

const BASE_INPUT = {
  podCpuRequest: 500, // millicores (0.5 CPU per pod)
  podMemoryRequest: 512, // MiB
  podReplicas: 10,
  daemonSetCpuPerNode: 300, // millicores
  daemonSetMemoryPerNode: 384, // MiB
  nodeCpuCores: 8,
  nodeMemoryMb: 16384, // 16 GiB
  systemReservedCpu: 700, // millicores
  systemReservedMemory: 1024, // MiB
  targetCpuUtilization: 70,
  targetMemoryUtilization: 80,
};

describe("calculateK8sCapacity", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for podReplicas = 0", () => {
      expect(calculateK8sCapacity({ ...BASE_INPUT, podReplicas: 0 })).toBeNull();
    });

    it("returns null for nodeCpuCores = 0", () => {
      expect(calculateK8sCapacity({ ...BASE_INPUT, nodeCpuCores: 0 })).toBeNull();
    });

    it("returns null for podCpuRequest = 0", () => {
      expect(calculateK8sCapacity({ ...BASE_INPUT, podCpuRequest: 0 })).toBeNull();
    });

    it("returns null for podMemoryRequest = 0", () => {
      expect(calculateK8sCapacity({ ...BASE_INPUT, podMemoryRequest: 0 })).toBeNull();
    });

    it("returns null for targetCpuUtilization = 0", () => {
      expect(calculateK8sCapacity({ ...BASE_INPUT, targetCpuUtilization: 0 })).toBeNull();
    });

    it("returns null for targetCpuUtilization > 100", () => {
      expect(calculateK8sCapacity({ ...BASE_INPUT, targetCpuUtilization: 101 })).toBeNull();
    });
  });

  describe("basic capacity calculation", () => {
    it("returns non-null result for valid inputs", () => {
      const result = calculateK8sCapacity(BASE_INPUT);
      expect(result).not.toBeNull();
    });

    it("nodesNeededTotal is positive", () => {
      const result = calculateK8sCapacity(BASE_INPUT);
      expect(result!.nodesNeededTotal).toBeGreaterThan(0);
    });

    it("allocatableCpuPerNode is less than total CPU capacity", () => {
      // Total CPU = 8 cores = 8000 millicores
      // After system+daemonset overhead, allocatable < 8000m
      const result = calculateK8sCapacity(BASE_INPUT);
      const totalCpu = BASE_INPUT.nodeCpuCores * 1000;
      expect(result!.allocatableCpuPerNode).toBeLessThan(totalCpu);
    });
  });

  describe("pod count calculations", () => {
    it("totalPodCpuRequired = podReplicas × podCpuRequest", () => {
      const result = calculateK8sCapacity(BASE_INPUT);
      const expected = BASE_INPUT.podReplicas * BASE_INPUT.podCpuRequest;
      expect(result!.totalPodCpuRequired).toBe(expected);
    });

    it("totalPodMemoryRequired = podReplicas × podMemoryRequest", () => {
      const result = calculateK8sCapacity(BASE_INPUT);
      const expected = BASE_INPUT.podReplicas * BASE_INPUT.podMemoryRequest;
      expect(result!.totalPodMemoryRequired).toBe(expected);
    });
  });

  describe("scaling behavior", () => {
    it("more pods → more nodes needed", () => {
      const small = calculateK8sCapacity({ ...BASE_INPUT, podReplicas: 5 });
      const large = calculateK8sCapacity({ ...BASE_INPUT, podReplicas: 100 });
      expect(large!.nodesNeededTotal).toBeGreaterThan(small!.nodesNeededTotal);
    });

    it("limiting factor is either cpu or memory", () => {
      const result = calculateK8sCapacity(BASE_INPUT);
      expect(["cpu", "memory"]).toContain(result!.limitingFactor);
    });
  });

  describe("result structure", () => {
    it("has nodesNeededByCpu, nodesNeededByMemory, nodesNeededTotal", () => {
      const result = calculateK8sCapacity(BASE_INPUT);
      expect(result!.nodesNeededByCpu).toBeGreaterThan(0);
      expect(result!.nodesNeededByMemory).toBeGreaterThan(0);
      expect(result!.nodesNeededTotal).toBeGreaterThanOrEqual(
        Math.max(result!.nodesNeededByCpu, result!.nodesNeededByMemory)
      );
    });

    it("has steps array", () => {
      const result = calculateK8sCapacity(BASE_INPUT);
      expect(result!.steps).toBeInstanceOf(Array);
      expect(result!.steps.length).toBeGreaterThan(0);
    });
  });
});
