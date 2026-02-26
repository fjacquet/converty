import { describe, expect, it } from "vitest";
import { calculateStoichiometry } from "@/lib/converters/chemistry/stoichiometry";

describe("calculateStoichiometry", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for empty equation string", () => {
      expect(
        calculateStoichiometry({
          equation: "",
          reactantMasses: { H2: 2 },
        })
      ).toBeNull();
    });

    it("returns null for empty reactantMasses", () => {
      expect(
        calculateStoichiometry({
          equation: "2H2 + O2 -> 2H2O",
          reactantMasses: {},
        })
      ).toBeNull();
    });

    it("returns null for invalid equation format", () => {
      expect(
        calculateStoichiometry({
          equation: "not an equation",
          reactantMasses: { H2: 2 },
        })
      ).toBeNull();
    });
  });

  describe("2H2 + O2 -> 2H2O", () => {
    it("given 4g H2 (excess O2 32g) → limiting reactant is H2", () => {
      // H2 MW = 2.016, O2 MW = 31.998
      // 4g H2 = 1.98 mol, 32g O2 = 1.0 mol
      // ratio H2: 1.98/2 = 0.99, ratio O2: 1.0/1 = 1.0 → H2 is limiting
      const result = calculateStoichiometry({
        equation: "2H2 + O2 -> 2H2O",
        reactantMasses: { H2: 4, O2: 32 },
      });
      expect(result).not.toBeNull();
      expect(result!.limitingReactant).toBe("H2");
    });

    it("result has reactants and products arrays", () => {
      const result = calculateStoichiometry({
        equation: "2H2 + O2 -> 2H2O",
        reactantMasses: { H2: 4, O2: 32 },
      });
      expect(result!.reactants).toBeInstanceOf(Array);
      expect(result!.products).toBeInstanceOf(Array);
    });

    it("product H2O has positive massProduced", () => {
      const result = calculateStoichiometry({
        equation: "2H2 + O2 -> 2H2O",
        reactantMasses: { H2: 4, O2: 32 },
      });
      const water = result!.products.find((p) => p.formula === "H2O");
      expect(water).toBeDefined();
      expect(water!.massProduced).toBeGreaterThan(0);
    });
  });

  describe("limiting reactant detection", () => {
    it("detects limiting reagent when one reactant is deficient", () => {
      // Fe + S -> FeS: provide excess Fe, limited S
      // Fe MW ≈ 55.845, S MW ≈ 32.06
      // 56g Fe ≈ 1 mol, 10g S ≈ 0.31 mol → S is limiting
      const result = calculateStoichiometry({
        equation: "Fe + S -> FeS",
        reactantMasses: { Fe: 56, S: 10 },
      });
      expect(result).not.toBeNull();
      expect(result!.limitingReactant).toBe("S");
    });
  });

  describe("result structure", () => {
    it("returns equation string and steps array", () => {
      const result = calculateStoichiometry({
        equation: "2H2 + O2 -> 2H2O",
        reactantMasses: { H2: 4, O2: 32 },
      });
      expect(result!.equation).toBeTruthy();
      expect(result!.steps).toBeInstanceOf(Array);
      expect(result!.steps.length).toBeGreaterThan(0);
    });

    it("each reactant has isLimiting flag", () => {
      const result = calculateStoichiometry({
        equation: "2H2 + O2 -> 2H2O",
        reactantMasses: { H2: 4, O2: 32 },
      });
      const limitingCount = result!.reactants.filter((r) => r.isLimiting).length;
      expect(limitingCount).toBe(1);
    });
  });
});
