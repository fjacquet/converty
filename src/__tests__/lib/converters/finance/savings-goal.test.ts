import { describe, expect, it } from "vitest";
import { calculateSavingsGoal } from "@/lib/converters/finance/savings-goal";

describe("calculateSavingsGoal", () => {
  describe("null returns for invalid input", () => {
    it("returns null for zero goal amount", () => {
      expect(
        calculateSavingsGoal({
          goalAmount: 0,
          currentSavings: 0,
          monthlyContribution: 500,
          annualInterestRate: 4,
        })
      ).toBeNull();
    });

    it("returns null for negative goal amount", () => {
      expect(
        calculateSavingsGoal({
          goalAmount: -1000,
          currentSavings: 0,
          monthlyContribution: 500,
          annualInterestRate: 4,
        })
      ).toBeNull();
    });

    it("returns null for negative monthly contribution", () => {
      expect(
        calculateSavingsGoal({
          goalAmount: 10000,
          currentSavings: 0,
          monthlyContribution: -100,
          annualInterestRate: 4,
        })
      ).toBeNull();
    });
  });

  describe("already at goal", () => {
    it("when currentSavings >= goalAmount → monthsToGoal = 0", () => {
      const result = calculateSavingsGoal({
        goalAmount: 10000,
        currentSavings: 10000,
        monthlyContribution: 500,
        annualInterestRate: 4,
      });
      expect(result).not.toBeNull();
      expect(result!.monthsToGoal).toBe(0);
      expect(result!.goalReachable).toBe(true);
    });
  });

  describe("savings goal calculation", () => {
    it("saving $500/month at 4% APY for $10,000 goal → fewer months than $10k/500=20", () => {
      const result = calculateSavingsGoal({
        goalAmount: 10000,
        currentSavings: 0,
        monthlyContribution: 500,
        annualInterestRate: 4,
      });
      expect(result).not.toBeNull();
      expect(result!.goalReachable).toBe(true);
      // Interest helps → fewer months than 10000/500 = 20
      expect(result!.monthsToGoal).toBeLessThanOrEqual(20);
    });

    it("with zero interest → exactly 20 months for $10k at $500/month", () => {
      const result = calculateSavingsGoal({
        goalAmount: 10000,
        currentSavings: 0,
        monthlyContribution: 500,
        annualInterestRate: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.monthsToGoal).toBe(20);
    });

    it("totalContributions = monthlyContribution × monthsToGoal", () => {
      const result = calculateSavingsGoal({
        goalAmount: 10000,
        currentSavings: 0,
        monthlyContribution: 500,
        annualInterestRate: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.totalContributions).toBeCloseTo(500 * result!.monthsToGoal, 0);
    });

    it("totalInterestEarned = 0 for zero interest rate", () => {
      const result = calculateSavingsGoal({
        goalAmount: 10000,
        currentSavings: 0,
        monthlyContribution: 500,
        annualInterestRate: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.totalInterestEarned).toBeCloseTo(0, 2);
    });

    it("interest reduces months needed to reach goal", () => {
      const withInterest = calculateSavingsGoal({
        goalAmount: 10000,
        currentSavings: 0,
        monthlyContribution: 400,
        annualInterestRate: 5,
      });
      const noInterest = calculateSavingsGoal({
        goalAmount: 10000,
        currentSavings: 0,
        monthlyContribution: 400,
        annualInterestRate: 0,
      });
      expect(withInterest).not.toBeNull();
      expect(noInterest).not.toBeNull();
      expect(withInterest!.monthsToGoal).toBeLessThan(noInterest!.monthsToGoal);
    });
  });
});
