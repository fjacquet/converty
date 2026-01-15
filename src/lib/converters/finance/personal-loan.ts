export interface PersonalLoanInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermMonths: number;
  originationFee: number; // percentage
}

export interface PersonalLoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  originationFeeAmount: number;
  apr: number; // true APR including fees
  amortization: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export function calculatePersonalLoan(input: PersonalLoanInput): PersonalLoanResult | null {
  const { loanAmount, annualInterestRate, loanTermMonths, originationFee } = input;

  if (loanAmount <= 0 || loanTermMonths <= 0) {
    return null;
  }

  const originationFeeAmount = loanAmount * (originationFee / 100);
  const monthlyRate = annualInterestRate / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / loanTermMonths;
  } else {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  }

  const totalPaid = monthlyPayment * loanTermMonths;
  const totalInterest = totalPaid - loanAmount;
  const totalCost = totalPaid + originationFeeAmount;

  // Calculate true APR including origination fee
  const effectiveLoanAmount = loanAmount - originationFeeAmount;
  let apr = annualInterestRate;
  if (effectiveLoanAmount > 0 && originationFee > 0) {
    // Approximate APR calculation
    const effectiveMonthlyRate =
      monthlyRate > 0
        ? (monthlyPayment / effectiveLoanAmount -
            monthlyPayment / (effectiveLoanAmount * Math.pow(1 + monthlyRate, loanTermMonths))) /
          (1 - 1 / Math.pow(1 + monthlyRate, loanTermMonths))
        : monthlyPayment / effectiveLoanAmount / loanTermMonths;
    apr = effectiveMonthlyRate * 12 * 100;
  }

  // Generate amortization schedule
  const amortization: PersonalLoanResult["amortization"] = [];
  let balance = loanAmount;

  for (let month = 1; month <= loanTermMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);

    amortization.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance,
    });
  }

  return {
    monthlyPayment,
    totalInterest,
    totalCost,
    originationFeeAmount,
    apr,
    amortization,
  };
}
