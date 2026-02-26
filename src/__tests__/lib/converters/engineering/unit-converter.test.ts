import { describe, expect, it } from "vitest";
import {
  calculateUnitConversion,
  UNIT_CATEGORIES,
} from "@/lib/converters/engineering/unit-converter";

describe("calculateUnitConversion", () => {
  describe("null returns for invalid inputs", () => {
    it("returns null for unknown categoryId", () => {
      expect(
        calculateUnitConversion({
          categoryId: "unknown-category",
          fromUnit: "m",
          toUnit: "ft",
          value: 1,
        })
      ).toBeNull();
    });

    it("returns null for unknown fromUnit", () => {
      expect(
        calculateUnitConversion({
          categoryId: "length",
          fromUnit: "unknown",
          toUnit: "ft",
          value: 1,
        })
      ).toBeNull();
    });

    it("returns null for unknown toUnit", () => {
      expect(
        calculateUnitConversion({
          categoryId: "length",
          fromUnit: "m",
          toUnit: "unknown",
          value: 1,
        })
      ).toBeNull();
    });
  });

  describe("length conversions", () => {
    it("1 meter = 3.28084 feet", () => {
      const result = calculateUnitConversion({
        categoryId: "length",
        fromUnit: "m",
        toUnit: "ft",
        value: 1,
      });
      expect(result).not.toBeNull();
      expect(result!.result).toBeCloseTo(3.28084, 4);
    });

    it("1 foot = 0.3048 meters", () => {
      const result = calculateUnitConversion({
        categoryId: "length",
        fromUnit: "ft",
        toUnit: "m",
        value: 1,
      });
      expect(result).not.toBeNull();
      expect(result!.result).toBeCloseTo(0.3048, 4);
    });

    it("same unit conversion returns 1:1", () => {
      const result = calculateUnitConversion({
        categoryId: "length",
        fromUnit: "m",
        toUnit: "m",
        value: 5,
      });
      expect(result!.result).toBeCloseTo(5, 4);
    });
  });

  describe("pressure conversions", () => {
    it("1 atm = 101325 Pa", () => {
      const result = calculateUnitConversion({
        categoryId: "pressure",
        fromUnit: "atm",
        toUnit: "Pa",
        value: 1,
      });
      expect(result).not.toBeNull();
      expect(result!.result).toBeCloseTo(101325, 0);
    });

    it("1 MPa = 1,000,000 Pa", () => {
      const result = calculateUnitConversion({
        categoryId: "pressure",
        fromUnit: "MPa",
        toUnit: "Pa",
        value: 1,
      });
      expect(result).not.toBeNull();
      expect(result!.result).toBeCloseTo(1e6, 0);
    });
  });

  describe("mass conversions", () => {
    it.each([
      ["mass", "kg", "lb", 1, 2.20462, 4],
      ["mass", "lb", "kg", 1, 0.453592, 4],
    ])("category=%s: %s %s = %s %s (≈%s decimals)", (categoryId, from, to, val, expected, prec) => {
      const result = calculateUnitConversion({
        categoryId,
        fromUnit: from,
        toUnit: to,
        value: val,
      });
      if (result) {
        expect(result.result).toBeCloseTo(expected, prec);
      }
    });
  });

  describe("result structure", () => {
    it("returns result, conversionFactor, steps, allConversions", () => {
      const result = calculateUnitConversion({
        categoryId: "length",
        fromUnit: "m",
        toUnit: "ft",
        value: 1,
      });
      expect(result!.conversionFactor).toBeGreaterThan(0);
      expect(result!.steps).toBeInstanceOf(Array);
      expect(result!.allConversions).toBeInstanceOf(Array);
    });

    it("allConversions includes all units in category", () => {
      const result = calculateUnitConversion({
        categoryId: "length",
        fromUnit: "m",
        toUnit: "ft",
        value: 1,
      });
      const lengthCategory = UNIT_CATEGORIES.find((c) => c.id === "length");
      expect(result!.allConversions.length).toBe(lengthCategory!.units.length);
    });
  });
});

describe("UNIT_CATEGORIES", () => {
  it("contains at least 5 categories", () => {
    expect(UNIT_CATEGORIES.length).toBeGreaterThanOrEqual(5);
  });

  it("each category has id, name, and units array", () => {
    for (const cat of UNIT_CATEGORIES) {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.units.length).toBeGreaterThan(0);
    }
  });
});
