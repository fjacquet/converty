import { describe, expect, it } from "vitest";
import { calculateColumnBuckling } from "@/lib/converters/engineering/column-buckling";

// Custom section values for deterministic tests (no DB dependency)
const BASE_INPUT = {
  materialId: "",
  sectionId: "",
  length: 3, // m
  endCondition: "pinned-pinned" as const,
  axis: "x" as const,
  customArea: 5000, // mm²
  customMomentOfInertia: 50e6, // mm⁴
  customYoungsModulus: 200, // GPa (steel)
  customYieldStrength: 250, // MPa
};

describe("calculateColumnBuckling", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for length = 0", () => {
      expect(calculateColumnBuckling({ ...BASE_INPUT, length: 0 })).toBeNull();
    });

    it("returns null for customYoungsModulus = 0", () => {
      expect(calculateColumnBuckling({ ...BASE_INPUT, customYoungsModulus: 0 })).toBeNull();
    });

    it("returns null for customMomentOfInertia = 0", () => {
      expect(calculateColumnBuckling({ ...BASE_INPUT, customMomentOfInertia: 0 })).toBeNull();
    });
  });

  describe("Euler critical load: Pcr = π²EI/(KL)²", () => {
    it("returns non-null result for valid inputs", () => {
      const result = calculateColumnBuckling(BASE_INPUT);
      expect(result).not.toBeNull();
    });

    it("eulerLoad is positive", () => {
      const result = calculateColumnBuckling(BASE_INPUT);
      expect(result!.eulerLoad).toBeGreaterThan(0);
    });

    it("pinned-pinned has K=1.0", () => {
      const result = calculateColumnBuckling(BASE_INPUT);
      expect(result!.kFactor).toBe(1.0);
    });

    it("fixed-fixed has K=0.5 (lower K = higher Pcr)", () => {
      const result = calculateColumnBuckling({
        ...BASE_INPUT,
        endCondition: "fixed-fixed",
      });
      expect(result!.kFactor).toBe(0.5);
    });
  });

  describe("longer column → lower Euler load", () => {
    it("6m column buckles at lower load than 3m column", () => {
      const short = calculateColumnBuckling(BASE_INPUT);
      const long = calculateColumnBuckling({ ...BASE_INPUT, length: 6 });
      expect(long!.eulerLoad).toBeLessThan(short!.eulerLoad);
    });
  });

  describe("end condition effects", () => {
    it("fixed-free has lowest Euler load (K=2.0, longest effective length)", () => {
      const pinnedPinned = calculateColumnBuckling(BASE_INPUT);
      const fixedFree = calculateColumnBuckling({
        ...BASE_INPUT,
        endCondition: "fixed-free",
      });
      expect(fixedFree!.eulerLoad).toBeLessThan(pinnedPinned!.eulerLoad);
    });

    it("fixed-fixed has highest Euler load (K=0.5)", () => {
      const pinnedPinned = calculateColumnBuckling(BASE_INPUT);
      const fixedFixed = calculateColumnBuckling({
        ...BASE_INPUT,
        endCondition: "fixed-fixed",
      });
      expect(fixedFixed!.eulerLoad).toBeGreaterThan(pinnedPinned!.eulerLoad);
    });
  });

  describe("result structure", () => {
    it("has slendernessRatio, radiusOfGyration, bucklingMode", () => {
      const result = calculateColumnBuckling(BASE_INPUT);
      expect(result!.slendernessRatio).toBeGreaterThan(0);
      expect(result!.radiusOfGyration).toBeGreaterThan(0);
      expect(["elastic", "inelastic"]).toContain(result!.bucklingMode);
    });

    it("returns load in kN, lbf, kips", () => {
      const result = calculateColumnBuckling(BASE_INPUT);
      expect(result!.loadUnits.kN).toBeGreaterThan(0);
      expect(result!.loadUnits.lbf).toBeGreaterThan(0);
      expect(result!.loadUnits.kips).toBeGreaterThan(0);
    });
  });
});
