import { describe, expect, it } from "vitest";
import { calculateTip } from "@/lib/converters/finance/tip";

describe("calculateTip", () => {
  describe("null returns for invalid input", () => {
    it("returns null for negative bill amount", () => {
      expect(calculateTip({ billAmount: -50, tipPercentage: 20, numberOfPeople: 1 })).toBeNull();
    });

    it("returns null for negative tip percentage", () => {
      expect(calculateTip({ billAmount: 50, tipPercentage: -10, numberOfPeople: 1 })).toBeNull();
    });

    it("returns null for zero number of people", () => {
      expect(calculateTip({ billAmount: 50, tipPercentage: 20, numberOfPeople: 0 })).toBeNull();
    });
  });

  describe("basic tip calculation", () => {
    it("$50 bill with 20% tip → tipAmount = $10, totalAmount = $60", () => {
      const result = calculateTip({ billAmount: 50, tipPercentage: 20, numberOfPeople: 1 });
      expect(result).not.toBeNull();
      expect(result!.tipAmount).toBeCloseTo(10, 2);
      expect(result!.totalAmount).toBeCloseTo(60, 2);
    });

    it("0% tip → tipAmount = $0, totalAmount = billAmount", () => {
      const result = calculateTip({ billAmount: 50, tipPercentage: 0, numberOfPeople: 1 });
      expect(result).not.toBeNull();
      expect(result!.tipAmount).toBeCloseTo(0, 2);
      expect(result!.totalAmount).toBeCloseTo(50, 2);
    });

    it("zero bill → all values are zero", () => {
      const result = calculateTip({ billAmount: 0, tipPercentage: 20, numberOfPeople: 1 });
      expect(result).not.toBeNull();
      expect(result!.tipAmount).toBe(0);
      expect(result!.totalAmount).toBe(0);
    });
  });

  describe("per-person calculation", () => {
    it("$60 total for 2 people → totalPerPerson = $30", () => {
      const result = calculateTip({ billAmount: 50, tipPercentage: 20, numberOfPeople: 2 });
      expect(result).not.toBeNull();
      // total = 60, per person = 30
      expect(result!.totalPerPerson).toBeCloseTo(30, 2);
    });

    it("tipPerPerson = tipAmount / numberOfPeople", () => {
      const result = calculateTip({ billAmount: 100, tipPercentage: 15, numberOfPeople: 4 });
      expect(result).not.toBeNull();
      // tip = 15, per person = 3.75
      expect(result!.tipPerPerson).toBeCloseTo(3.75, 2);
    });
  });
});
