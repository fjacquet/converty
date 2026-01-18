export type CompoundFrequency = "annually" | "semi-annually" | "quarterly" | "monthly" | "daily";

export interface CompoundInterestInput {
  principal: number;
  interestRate: number; // annual percentage
  years: number;
  compoundFrequency: CompoundFrequency;
  monthlyContribution: number;
  contributionTiming: "beginning" | "end";
}

export interface YearlyBreakdown {
  year: number;
  principal: number;
  contributions: number;
  interest: number;
  balance: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalPrincipal: number;
  totalContributions: number;
  totalInterest: number;
  effectiveAnnualRate: number;
  yearlyBreakdown: YearlyBreakdown[];
}

const getCompoundingPeriods = (frequency: CompoundFrequency): number => {
  switch (frequency) {
    case "annually":
      return 1;
    case "semi-annually":
      return 2;
    case "quarterly":
      return 4;
    case "monthly":
      return 12;
    case "daily":
      return 365;
  }
};

export function calculateCompoundInterest(
  input: CompoundInterestInput
): CompoundInterestResult | null {
  const {
    principal,
    interestRate,
    years,
    compoundFrequency,
    monthlyContribution,
    contributionTiming,
  } = input;

  if (principal < 0 || interestRate < 0 || years <= 0) {
    return null;
  }

  const n = getCompoundingPeriods(compoundFrequency);
  const r = interestRate / 100;
  const ratePerPeriod = r / n;
  const periodsPerYear = n;
  const _totalPeriods = n * years;

  // Calculate effective annual rate
  const effectiveAnnualRate = (1 + r / n) ** n - 1;

  const yearlyBreakdown: YearlyBreakdown[] = [];

  let balance = principal;
  let totalContributions = 0;

  for (let year = 1; year <= years; year++) {
    const startOfYearBalance = balance;
    const yearContributions = monthlyContribution * 12;
    totalContributions += yearContributions;

    // Calculate balance month by month for accuracy
    for (let month = 1; month <= 12; month++) {
      if (contributionTiming === "beginning") {
        balance += monthlyContribution;
      }

      // Apply compound interest based on frequency
      // For simplicity, we'll compound at month end proportionally
      const periodsThisMonth = periodsPerYear / 12;
      for (let p = 0; p < periodsThisMonth; p++) {
        balance *= 1 + ratePerPeriod;
      }

      if (contributionTiming === "end") {
        balance += monthlyContribution;
      }
    }

    yearlyBreakdown.push({
      year,
      principal,
      contributions: totalContributions,
      interest: balance - principal - totalContributions,
      balance: Math.round(balance * 100) / 100,
    });
  }

  const finalBalance = balance;
  const totalInterest = finalBalance - principal - totalContributions;

  return {
    finalBalance: Math.round(finalBalance * 100) / 100,
    totalPrincipal: principal,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveAnnualRate: Math.round(effectiveAnnualRate * 10000) / 100, // as percentage
    yearlyBreakdown,
  };
}

export const COMPOUND_FREQUENCIES: { value: CompoundFrequency; label: string }[] = [
  { value: "annually", label: "Annually" },
  { value: "semi-annually", label: "Semi-Annually" },
  { value: "quarterly", label: "Quarterly" },
  { value: "monthly", label: "Monthly" },
  { value: "daily", label: "Daily" },
];
