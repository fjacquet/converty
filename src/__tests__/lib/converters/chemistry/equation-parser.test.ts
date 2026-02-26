import { describe, expect, it } from "vitest";
import {
  formatEquation,
  isEquationBalanced,
  parseChemicalEquation,
} from "@/lib/converters/chemistry/equation-parser";

describe("parseChemicalEquation", () => {
  describe("invalid inputs → success: false", () => {
    it("returns failure for empty string", () => {
      const result = parseChemicalEquation("");
      expect(result.success).toBe(false);
    });

    it("returns failure for whitespace-only string", () => {
      const result = parseChemicalEquation("   ");
      expect(result.success).toBe(false);
    });

    it("returns failure when no arrow present", () => {
      const result = parseChemicalEquation("H2 + O2");
      expect(result.success).toBe(false);
    });
  });

  describe("simple equations", () => {
    it("parses 'H2 + O2 -> H2O' without throwing", () => {
      const result = parseChemicalEquation("H2 + O2 -> H2O");
      expect(result.success).toBe(true);
    });

    it("parsed equation has reactants and products", () => {
      const result = parseChemicalEquation("H2 + O2 -> H2O");
      expect(result.success).toBe(true);
      if (result.success && result.equation) {
        expect(result.equation.reactants.length).toBeGreaterThan(0);
        expect(result.equation.products.length).toBeGreaterThan(0);
      }
    });

    it("parses balanced '2H2 + O2 -> 2H2O' correctly", () => {
      const result = parseChemicalEquation("2H2 + O2 -> 2H2O");
      expect(result.success).toBe(true);
      if (result.success && result.equation) {
        expect(result.equation.reactants[0].formula).toBe("H2");
        expect(result.equation.reactants[0].coefficient).toBe(2);
        expect(result.equation.products[0].formula).toBe("H2O");
        expect(result.equation.products[0].coefficient).toBe(2);
      }
    });

    it("accepts unicode arrow → format", () => {
      const result = parseChemicalEquation("2NaOH + H2SO4 → Na2SO4 + 2H2O");
      expect(result.success).toBe(true);
    });

    it("accepts '=' as arrow separator", () => {
      const result = parseChemicalEquation("Fe + S = FeS");
      expect(result.success).toBe(true);
    });
  });

  describe("equation with parentheses", () => {
    it("parses equation with Ca(OH)2", () => {
      const result = parseChemicalEquation("Ca(OH)2 + 2HCl -> CaCl2 + 2H2O");
      expect(result.success).toBe(true);
    });
  });

  describe("original equation preserved", () => {
    it("stores original equation string", () => {
      const eq = "H2 + O2 -> H2O";
      const result = parseChemicalEquation(eq);
      if (result.success && result.equation) {
        expect(result.equation.original).toBe(eq);
      }
    });
  });
});

describe("formatEquation", () => {
  it("formats parsed equation back to string", () => {
    const result = parseChemicalEquation("2H2 + O2 -> 2H2O");
    if (result.success && result.equation) {
      const formatted = formatEquation(result.equation);
      expect(formatted).toContain("H2");
      expect(formatted).toContain("H2O");
      expect(formatted).toContain("→");
    }
  });
});

describe("isEquationBalanced", () => {
  it("returns true for a parsed equation (placeholder implementation)", () => {
    const result = parseChemicalEquation("2H2 + O2 -> 2H2O");
    if (result.success && result.equation) {
      expect(isEquationBalanced(result.equation)).toBe(true);
    }
  });
});
