import { describe, expect, it } from "vitest";
import { calculateAutoLoan } from "@/lib/converters/finance/auto-loan";

describe("calculateAutoLoan", () => {
  describe("null returns for invalid input", () => {
    it("returns null for zero vehiclePrice", () => {
      expect(
        calculateAutoLoan({
          vehiclePrice: 0,
          downPayment: 0,
          tradeInValue: 0,
          annualInterestRate: 5,
          loanTermMonths: 60,
          salesTaxRate: 0,
        })
      ).toBeNull();
    });

    it("returns null for zero loanTermMonths", () => {
      expect(
        calculateAutoLoan({
          vehiclePrice: 20000,
          downPayment: 0,
          tradeInValue: 0,
          annualInterestRate: 5,
          loanTermMonths: 0,
          salesTaxRate: 0,
        })
      ).toBeNull();
    });
  });

  describe("basic auto loan calculation", () => {
    it("$20,000 loan at 5% APR for 60 months → monthly payment ≈ $377", () => {
      const result = calculateAutoLoan({
        vehiclePrice: 20000,
        downPayment: 0,
        tradeInValue: 0,
        annualInterestRate: 5,
        loanTermMonths: 60,
        salesTaxRate: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.monthlyPayment).toBeCloseTo(377, 0);
    });

    it("zero interest loan → monthly payment = loanAmount / months", () => {
      const result = calculateAutoLoan({
        vehiclePrice: 12000,
        downPayment: 0,
        tradeInValue: 0,
        annualInterestRate: 0,
        loanTermMonths: 60,
        salesTaxRate: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.monthlyPayment).toBeCloseTo(12000 / 60, 2);
    });

    it("returns zero payment when down payment covers full vehicle cost", () => {
      const result = calculateAutoLoan({
        vehiclePrice: 20000,
        downPayment: 20000,
        tradeInValue: 0,
        annualInterestRate: 5,
        loanTermMonths: 60,
        salesTaxRate: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.monthlyPayment).toBe(0);
      expect(result!.totalInterest).toBe(0);
    });

    it("totalInterest is positive for standard loan", () => {
      const result = calculateAutoLoan({
        vehiclePrice: 25000,
        downPayment: 5000,
        tradeInValue: 0,
        annualInterestRate: 6,
        loanTermMonths: 48,
        salesTaxRate: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.totalInterest).toBeGreaterThan(0);
    });

    it("amortization schedule has correct number of entries", () => {
      const result = calculateAutoLoan({
        vehiclePrice: 20000,
        downPayment: 0,
        tradeInValue: 0,
        annualInterestRate: 5,
        loanTermMonths: 60,
        salesTaxRate: 0,
      });
      expect(result).not.toBeNull();
      expect(result!.amortization).toHaveLength(60);
    });

    it("sales tax increases total vehicle cost", () => {
      const withTax = calculateAutoLoan({
        vehiclePrice: 20000,
        downPayment: 0,
        tradeInValue: 0,
        annualInterestRate: 5,
        loanTermMonths: 60,
        salesTaxRate: 10,
      });
      const withoutTax = calculateAutoLoan({
        vehiclePrice: 20000,
        downPayment: 0,
        tradeInValue: 0,
        annualInterestRate: 5,
        loanTermMonths: 60,
        salesTaxRate: 0,
      });
      expect(withTax).not.toBeNull();
      expect(withoutTax).not.toBeNull();
      expect(withTax!.loanAmount).toBeGreaterThan(withoutTax!.loanAmount);
    });
  });
});
