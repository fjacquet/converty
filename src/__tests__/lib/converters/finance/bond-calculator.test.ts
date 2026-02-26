import { describe, expect, it } from "vitest";
import { calculateBond } from "@/lib/converters/finance/bond-calculator";

describe("calculateBond", () => {
  describe("null returns for invalid input", () => {
    it("returns null for zero face value", () => {
      expect(
        calculateBond({
          faceValue: 0,
          couponRate: 5,
          yearsToMaturity: 10,
          paymentFrequency: 1,
          marketRate: 5,
        })
      ).toBeNull();
    });

    it("returns null for zero yearsToMaturity", () => {
      expect(
        calculateBond({
          faceValue: 1000,
          couponRate: 5,
          yearsToMaturity: 0,
          paymentFrequency: 1,
          marketRate: 5,
        })
      ).toBeNull();
    });
  });

  describe("par bond (coupon = market rate)", () => {
    it("par bond: price ≈ face value when couponRate equals marketRate", () => {
      const result = calculateBond({
        faceValue: 1000,
        couponRate: 5,
        yearsToMaturity: 10,
        paymentFrequency: 1,
        marketRate: 5,
      });
      expect(result).not.toBeNull();
      expect(result!.bondPrice).toBeCloseTo(1000, 0);
    });

    it("par bond: isPremium is false", () => {
      const result = calculateBond({
        faceValue: 1000,
        couponRate: 5,
        yearsToMaturity: 10,
        paymentFrequency: 1,
        marketRate: 5,
      });
      expect(result).not.toBeNull();
      expect(result!.isPremium).toBe(false);
    });
  });

  describe("discount bond (coupon < market rate)", () => {
    it("discount bond: price < face value when couponRate < marketRate", () => {
      const result = calculateBond({
        faceValue: 1000,
        couponRate: 3,
        yearsToMaturity: 10,
        paymentFrequency: 1,
        marketRate: 5,
      });
      expect(result).not.toBeNull();
      expect(result!.bondPrice).toBeLessThan(1000);
    });

    it("discount bond: isPremium is false", () => {
      const result = calculateBond({
        faceValue: 1000,
        couponRate: 3,
        yearsToMaturity: 10,
        paymentFrequency: 1,
        marketRate: 5,
      });
      expect(result).not.toBeNull();
      expect(result!.isPremium).toBe(false);
    });
  });

  describe("premium bond (coupon > market rate)", () => {
    it("premium bond: price > face value when couponRate > marketRate", () => {
      const result = calculateBond({
        faceValue: 1000,
        couponRate: 7,
        yearsToMaturity: 10,
        paymentFrequency: 1,
        marketRate: 5,
      });
      expect(result).not.toBeNull();
      expect(result!.bondPrice).toBeGreaterThan(1000);
    });

    it("premium bond: isPremium is true", () => {
      const result = calculateBond({
        faceValue: 1000,
        couponRate: 7,
        yearsToMaturity: 10,
        paymentFrequency: 1,
        marketRate: 5,
      });
      expect(result).not.toBeNull();
      expect(result!.isPremium).toBe(true);
    });
  });

  describe("coupon payment", () => {
    it("annual coupon = faceValue × couponRate", () => {
      const result = calculateBond({
        faceValue: 1000,
        couponRate: 5,
        yearsToMaturity: 5,
        paymentFrequency: 1,
        marketRate: 5,
      });
      expect(result).not.toBeNull();
      expect(result!.couponPayment).toBeCloseTo(50, 2);
    });

    it("schedule length matches yearsToMaturity", () => {
      const result = calculateBond({
        faceValue: 1000,
        couponRate: 5,
        yearsToMaturity: 5,
        paymentFrequency: 1,
        marketRate: 5,
      });
      expect(result).not.toBeNull();
      expect(result!.schedule).toHaveLength(5);
    });

    it("last schedule entry includes face value principal payment", () => {
      const result = calculateBond({
        faceValue: 1000,
        couponRate: 5,
        yearsToMaturity: 5,
        paymentFrequency: 1,
        marketRate: 5,
      });
      expect(result).not.toBeNull();
      const lastEntry = result!.schedule[result!.schedule.length - 1];
      expect(lastEntry.principalPayment).toBe(1000);
    });
  });
});
