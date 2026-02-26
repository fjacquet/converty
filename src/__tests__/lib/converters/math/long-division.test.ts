import { calculateLongDivision } from "@/lib/converters/math/long-division";

describe("calculateLongDivision", () => {
  describe("basic division", () => {
    it("divides 10 by 3 with remainder 1", () => {
      const result = calculateLongDivision({ dividend: 10, divisor: 3 });
      expect(result).not.toBeNull();
      expect(result?.quotient).toBe(3);
      expect(result?.remainder).toBe(1);
      expect(result?.isExact).toBe(false);
    });

    it("divides 100 by 4 evenly", () => {
      const result = calculateLongDivision({ dividend: 100, divisor: 4 });
      expect(result).not.toBeNull();
      expect(result?.quotient).toBe(25);
      expect(result?.remainder).toBe(0);
      expect(result?.isExact).toBe(true);
    });

    it("returns null for divisor=0", () => {
      const result = calculateLongDivision({ dividend: 10, divisor: 0 });
      expect(result).toBeNull();
    });

    it("returns null for non-integer dividend", () => {
      const result = calculateLongDivision({ dividend: 10.5, divisor: 2 });
      expect(result).toBeNull();
    });

    it("returns null for non-integer divisor", () => {
      const result = calculateLongDivision({ dividend: 10, divisor: 2.5 });
      expect(result).toBeNull();
    });
  });

  describe("steps array", () => {
    it("returns non-empty steps array", () => {
      const result = calculateLongDivision({ dividend: 100, divisor: 3 });
      expect(result).not.toBeNull();
      expect(result?.steps.length).toBeGreaterThan(0);
    });
  });

  describe("fraction and decimal", () => {
    it("provides fraction representation", () => {
      const result = calculateLongDivision({ dividend: 7, divisor: 3 });
      expect(result).not.toBeNull();
      expect(result?.fraction).toBe("7/3");
    });

    it("simplifies fraction when possible", () => {
      const result = calculateLongDivision({ dividend: 6, divisor: 4 });
      expect(result).not.toBeNull();
      expect(result?.fraction).toBe("3/2");
    });

    it("provides decimal value", () => {
      const result = calculateLongDivision({ dividend: 1, divisor: 4 });
      expect(result).not.toBeNull();
      expect(result?.decimal).toBeCloseTo(0.25, 5);
    });
  });

  describe("repeating decimals", () => {
    it("detects repeating decimal for 1/3", () => {
      const result = calculateLongDivision({ dividend: 1, divisor: 3 });
      expect(result).not.toBeNull();
      expect(result?.repeatingDecimal).toBeDefined();
      expect(result?.repeatingDecimal).toContain("(");
    });

    it("no repeating decimal for exact division", () => {
      const result = calculateLongDivision({ dividend: 1, divisor: 4 });
      expect(result).not.toBeNull();
      expect(result?.repeatingDecimal).toBeUndefined();
    });
  });

  describe("mixed number", () => {
    it("shows whole number when exact", () => {
      const result = calculateLongDivision({ dividend: 8, divisor: 4 });
      expect(result).not.toBeNull();
      expect(result?.mixedNumber).toBe("2");
    });

    it("shows mixed number for improper fraction", () => {
      const result = calculateLongDivision({ dividend: 7, divisor: 3 });
      expect(result).not.toBeNull();
      expect(result?.mixedNumber).toContain("2");
    });
  });

  describe("negative numbers", () => {
    it("handles negative dividend", () => {
      const result = calculateLongDivision({ dividend: -10, divisor: 3 });
      expect(result).not.toBeNull();
      expect(result?.decimal).toBeLessThan(0);
    });

    it("handles negative divisor", () => {
      const result = calculateLongDivision({ dividend: 10, divisor: -2 });
      expect(result).not.toBeNull();
      expect(result?.decimal).toBeLessThan(0);
    });
  });

  describe("verification", () => {
    it("includes verification string", () => {
      const result = calculateLongDivision({ dividend: 17, divisor: 5 });
      expect(result).not.toBeNull();
      expect(result?.verification).toBeDefined();
      expect(typeof result?.verification).toBe("string");
    });
  });
});
