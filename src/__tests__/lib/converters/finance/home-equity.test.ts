import { describe, expect, it } from "vitest";
import { calculateHomeEquity } from "@/lib/converters/finance/home-equity";

describe("calculateHomeEquity", () => {
  describe("null returns for invalid input", () => {
    it("returns null for zero home value", () => {
      expect(
        calculateHomeEquity({
          homeValue: 0,
          mortgageBalance: 200000,
          loanAmount: 50000,
          annualInterestRate: 6,
          loanTermYears: 10,
          isHELOC: false,
        })
      ).toBeNull();
    });

    it("returns null for zero loan amount", () => {
      expect(
        calculateHomeEquity({
          homeValue: 400000,
          mortgageBalance: 250000,
          loanAmount: 0,
          annualInterestRate: 6,
          loanTermYears: 10,
          isHELOC: false,
        })
      ).toBeNull();
    });

    it("returns null for zero loan term years", () => {
      expect(
        calculateHomeEquity({
          homeValue: 400000,
          mortgageBalance: 250000,
          loanAmount: 50000,
          annualInterestRate: 6,
          loanTermYears: 0,
          isHELOC: false,
        })
      ).toBeNull();
    });
  });

  describe("home equity loan calculation", () => {
    it("home worth $400,000 with $250,000 mortgage → availableEquity > 0", () => {
      const result = calculateHomeEquity({
        homeValue: 400000,
        mortgageBalance: 250000,
        loanAmount: 50000,
        annualInterestRate: 6,
        loanTermYears: 10,
        isHELOC: false,
      });
      expect(result).not.toBeNull();
      // maxLTV 85% → 400000*0.85 - 250000 = 340000 - 250000 = 90000
      expect(result!.availableEquity).toBeCloseTo(90000, 0);
    });

    it("monthly payment is positive for standard home equity loan", () => {
      const result = calculateHomeEquity({
        homeValue: 400000,
        mortgageBalance: 150000,
        loanAmount: 50000,
        annualInterestRate: 7,
        loanTermYears: 15,
        isHELOC: false,
      });
      expect(result).not.toBeNull();
      expect(result!.monthlyPayment).toBeGreaterThan(0);
    });

    it("total cost exceeds loan amount (interest paid)", () => {
      const result = calculateHomeEquity({
        homeValue: 400000,
        mortgageBalance: 200000,
        loanAmount: 60000,
        annualInterestRate: 6.5,
        loanTermYears: 10,
        isHELOC: false,
      });
      expect(result).not.toBeNull();
      expect(result!.totalCost).toBeGreaterThan(60000);
    });

    it("amortization schedule has correct number of yearly entries", () => {
      const result = calculateHomeEquity({
        homeValue: 400000,
        mortgageBalance: 200000,
        loanAmount: 50000,
        annualInterestRate: 6,
        loanTermYears: 10,
        isHELOC: false,
      });
      expect(result).not.toBeNull();
      expect(result!.amortization).toHaveLength(10);
    });
  });

  describe("HELOC mode", () => {
    it("HELOC returns interestOnlyPayment", () => {
      const result = calculateHomeEquity({
        homeValue: 400000,
        mortgageBalance: 200000,
        loanAmount: 50000,
        annualInterestRate: 6,
        loanTermYears: 15,
        isHELOC: true,
        drawPeriodYears: 10,
      });
      expect(result).not.toBeNull();
      expect(result!.interestOnlyPayment).toBeDefined();
      expect(result!.interestOnlyPayment!).toBeGreaterThan(0);
    });

    it("HELOC interest-only payment = loanAmount × monthlyRate", () => {
      const loanAmount = 50000;
      const annualInterestRate = 6;
      const expectedInterestOnly = loanAmount * (annualInterestRate / 100 / 12);
      const result = calculateHomeEquity({
        homeValue: 400000,
        mortgageBalance: 200000,
        loanAmount,
        annualInterestRate,
        loanTermYears: 15,
        isHELOC: true,
      });
      expect(result).not.toBeNull();
      expect(result!.interestOnlyPayment).toBeCloseTo(expectedInterestOnly, 2);
    });
  });
});
