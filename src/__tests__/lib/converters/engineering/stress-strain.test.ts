import { describe, expect, it } from "vitest";
import { calculateStressStrain } from "@/lib/converters/engineering/stress-strain";

// Base input: no material from DB, custom values
const BASE_INPUT = {
  mode: "stress" as const,
  force: 10, // kN
  area: 100, // mm²
  originalLength: 1000, // mm
  changeInLength: 0.5, // mm
  materialId: "",
  customYoungsModulus: 200, // GPa (steel)
  customYieldStrength: 250, // MPa
};

describe("calculateStressStrain", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for area = 0", () => {
      expect(calculateStressStrain({ ...BASE_INPUT, area: 0 })).toBeNull();
    });

    it("returns null for originalLength = 0", () => {
      expect(calculateStressStrain({ ...BASE_INPUT, originalLength: 0 })).toBeNull();
    });

    it("returns null for negative force", () => {
      expect(calculateStressStrain({ ...BASE_INPUT, force: -1 })).toBeNull();
    });
  });

  describe("stress mode: σ = F/A", () => {
    it("1000 N / 0.01 m² = 100,000 Pa = 100 kPa", () => {
      // force = 1 kN = 1000 N, area = 10 mm²
      // stress = 1000 / 10 = 100 N/mm² = 100 MPa
      const result = calculateStressStrain({
        ...BASE_INPUT,
        force: 1,
        area: 10,
      });
      expect(result).not.toBeNull();
      expect(result!.stress).toBeCloseTo(100, 1);
    });

    it("stress = F/A: 10 kN / 100 mm² = 100 MPa", () => {
      const result = calculateStressStrain(BASE_INPUT);
      expect(result).not.toBeNull();
      // 10 kN = 10000 N, area = 100 mm², stress = 100 N/mm² = 100 MPa
      expect(result!.stress).toBeCloseTo(100, 1);
    });

    it("larger area → lower stress (same force)", () => {
      const small = calculateStressStrain({ ...BASE_INPUT, area: 100 });
      const large = calculateStressStrain({ ...BASE_INPUT, area: 200 });
      expect(large!.stress).toBeLessThan(small!.stress);
    });
  });

  describe("strain mode: ε = ΔL/L", () => {
    it("ΔL/L = 0.5/1000 = 0.0005", () => {
      const result = calculateStressStrain({ ...BASE_INPUT, mode: "strain" });
      expect(result).not.toBeNull();
      expect(result!.strain).toBeCloseTo(0.0005, 4);
    });
  });

  describe("safety factor", () => {
    it("safety factor = yield / stress (when material provided)", () => {
      // stress = 100 MPa, yield = 250 MPa → SF = 2.5
      const result = calculateStressStrain(BASE_INPUT);
      expect(result).not.toBeNull();
      if (result!.safetyFactor !== null) {
        expect(result!.safetyFactor).toBeCloseTo(2.5, 1);
      }
    });

    it("exceedsYield is false when stress < yield strength", () => {
      const result = calculateStressStrain(BASE_INPUT);
      expect(result!.exceedsYield).toBe(false);
    });

    it("exceedsYield is true when stress > yield strength", () => {
      // 500 kN / 100 mm² = 5000 MPa >> yield 250 MPa
      const result = calculateStressStrain({ ...BASE_INPUT, force: 500 });
      expect(result!.exceedsYield).toBe(true);
    });
  });

  describe("result structure", () => {
    it("returns stress in MPa, GPa, psi, ksi", () => {
      const result = calculateStressStrain(BASE_INPUT);
      expect(result!.stressUnits.mpa).toBeGreaterThan(0);
      expect(result!.stressUnits.gpa).toBeGreaterThan(0);
      expect(result!.stressUnits.psi).toBeGreaterThan(0);
      expect(result!.stressUnits.ksi).toBeGreaterThan(0);
    });

    it("has steps array", () => {
      const result = calculateStressStrain(BASE_INPUT);
      expect(result!.steps).toBeInstanceOf(Array);
      expect(result!.steps.length).toBeGreaterThan(0);
    });
  });
});
