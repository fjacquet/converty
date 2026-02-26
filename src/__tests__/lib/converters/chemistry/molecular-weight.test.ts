import { describe, expect, it } from "vitest";
import { calculateMolecularWeight } from "@/lib/converters/chemistry/molecular-weight";

describe("calculateMolecularWeight", () => {
  describe("null returns for invalid input", () => {
    it("returns null for empty formula string", () => {
      expect(calculateMolecularWeight({ formula: "" })).toBeNull();
    });

    it("returns null for whitespace-only formula", () => {
      expect(calculateMolecularWeight({ formula: "   " })).toBeNull();
    });

    it("returns null for invalid element symbol", () => {
      // 'Xy' is not a real element — parser should return null
      expect(calculateMolecularWeight({ formula: "Xy99" })).toBeNull();
    });
  });

  describe("simple molecules", () => {
    it("calculates H2O molar mass ≈ 18.015 g/mol", () => {
      // H: 1.008 × 2 + O: 15.999 = 18.015
      const result = calculateMolecularWeight({ formula: "H2O" });
      expect(result).not.toBeNull();
      expect(result!.molarMass).toBeCloseTo(18.015, 2);
    });

    it("H2O has 3 total atoms", () => {
      const result = calculateMolecularWeight({ formula: "H2O" });
      expect(result!.totalAtoms).toBe(3);
    });

    it("calculates CO2 molar mass ≈ 44.01 g/mol", () => {
      // C: 12.011 + O: 15.999 × 2 = 44.009
      const result = calculateMolecularWeight({ formula: "CO2" });
      expect(result).not.toBeNull();
      expect(result!.molarMass).toBeCloseTo(44.01, 1);
    });

    it("calculates NaCl molar mass ≈ 58.44 g/mol", () => {
      const result = calculateMolecularWeight({ formula: "NaCl" });
      expect(result).not.toBeNull();
      expect(result!.molarMass).toBeCloseTo(58.44, 1);
    });
  });

  describe("complex formulas", () => {
    it("handles parentheses: Ca(OH)2 ≈ 74.09 g/mol", () => {
      // Ca: 40.078 + O: 15.999 × 2 + H: 1.008 × 2 = 74.092
      const result = calculateMolecularWeight({ formula: "Ca(OH)2" });
      expect(result).not.toBeNull();
      expect(result!.molarMass).toBeCloseTo(74.09, 1);
    });

    it("handles hydrate notation: CuSO4.5H2O ≈ 249.68 g/mol", () => {
      const result = calculateMolecularWeight({ formula: "CuSO4.5H2O" });
      expect(result).not.toBeNull();
      expect(result!.molarMass).toBeCloseTo(249.68, 1);
    });

    it("handles glucose C6H12O6", () => {
      // C: 12.011 × 6 + H: 1.008 × 12 + O: 15.999 × 6 = 180.156
      const result = calculateMolecularWeight({ formula: "C6H12O6" });
      expect(result).not.toBeNull();
      expect(result!.molarMass).toBeCloseTo(180.16, 1);
    });
  });

  describe("element breakdown", () => {
    it("H2O has 2 distinct elements", () => {
      const result = calculateMolecularWeight({ formula: "H2O" });
      expect(result!.elements).toHaveLength(2);
    });

    it("H2O element breakdown includes H and O symbols", () => {
      const result = calculateMolecularWeight({ formula: "H2O" });
      const symbols = result!.elements.map((e) => e.symbol);
      expect(symbols).toContain("H");
      expect(symbols).toContain("O");
    });

    it("each element entry has a truthy symbol", () => {
      const result = calculateMolecularWeight({ formula: "NaCl" });
      for (const element of result!.elements) {
        expect(element.symbol).toBeTruthy();
      }
    });
  });
});
