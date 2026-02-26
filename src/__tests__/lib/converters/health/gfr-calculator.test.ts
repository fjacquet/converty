import { describe, expect, it } from "vitest";
import { calculateGfr } from "@/lib/converters/health/gfr-calculator";

describe("calculateGfr", () => {
  describe("null for invalid inputs", () => {
    it("returns null for creatinine <= 0", () => {
      expect(
        calculateGfr({
          creatinine: 0,
          creatinineUnit: "mgdl",
          age: 60,
          gender: "female",
          race: "other",
        })
      ).toBeNull();
    });

    it("returns null for age <= 0", () => {
      expect(
        calculateGfr({
          creatinine: 1.0,
          creatinineUnit: "mgdl",
          age: 0,
          gender: "female",
          race: "other",
        })
      ).toBeNull();
    });

    it("returns null for age > 120", () => {
      expect(
        calculateGfr({
          creatinine: 1.0,
          creatinineUnit: "mgdl",
          age: 121,
          gender: "female",
          race: "other",
        })
      ).toBeNull();
    });
  });

  describe("CKD-EPI calculation (female)", () => {
    it("healthy female 60yo creatinine 1.0 has GFR in expected range (60-90)", () => {
      const result = calculateGfr({
        creatinine: 1.0,
        creatinineUnit: "mgdl",
        age: 60,
        gender: "female",
        race: "other",
      });
      expect(result).not.toBeNull();
      expect(result!.egfrCkdEpi).toBeGreaterThan(60);
      expect(result!.egfrCkdEpi).toBeLessThan(90);
    });
  });

  describe("CKD-EPI calculation (male)", () => {
    it("healthy male 60yo creatinine 1.0 has GFR in expected range", () => {
      const result = calculateGfr({
        creatinine: 1.0,
        creatinineUnit: "mgdl",
        age: 60,
        gender: "male",
        race: "other",
      });
      expect(result).not.toBeNull();
      expect(result!.egfrCkdEpi).toBeGreaterThan(50);
    });

    it("male and female give different GFR for same inputs", () => {
      const base = {
        creatinine: 1.0,
        creatinineUnit: "mgdl" as const,
        age: 60,
        race: "other" as const,
      };
      const male = calculateGfr({ ...base, gender: "male" });
      const female = calculateGfr({ ...base, gender: "female" });
      expect(male).not.toBeNull();
      expect(female).not.toBeNull();
      expect(male!.egfrCkdEpi).not.toBe(female!.egfrCkdEpi);
    });
  });

  describe("umol/L unit conversion", () => {
    it("produces same result when converting umol to mg/dL (creatinine × 88.4)", () => {
      const mgdl = calculateGfr({
        creatinine: 1.0,
        creatinineUnit: "mgdl",
        age: 50,
        gender: "male",
        race: "other",
      });
      const umol = calculateGfr({
        creatinine: 88.4,
        creatinineUnit: "umol",
        age: 50,
        gender: "male",
        race: "other",
      });
      expect(mgdl).not.toBeNull();
      expect(umol).not.toBeNull();
      expect(umol!.egfrCkdEpi).toBeCloseTo(mgdl!.egfrCkdEpi, 2);
    });
  });

  describe("CKD staging", () => {
    it("assigns stage 1 for GFR >= 90", () => {
      const result = calculateGfr({
        creatinine: 0.6,
        creatinineUnit: "mgdl",
        age: 30,
        gender: "female",
        race: "other",
      });
      expect(result).not.toBeNull();
      if (result!.egfrCkdEpi >= 90) {
        expect(result!.stage).toBe(1);
        expect(result!.stageKey).toBe("stage1");
      }
    });

    it("assigns stage 5 for very high creatinine", () => {
      const result = calculateGfr({
        creatinine: 8.0,
        creatinineUnit: "mgdl",
        age: 60,
        gender: "male",
        race: "other",
      });
      expect(result).not.toBeNull();
      expect(result!.stage).toBe(5);
      expect(result!.stageKey).toBe("stage5");
    });
  });

  describe("Cockcroft-Gault with weight", () => {
    it("returns non-null Cockcroft-Gault when weight is provided", () => {
      const result = calculateGfr({
        creatinine: 1.0,
        creatinineUnit: "mgdl",
        age: 60,
        gender: "male",
        race: "other",
        weight: 80,
      });
      expect(result).not.toBeNull();
      expect(result!.egfrCockcroftGault).not.toBeNull();
      expect(result!.egfrCockcroftGault!).toBeGreaterThan(0);
    });
  });
});
