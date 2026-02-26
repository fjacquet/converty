import { describe, expect, it } from "vitest";
import { calculateRetirement } from "@/lib/converters/finance/retirement";

describe("calculateRetirement", () => {
  describe("null returns for invalid input", () => {
    it("returns null when retirementAge <= currentAge", () => {
      expect(
        calculateRetirement({
          currentAge: 65,
          retirementAge: 65,
          currentSavings: 0,
          monthlyContribution: 500,
          expectedReturn: 7,
          inflationRate: 3,
          desiredAnnualIncome: 60000,
          socialSecurityBenefit: 1500,
          lifeExpectancy: 90,
        })
      ).toBeNull();
    });

    it("returns null when lifeExpectancy <= retirementAge", () => {
      expect(
        calculateRetirement({
          currentAge: 30,
          retirementAge: 65,
          currentSavings: 0,
          monthlyContribution: 500,
          expectedReturn: 7,
          inflationRate: 3,
          desiredAnnualIncome: 60000,
          socialSecurityBenefit: 1500,
          lifeExpectancy: 65,
        })
      ).toBeNull();
    });

    it("returns null for negative expected return", () => {
      expect(
        calculateRetirement({
          currentAge: 30,
          retirementAge: 65,
          currentSavings: 0,
          monthlyContribution: 500,
          expectedReturn: -1,
          inflationRate: 3,
          desiredAnnualIncome: 60000,
          socialSecurityBenefit: 1500,
          lifeExpectancy: 90,
        })
      ).toBeNull();
    });
  });

  describe("retirement accumulation", () => {
    it("starting with $0 contributing $500/month at 7% for 30 years → large balance", () => {
      const result = calculateRetirement({
        currentAge: 30,
        retirementAge: 60,
        currentSavings: 0,
        monthlyContribution: 500,
        expectedReturn: 7,
        inflationRate: 3,
        desiredAnnualIncome: 60000,
        socialSecurityBenefit: 0,
        lifeExpectancy: 90,
      });
      expect(result).not.toBeNull();
      // 30 years of $500/month at 7% should accumulate well above $400k
      expect(result!.retirementSavings).toBeGreaterThan(400000);
    });

    it("higher monthly contribution → higher retirement savings", () => {
      const low = calculateRetirement({
        currentAge: 30,
        retirementAge: 65,
        currentSavings: 0,
        monthlyContribution: 300,
        expectedReturn: 7,
        inflationRate: 3,
        desiredAnnualIncome: 60000,
        socialSecurityBenefit: 1500,
        lifeExpectancy: 90,
      });
      const high = calculateRetirement({
        currentAge: 30,
        retirementAge: 65,
        currentSavings: 0,
        monthlyContribution: 1000,
        expectedReturn: 7,
        inflationRate: 3,
        desiredAnnualIncome: 60000,
        socialSecurityBenefit: 1500,
        lifeExpectancy: 90,
      });
      expect(low).not.toBeNull();
      expect(high).not.toBeNull();
      expect(high!.retirementSavings).toBeGreaterThan(low!.retirementSavings);
    });

    it("projections array contains accumulation phase entries", () => {
      const result = calculateRetirement({
        currentAge: 30,
        retirementAge: 65,
        currentSavings: 0,
        monthlyContribution: 500,
        expectedReturn: 7,
        inflationRate: 3,
        desiredAnnualIncome: 60000,
        socialSecurityBenefit: 1500,
        lifeExpectancy: 90,
      });
      expect(result).not.toBeNull();
      const accumulation = result!.projections.filter((p) => p.phase === "accumulation");
      expect(accumulation.length).toBeGreaterThan(0);
    });

    it("yearsInRetirement = lifeExpectancy - retirementAge", () => {
      const result = calculateRetirement({
        currentAge: 30,
        retirementAge: 65,
        currentSavings: 0,
        monthlyContribution: 500,
        expectedReturn: 7,
        inflationRate: 3,
        desiredAnnualIncome: 60000,
        socialSecurityBenefit: 1500,
        lifeExpectancy: 90,
      });
      expect(result).not.toBeNull();
      expect(result!.yearsInRetirement).toBe(25);
    });
  });
});
