import { describe, expect, it } from "vitest";
import { parseChemicalFormula } from "@/lib/converters/chemistry/formula-parser";

describe("parseChemicalFormula", () => {
  describe("invalid inputs → success: false", () => {
    it("returns failure for empty string", () => {
      const result = parseChemicalFormula("");
      expect(result.success).toBe(false);
    });

    it("returns failure for whitespace-only string", () => {
      const result = parseChemicalFormula("   ");
      expect(result.success).toBe(false);
    });

    it("returns failure for unmatched parenthesis: Ca(OH2", () => {
      const result = parseChemicalFormula("Ca(OH2");
      expect(result.success).toBe(false);
    });

    it("returns failure for invalid character", () => {
      const result = parseChemicalFormula("H2@O");
      expect(result.success).toBe(false);
    });
  });

  describe("simple formulas", () => {
    it("parses H2O → H:2, O:1", () => {
      const result = parseChemicalFormula("H2O");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.composition.H).toBe(2);
        expect(result.composition.O).toBe(1);
      }
    });

    it("parses CO2 → C:1, O:2", () => {
      const result = parseChemicalFormula("CO2");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.composition.C).toBe(1);
        expect(result.composition.O).toBe(2);
      }
    });

    it("parses NaCl → Na:1, Cl:1", () => {
      const result = parseChemicalFormula("NaCl");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.composition.Na).toBe(1);
        expect(result.composition.Cl).toBe(1);
      }
    });
  });

  describe("glucose C6H12O6", () => {
    it("parses C:6, H:12, O:6", () => {
      const result = parseChemicalFormula("C6H12O6");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.composition.C).toBe(6);
        expect(result.composition.H).toBe(12);
        expect(result.composition.O).toBe(6);
      }
    });
  });

  describe("parentheses formulas", () => {
    it("parses Ca(OH)2 → Ca:1, O:2, H:2", () => {
      const result = parseChemicalFormula("Ca(OH)2");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.composition.Ca).toBe(1);
        expect(result.composition.O).toBe(2);
        expect(result.composition.H).toBe(2);
      }
    });

    it("parses Mg(NO3)2 → Mg:1, N:2, O:6", () => {
      const result = parseChemicalFormula("Mg(NO3)2");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.composition.Mg).toBe(1);
        expect(result.composition.N).toBe(2);
        expect(result.composition.O).toBe(6);
      }
    });
  });

  describe("hydrate notation", () => {
    it("parses CuSO4.5H2O (dot notation)", () => {
      const result = parseChemicalFormula("CuSO4.5H2O");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.composition.Cu).toBe(1);
        expect(result.composition.S).toBe(1);
        expect(result.composition.O).toBeGreaterThan(4);
        expect(result.composition.H).toBe(10);
      }
    });
  });
});
