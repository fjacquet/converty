import { describe, expect, it } from "vitest";
import { calculateLoan } from "@/lib/converters/finance/loan";

describe("calculateLoan", () => {
  describe("null returns for invalid input", () => {
    it("returns null for zero loan amount", () => {
      expect(
        calculateLoan({
          loanAmount: 0,
          interestRate: 6,
          loanTerm: 36,
          startDate: "2024-01-01",
        })
      ).toBeNull();
    });

    it("returns null for zero loan term", () => {
      expect(
        calculateLoan({
          loanAmount: 10000,
          interestRate: 6,
          loanTerm: 0,
          startDate: "2024-01-01",
        })
      ).toBeNull();
    });
  });

  describe("basic loan calculation", () => {
    it("$10,000 at 6% APR over 36 months → monthly payment ≈ $304", () => {
      const result = calculateLoan({
        loanAmount: 10000,
        interestRate: 6,
        loanTerm: 36,
        startDate: "2024-01-01",
      });
      expect(result).not.toBeNull();
      expect(result!.monthlyPayment).toBeCloseTo(304, 0);
    });

    it("totalInterest = totalPayment - loanAmount", () => {
      const result = calculateLoan({
        loanAmount: 10000,
        interestRate: 6,
        loanTerm: 36,
        startDate: "2024-01-01",
      });
      expect(result).not.toBeNull();
      expect(result!.totalInterest).toBeCloseTo(result!.totalPayment - 10000, 0);
    });

    it("zero interest loan → monthlyPayment = loanAmount / loanTerm", () => {
      const result = calculateLoan({
        loanAmount: 12000,
        interestRate: 0,
        loanTerm: 12,
        startDate: "2024-01-01",
      });
      expect(result).not.toBeNull();
      expect(result!.monthlyPayment).toBeCloseTo(1000, 2);
    });

    it("schedule has correct number of entries", () => {
      const result = calculateLoan({
        loanAmount: 10000,
        interestRate: 6,
        loanTerm: 36,
        startDate: "2024-01-01",
      });
      expect(result).not.toBeNull();
      expect(result!.schedule).toHaveLength(36);
    });

    it("balance in last schedule entry is near zero", () => {
      const result = calculateLoan({
        loanAmount: 10000,
        interestRate: 5,
        loanTerm: 24,
        startDate: "2024-01-01",
      });
      expect(result).not.toBeNull();
      const lastEntry = result!.schedule[result!.schedule.length - 1];
      expect(lastEntry.balance).toBeCloseTo(0, 0);
    });

    it("total interest is positive for nonzero rate", () => {
      const result = calculateLoan({
        loanAmount: 10000,
        interestRate: 8,
        loanTerm: 48,
        startDate: "2024-01-01",
      });
      expect(result).not.toBeNull();
      expect(result!.totalInterest).toBeGreaterThan(0);
    });
  });
});
