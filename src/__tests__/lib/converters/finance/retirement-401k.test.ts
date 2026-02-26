import { describe, expect, it } from "vitest";
import { calculateRetirement401k } from "@/lib/converters/finance/retirement-401k";

describe("calculateRetirement401k", () => {
  describe("null returns for invalid input", () => {
    it("returns null when currentAge >= retirementAge", () => {
      expect(
        calculateRetirement401k({
          currentAge: 65,
          retirementAge: 65,
          currentBalance: 0,
          annualContribution: 10000,
          employerMatch: 100,
          employerMatchLimit: 3,
          annualReturnRate: 7,
          annualSalaryGrowth: 3,
        })
      ).toBeNull();
    });

    it("returns null when currentAge < 18", () => {
      expect(
        calculateRetirement401k({
          currentAge: 17,
          retirementAge: 65,
          currentBalance: 0,
          annualContribution: 10000,
          employerMatch: 100,
          employerMatchLimit: 3,
          annualReturnRate: 7,
          annualSalaryGrowth: 3,
        })
      ).toBeNull();
    });

    it("returns null when retirementAge > 75", () => {
      expect(
        calculateRetirement401k({
          currentAge: 30,
          retirementAge: 76,
          currentBalance: 0,
          annualContribution: 10000,
          employerMatch: 100,
          employerMatchLimit: 3,
          annualReturnRate: 7,
          annualSalaryGrowth: 3,
        })
      ).toBeNull();
    });
  });

  describe("basic 401k growth calculation", () => {
    it("contributes for correct number of years", () => {
      const result = calculateRetirement401k({
        currentAge: 30,
        retirementAge: 65,
        currentBalance: 0,
        annualContribution: 10000,
        employerMatch: 100,
        employerMatchLimit: 3,
        annualReturnRate: 7,
        annualSalaryGrowth: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.yearsToRetirement).toBe(35);
    });

    it("totalAtRetirement exceeds totalContributions + totalEmployerMatch (growth occurred)", () => {
      const result = calculateRetirement401k({
        currentAge: 30,
        retirementAge: 65,
        currentBalance: 0,
        annualContribution: 10000,
        employerMatch: 100,
        employerMatchLimit: 3,
        annualReturnRate: 7,
        annualSalaryGrowth: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.totalAtRetirement).toBeGreaterThan(
        result!.totalContributions + result!.totalEmployerMatch
      );
    });

    it("totalGrowth is positive", () => {
      const result = calculateRetirement401k({
        currentAge: 30,
        retirementAge: 65,
        currentBalance: 50000,
        annualContribution: 15000,
        employerMatch: 50,
        employerMatchLimit: 6,
        annualReturnRate: 6,
        annualSalaryGrowth: 2,
      });
      expect(result).not.toBeNull();
      expect(result!.totalGrowth).toBeGreaterThan(0);
    });

    it("monthlyInRetirement is positive", () => {
      const result = calculateRetirement401k({
        currentAge: 30,
        retirementAge: 65,
        currentBalance: 0,
        annualContribution: 10000,
        employerMatch: 100,
        employerMatchLimit: 3,
        annualReturnRate: 7,
        annualSalaryGrowth: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.monthlyInRetirement).toBeGreaterThan(0);
    });
  });

  describe("employer match", () => {
    it("employer match increases total contributions", () => {
      const withMatch = calculateRetirement401k({
        currentAge: 30,
        retirementAge: 65,
        currentBalance: 0,
        annualContribution: 10000,
        employerMatch: 100,
        employerMatchLimit: 3,
        annualReturnRate: 7,
        annualSalaryGrowth: 0,
      });
      const noMatch = calculateRetirement401k({
        currentAge: 30,
        retirementAge: 65,
        currentBalance: 0,
        annualContribution: 10000,
        employerMatch: 0,
        employerMatchLimit: 3,
        annualReturnRate: 7,
        annualSalaryGrowth: 0,
      });
      expect(withMatch).not.toBeNull();
      expect(noMatch).not.toBeNull();
      expect(withMatch!.totalEmployerMatch).toBeGreaterThan(0);
      expect(withMatch!.totalAtRetirement).toBeGreaterThan(noMatch!.totalAtRetirement);
    });
  });
});
