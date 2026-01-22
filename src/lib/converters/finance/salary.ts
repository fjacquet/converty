export type FilingStatus = "single" | "married_joint" | "married_separate" | "head_of_household";
export type PayFrequency = "annual" | "monthly" | "biweekly" | "weekly" | "hourly";

export interface SalaryInput {
  salary: number;
  payFrequency: PayFrequency;
  hoursPerWeek: number; // for hourly
  filingStatus: FilingStatus;
  stateCode: string;
  preTaxDeductions: number; // 401k, HSA, etc.
  postTaxDeductions: number;
}

// 2024 Federal Tax Brackets (simplified)
const FEDERAL_TAX_BRACKETS: Record<FilingStatus, { min: number; max: number; rate: number }[]> = {
  single: [
    { min: 0, max: 11600, rate: 0.1 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married_joint: [
    { min: 0, max: 23200, rate: 0.1 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
  married_separate: [
    { min: 0, max: 11600, rate: 0.1 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 365600, rate: 0.35 },
    { min: 365600, max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 16550, rate: 0.1 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
};

// Standard deductions for 2024
const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_of_household: 21900,
};

// Simplified state tax rates (flat rate approximations)
// State names are translated in UI components using i18n
// See finance.states.* keys in translation files
const STATE_TAX_RATES: Record<string, { rate: number }> = {
  AL: { rate: 0.05 },
  AK: { rate: 0 },
  AZ: { rate: 0.025 },
  AR: { rate: 0.044 },
  CA: { rate: 0.093 },
  CO: { rate: 0.044 },
  CT: { rate: 0.05 },
  DE: { rate: 0.055 },
  FL: { rate: 0 },
  GA: { rate: 0.055 },
  HI: { rate: 0.085 },
  ID: { rate: 0.058 },
  IL: { rate: 0.0495 },
  IN: { rate: 0.0315 },
  IA: { rate: 0.057 },
  KS: { rate: 0.057 },
  KY: { rate: 0.045 },
  LA: { rate: 0.0425 },
  ME: { rate: 0.0715 },
  MD: { rate: 0.0575 },
  MA: { rate: 0.05 },
  MI: { rate: 0.0425 },
  MN: { rate: 0.0785 },
  MS: { rate: 0.05 },
  MO: { rate: 0.0495 },
  MT: { rate: 0.059 },
  NE: { rate: 0.0584 },
  NV: { rate: 0 },
  NH: { rate: 0.05 }, // Dividends/interest only
  NJ: { rate: 0.0637 },
  NM: { rate: 0.059 },
  NY: { rate: 0.0685 },
  NC: { rate: 0.0525 },
  ND: { rate: 0.029 },
  OH: { rate: 0.04 },
  OK: { rate: 0.0475 },
  OR: { rate: 0.099 },
  PA: { rate: 0.0307 },
  RI: { rate: 0.0599 },
  SC: { rate: 0.064 },
  SD: { rate: 0 },
  TN: { rate: 0 },
  TX: { rate: 0 },
  UT: { rate: 0.0485 },
  VT: { rate: 0.0875 },
  VA: { rate: 0.0575 },
  WA: { rate: 0 },
  WV: { rate: 0.065 },
  WI: { rate: 0.0765 },
  WY: { rate: 0 },
  DC: { rate: 0.085 },
};

export interface SalaryResult {
  grossAnnual: number;
  grossMonthly: number;
  grossBiweekly: number;
  grossWeekly: number;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  totalTax: number;
  netAnnual: number;
  netMonthly: number;
  netBiweekly: number;
  netWeekly: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  taxBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

function calculateFederalTax(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = FEDERAL_TAX_BRACKETS[filingStatus];
  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const bracketWidth = bracket.max - bracket.min;
    const taxableInBracket = Math.min(remainingIncome, bracketWidth);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return tax;
}

function getMarginalTaxRate(taxableIncome: number, filingStatus: FilingStatus): number {
  const brackets = FEDERAL_TAX_BRACKETS[filingStatus];

  for (const bracket of brackets) {
    if (taxableIncome >= bracket.min && taxableIncome < bracket.max) {
      return bracket.rate;
    }
  }

  return brackets[brackets.length - 1].rate;
}

export function calculateSalary(input: SalaryInput): SalaryResult | null {
  const {
    salary,
    payFrequency,
    hoursPerWeek,
    filingStatus,
    stateCode,
    preTaxDeductions,
    postTaxDeductions,
  } = input;

  if (salary <= 0) {
    return null;
  }

  // Calculate gross annual salary
  let grossAnnual: number;
  switch (payFrequency) {
    case "annual":
      grossAnnual = salary;
      break;
    case "monthly":
      grossAnnual = salary * 12;
      break;
    case "biweekly":
      grossAnnual = salary * 26;
      break;
    case "weekly":
      grossAnnual = salary * 52;
      break;
    case "hourly":
      grossAnnual = salary * hoursPerWeek * 52;
      break;
  }

  // Calculate taxable income (after pre-tax deductions and standard deduction)
  const annualPreTaxDeductions = preTaxDeductions * 12;
  const standardDeduction = STANDARD_DEDUCTIONS[filingStatus];
  const taxableIncome = Math.max(0, grossAnnual - annualPreTaxDeductions - standardDeduction);

  // Calculate federal income tax
  const federalTax = calculateFederalTax(taxableIncome, filingStatus);

  // Calculate state tax
  const stateInfo = STATE_TAX_RATES[stateCode] || { rate: 0 };
  const stateTax = taxableIncome * stateInfo.rate;

  // Calculate FICA taxes (Social Security and Medicare)
  const socialSecurityWageBase = 168600; // 2024 limit
  const socialSecurityRate = 0.062;
  const medicareRate = 0.0145;
  const additionalMedicareThreshold = 200000;
  const additionalMedicareRate = 0.009;

  const socialSecurity = Math.min(grossAnnual, socialSecurityWageBase) * socialSecurityRate;
  let medicare = grossAnnual * medicareRate;
  if (grossAnnual > additionalMedicareThreshold) {
    medicare += (grossAnnual - additionalMedicareThreshold) * additionalMedicareRate;
  }

  // Total tax and deductions
  const totalTax = federalTax + stateTax + socialSecurity + medicare;
  const annualPostTaxDeductions = postTaxDeductions * 12;

  // Calculate net income
  const netAnnual = grossAnnual - totalTax - annualPreTaxDeductions - annualPostTaxDeductions;

  // Calculate breakdowns
  const grossMonthly = grossAnnual / 12;
  const grossBiweekly = grossAnnual / 26;
  const grossWeekly = grossAnnual / 52;

  const netMonthly = netAnnual / 12;
  const netBiweekly = netAnnual / 26;
  const netWeekly = netAnnual / 52;

  const effectiveTaxRate = (totalTax / grossAnnual) * 100;
  const marginalTaxRate = getMarginalTaxRate(taxableIncome, filingStatus) * 100;

  // Use translation keys for tax breakdown categories
  const taxBreakdown = [
    {
      category: "tax_federal_income",
      amount: federalTax,
      percentage: (federalTax / grossAnnual) * 100,
    },
    { category: "tax_state", amount: stateTax, percentage: (stateTax / grossAnnual) * 100 },
    {
      category: "tax_social_security",
      amount: socialSecurity,
      percentage: (socialSecurity / grossAnnual) * 100,
    },
    { category: "tax_medicare", amount: medicare, percentage: (medicare / grossAnnual) * 100 },
  ];

  return {
    grossAnnual: Math.round(grossAnnual * 100) / 100,
    grossMonthly: Math.round(grossMonthly * 100) / 100,
    grossBiweekly: Math.round(grossBiweekly * 100) / 100,
    grossWeekly: Math.round(grossWeekly * 100) / 100,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    federalTax: Math.round(federalTax * 100) / 100,
    stateTax: Math.round(stateTax * 100) / 100,
    socialSecurity: Math.round(socialSecurity * 100) / 100,
    medicare: Math.round(medicare * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    netAnnual: Math.round(netAnnual * 100) / 100,
    netMonthly: Math.round(netMonthly * 100) / 100,
    netBiweekly: Math.round(netBiweekly * 100) / 100,
    netWeekly: Math.round(netWeekly * 100) / 100,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    marginalTaxRate: Math.round(marginalTaxRate * 100) / 100,
    taxBreakdown: taxBreakdown.map((t) => ({
      ...t,
      amount: Math.round(t.amount * 100) / 100,
      percentage: Math.round(t.percentage * 100) / 100,
    })),
  };
}

// Use translation keys for labels
export const FILING_STATUSES: { value: FilingStatus; label: string }[] = [
  { value: "single", label: "filing_single" },
  { value: "married_joint", label: "filing_married_joint" },
  { value: "married_separate", label: "filing_married_separate" },
  { value: "head_of_household", label: "filing_head_of_household" },
];

// Use translation keys for labels
export const PAY_FREQUENCIES: { value: PayFrequency; label: string }[] = [
  { value: "annual", label: "pay_annual" },
  { value: "monthly", label: "pay_monthly" },
  { value: "biweekly", label: "pay_biweekly" },
  { value: "weekly", label: "pay_weekly" },
  { value: "hourly", label: "pay_hourly" },
];

export const US_STATES = Object.keys(STATE_TAX_RATES).sort();
