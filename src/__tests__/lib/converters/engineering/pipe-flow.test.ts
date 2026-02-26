import { describe, expect, it } from "vitest";
import { calculatePipeFlow } from "@/lib/converters/engineering/pipe-flow";

// Base inputs: custom fluid/pipe properties (no DB dependency)
const BASE_INPUT = {
  diameter: 50, // mm
  length: 100, // m
  velocity: 2, // m/s
  pipeMaterialId: "",
  fluidId: "",
  customRoughness: 0.05, // mm (commercial steel)
  customDensity: 1000, // kg/m³ (water)
  customViscosity: 0.001, // Pa·s (water at 20°C)
};

describe("calculatePipeFlow", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for diameter = 0", () => {
      expect(calculatePipeFlow({ ...BASE_INPUT, diameter: 0 })).toBeNull();
    });

    it("returns null for velocity = 0", () => {
      expect(calculatePipeFlow({ ...BASE_INPUT, velocity: 0 })).toBeNull();
    });

    it("returns null for length = 0", () => {
      expect(calculatePipeFlow({ ...BASE_INPUT, length: 0 })).toBeNull();
    });

    it("returns null for density = 0", () => {
      expect(calculatePipeFlow({ ...BASE_INPUT, customDensity: 0 })).toBeNull();
    });
  });

  describe("Reynolds number: Re = ρvD/μ", () => {
    it("returns non-null result for valid inputs", () => {
      const result = calculatePipeFlow(BASE_INPUT);
      expect(result).not.toBeNull();
    });

    it("Re = ρvD/μ = 1000×2×0.05/0.001 = 100,000", () => {
      // D = 50 mm = 0.05 m
      // Re = 1000 × 2 × 0.05 / 0.001 = 100,000
      const result = calculatePipeFlow(BASE_INPUT);
      expect(result!.reynoldsNumber).toBeCloseTo(100000, -2);
    });

    it("Re > 4000 → turbulent flow", () => {
      const result = calculatePipeFlow(BASE_INPUT);
      expect(result!.flowRegime).toBe("turbulent");
    });
  });

  describe("laminar flow (Re < 2300)", () => {
    it("very slow velocity gives laminar flow", () => {
      const result = calculatePipeFlow({
        ...BASE_INPUT,
        velocity: 0.001, // very slow → Re = 50
      });
      expect(result).not.toBeNull();
      expect(result!.flowRegime).toBe("laminar");
    });

    it("laminar flow: friction factor f = 64/Re", () => {
      // Re = 1000 × 0.001 × 0.05 / 0.001 = 50
      const result = calculatePipeFlow({
        ...BASE_INPUT,
        velocity: 0.001,
      });
      expect(result).not.toBeNull();
      const expectedF = 64 / result!.reynoldsNumber;
      expect(result!.frictionFactor).toBeCloseTo(expectedF, 4);
    });
  });

  describe("pressure drop", () => {
    it("pressureDrop is positive", () => {
      const result = calculatePipeFlow(BASE_INPUT);
      expect(result!.pressureDrop).toBeGreaterThan(0);
    });

    it("longer pipe has higher pressure drop", () => {
      const short = calculatePipeFlow(BASE_INPUT);
      const long = calculatePipeFlow({ ...BASE_INPUT, length: 200 });
      expect(long!.pressureDrop).toBeGreaterThan(short!.pressureDrop);
    });

    it("returns pressure in multiple units: pa, kpa, bar, psi", () => {
      const result = calculatePipeFlow(BASE_INPUT);
      expect(result!.pressureUnits.pa).toBeGreaterThan(0);
      expect(result!.pressureUnits.kpa).toBeGreaterThan(0);
      expect(result!.pressureUnits.bar).toBeGreaterThan(0);
      expect(result!.pressureUnits.psi).toBeGreaterThan(0);
    });
  });

  describe("result structure", () => {
    it("has flowRate, flowRateLpm, headLoss, relativeRoughness", () => {
      const result = calculatePipeFlow(BASE_INPUT);
      expect(result!.flowRate).toBeGreaterThan(0);
      expect(result!.flowRateLpm).toBeGreaterThan(0);
      expect(result!.headLoss).toBeGreaterThan(0);
      expect(result!.relativeRoughness).toBeGreaterThan(0);
    });

    it("has steps array", () => {
      const result = calculatePipeFlow(BASE_INPUT);
      expect(result!.steps).toBeInstanceOf(Array);
      expect(result!.steps.length).toBeGreaterThan(0);
    });
  });
});
