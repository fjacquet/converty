import { describe, expect, it } from "vitest";
import { calculatePersonalLoan } from "@/lib/converters/finance/personal-loan";

describe("calculatePersonalLoan", () => {
  describe("null returns for invalid input", () => {
    it("returns null for zero loan amount", () => {
      expect(
        calculatePersonalLoan({
          loanAmount: 0,
          annualInterestRate: 10,
          loanTermMonths: 36,
          originationFee: 1,
        })
      ).toBeNull();
    });

    it("returns null for zero loan term months", () => {
      expect(
        calculatePersonalLoan({
          loanAmount: 10000,
          annualInterestRate: 10,
          loanTermMonths: 0,
          originationFee: 1,
        })
      ).toBeNull();
    });
  });

  describe("basic personal loan calculation", () => {
    it("monthly payment is positive for standard loan", () => {
      const result = calculatePersonalLoan({
        loanAmount: 10000,
        annualInterestRate: 10,
        loanTermMonths: 36,
        originationFee: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.monthlyPayment).toBeGreaterThan(0);
    });

    it("$10,000 at 10% APR for 36 months → monthly payment ≈ $323", () => {
      const result = calculatePersonalLoan({
        loanAmount: 10000,
        annualInterestRate: 10,
        loanTermMonths: 36,
        originationFee: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.monthlyPayment).toBeCloseTo(323, 0);
    });

    it("totalInterest is positive for nonzero rate", () => {
      const result = calculatePersonalLoan({
        loanAmount: 15000,
        annualInterestRate: 8,
        loanTermMonths: 48,
        originationFee: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.totalInterest).toBeGreaterThan(0);
    });

    it("origination fee increases totalCost", () => {
      const withFee = calculatePersonalLoan({
        loanAmount: 10000,
        annualInterestRate: 10,
        loanTermMonths: 36,
        originationFee: 2,
      });
      const withoutFee = calculatePersonalLoan({
        loanAmount: 10000,
        annualInterestRate: 10,
        loanTermMonths: 36,
        originationFee: 0,
      });
      expect(withFee).not.toBeNull();
      expect(withoutFee).not.toBeNull();
      expect(withFee!.totalCost).toBeGreaterThan(withoutFee!.totalCost);
    });

    it("APR includes origination fee effect", () => {
      const withFee = calculatePersonalLoan({
        loanAmount: 10000,
        annualInterestRate: 10,
        loanTermMonths: 36,
        originationFee: 3,
      });
      expect(withFee).not.toBeNull();
      // APR with fee should be higher than stated rate
      expect(withFee!.apr).toBeGreaterThan(10);
    });

    it("amortization schedule has correct number of entries", () => {
      const result = calculatePersonalLoan({
        loanAmount: 10000,
        annualInterestRate: 10,
        loanTermMonths: 36,
        originationFee: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.amortization).toHaveLength(36);
    });
  });
});
