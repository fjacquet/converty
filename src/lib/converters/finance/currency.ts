// Common exchange rates (static, for demo purposes)
// In a real app, these would come from an API
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CHF: 0.88,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.15,
  BRL: 4.97,
  KRW: 1320.5,
  SGD: 1.34,
  HKD: 7.82,
  SEK: 10.42,
  NOK: 10.58,
  DKK: 6.87,
  NZD: 1.64,
  ZAR: 18.65,
  RUB: 89.5,
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  CHF: "Swiss Franc",
  JPY: "Japanese Yen",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  MXN: "Mexican Peso",
  BRL: "Brazilian Real",
  KRW: "South Korean Won",
  SGD: "Singapore Dollar",
  HKD: "Hong Kong Dollar",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  DKK: "Danish Krone",
  NZD: "New Zealand Dollar",
  ZAR: "South African Rand",
  RUB: "Russian Ruble",
};

export interface CurrencyInput {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

export interface CurrencyResult {
  convertedAmount: number;
  exchangeRate: number;
  inverseRate: number;
  fromCurrency: string;
  toCurrency: string;
}

export function convertCurrency(input: CurrencyInput): CurrencyResult | null {
  const { amount, fromCurrency, toCurrency } = input;

  if (amount < 0) {
    return null;
  }

  const fromRate = EXCHANGE_RATES[fromCurrency];
  const toRate = EXCHANGE_RATES[toCurrency];

  if (!fromRate || !toRate) {
    return null;
  }

  // Convert to USD first, then to target currency
  const amountInUsd = amount / fromRate;
  const convertedAmount = amountInUsd * toRate;
  const exchangeRate = toRate / fromRate;
  const inverseRate = fromRate / toRate;

  return {
    convertedAmount: Math.round(convertedAmount * 100) / 100,
    exchangeRate: Math.round(exchangeRate * 10000) / 10000,
    inverseRate: Math.round(inverseRate * 10000) / 10000,
    fromCurrency,
    toCurrency,
  };
}

export function getAvailableCurrencies(): Array<{ code: string; name: string }> {
  return Object.keys(EXCHANGE_RATES).map((code) => ({
    code,
    name: CURRENCY_NAMES[code] || code,
  }));
}
