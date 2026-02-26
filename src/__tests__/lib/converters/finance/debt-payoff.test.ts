import { describe, expect, it } from "vitest";
import { calculateDebtPayoff } from "@/lib/converters/finance/debt-payoff";

describe("calculateDebtPayoff", () => {
  describe("null returns for invalid input", () => {
    it("returns null for zero total debt", () => {
      expect(
        calculateDebtPayoff({
          totalDebt: 0,
          interestRate: 8,
          minimumPayment: 300,
          extraPayment: 0,
        })
      ).toBeNull();
    });

    it("returns null for zero minimum payment", () => {
      expect(
        calculateDebtPayoff({
          totalDebt: 10000,
          interestRate: 8,
          minimumPayment: 0,
          extraPayment: 0,
        })
      ).toBeNull();
    });

    it("returns null when payment does not cover interest", () => {
      // $10,000 at 24% APR → monthly interest ≈ $200; payment of $50 won't cover it
      expect(
        calculateDebtPayoff({
          totalDebt: 10000,
          interestRate: 24,
          minimumPayment: 50,
          extraPayment: 0,
        })
      ).toBeNull();
    });
  });

  describe("basic debt payoff calculation", () => {
    it("$10,000 debt at 8% with $300/month → pays off in under 48 months", () => {
      const result = calculateDebtPayoff({
        totalDebt: 10000,
        interestRate: 8,
        minimumPayment: 300,
        extraPayment: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.monthsToPayoff).toBeLessThan(48);
    });

    it("first schedule entry has positive interest and principal components", () => {
      const result = calculateDebtPayoff({
        totalDebt: 10000,
        interestRate: 8,
        minimumPayment: 300,
        extraPayment: 0,
      });
      expect(result).not.toBeNull();
      const first = result!.schedule[0];
      expect(first.interest).toBeGreaterThan(0);
      expect(first.principal).toBeGreaterThan(0);
    });

    it("total paid > principal (interest was paid)", () => {
      const result = calculateDebtPayoff({
        totalDebt: 10000,
        interestRate: 8,
        minimumPayment: 300,
        extraPayment: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.totalPaid).toBeGreaterThan(10000);
    });

    it("schedule length matches monthsToPayoff", () => {
      const result = calculateDebtPayoff({
        totalDebt: 5000,
        interestRate: 10,
        minimumPayment: 200,
        extraPayment: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.schedule).toHaveLength(result!.monthsToPayoff);
    });
  });

  describe("extra payment benefits", () => {
    it("extra payment reduces months to payoff", () => {
      const standard = calculateDebtPayoff({
        totalDebt: 10000,
        interestRate: 8,
        minimumPayment: 300,
        extraPayment: 0,
      });
      const extra = calculateDebtPayoff({
        totalDebt: 10000,
        interestRate: 8,
        minimumPayment: 300,
        extraPayment: 100,
      });
      expect(standard).not.toBeNull();
      expect(extra).not.toBeNull();
      expect(extra!.monthsToPayoff).toBeLessThan(standard!.monthsToPayoff);
    });

    it("extra payment results in positive monthsSaved", () => {
      const result = calculateDebtPayoff({
        totalDebt: 10000,
        interestRate: 8,
        minimumPayment: 300,
        extraPayment: 100,
      });
      expect(result).not.toBeNull();
      expect(result!.monthsSaved).toBeGreaterThan(0);
    });

    it("extra payment results in positive interestSaved", () => {
      const result = calculateDebtPayoff({
        totalDebt: 10000,
        interestRate: 8,
        minimumPayment: 300,
        extraPayment: 100,
      });
      expect(result).not.toBeNull();
      expect(result!.interestSaved).toBeGreaterThan(0);
    });
  });
});
