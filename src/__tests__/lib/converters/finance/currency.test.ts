import { describe, expect, it } from "vitest";
import {
  convertCurrency,
  EXCHANGE_RATES,
  getAvailableCurrencies,
} from "@/lib/converters/finance/currency";

describe("convertCurrency", () => {
  describe("null returns for invalid input", () => {
    it("returns null for unknown fromCurrency", () => {
      expect(convertCurrency({ amount: 100, fromCurrency: "XYZ", toCurrency: "USD" })).toBeNull();
    });

    it("returns null for unknown toCurrency", () => {
      expect(convertCurrency({ amount: 100, fromCurrency: "USD", toCurrency: "XYZ" })).toBeNull();
    });

    it("returns null for negative amount", () => {
      expect(convertCurrency({ amount: -50, fromCurrency: "USD", toCurrency: "EUR" })).toBeNull();
    });
  });

  describe("USD to EUR conversion", () => {
    it("converts USD to EUR using static rates", () => {
      const result = convertCurrency({ amount: 100, fromCurrency: "USD", toCurrency: "EUR" });
      expect(result).not.toBeNull();
      // USD rate is 1, EUR rate is 0.92 → 100 * 0.92 = 92
      expect(result!.convertedAmount).toBeCloseTo(100 * EXCHANGE_RATES.EUR, 0);
    });

    it("converts EUR to USD correctly", () => {
      const result = convertCurrency({ amount: 92, fromCurrency: "EUR", toCurrency: "USD" });
      expect(result).not.toBeNull();
      // 92 EUR / 0.92 = 100 USD
      expect(result!.convertedAmount).toBeCloseTo(100, 0);
    });
  });

  describe("same currency conversion", () => {
    it("USD to USD returns same amount", () => {
      const result = convertCurrency({ amount: 500, fromCurrency: "USD", toCurrency: "USD" });
      expect(result).not.toBeNull();
      expect(result!.convertedAmount).toBeCloseTo(500, 2);
    });
  });

  describe("round-trip conversion", () => {
    it("USD → EUR → USD is approximately commutative within float precision", () => {
      const toEur = convertCurrency({ amount: 100, fromCurrency: "USD", toCurrency: "EUR" });
      expect(toEur).not.toBeNull();
      const backToUsd = convertCurrency({
        amount: toEur!.convertedAmount,
        fromCurrency: "EUR",
        toCurrency: "USD",
      });
      expect(backToUsd).not.toBeNull();
      expect(backToUsd!.convertedAmount).toBeCloseTo(100, 0);
    });
  });

  describe("zero amount", () => {
    it("0 amount converts to 0 in any currency", () => {
      const result = convertCurrency({ amount: 0, fromCurrency: "USD", toCurrency: "JPY" });
      expect(result).not.toBeNull();
      expect(result!.convertedAmount).toBe(0);
    });
  });

  describe("getAvailableCurrencies", () => {
    it("returns an array including USD and EUR", () => {
      const currencies = getAvailableCurrencies();
      expect(currencies).toContain("USD");
      expect(currencies).toContain("EUR");
    });

    it("returns all currencies defined in EXCHANGE_RATES", () => {
      const currencies = getAvailableCurrencies();
      expect(currencies.length).toBe(Object.keys(EXCHANGE_RATES).length);
    });
  });
});
