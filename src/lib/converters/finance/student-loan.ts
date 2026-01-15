export interface StudentLoanInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  gracePeriodMonths: number;
  interestCapitalized: boolean; // whether interest during grace period is capitalized
}

export interface StudentLoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  gracePeriodInterest: number;
  principalAfterGrace: number;
  payoffDate: string;
  amortization: Array<{
    year: number;
    principalPaid: number;
    interestPaid: number;
    endBalance: number;
  }>;
}

export function calculateStudentLoan(input: StudentLoanInput): StudentLoanResult | null {
  const { loanAmount, annualInterestRate, loanTermYears, gracePeriodMonths, interestCapitalized } =
    input;

  if (loanAmount <= 0 || loanTermYears <= 0) {
    return null;
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const loanTermMonths = loanTermYears * 12;

  // Calculate interest during grace period
  const gracePeriodInterest = loanAmount * monthlyRate * gracePeriodMonths;

  // Principal after grace period (if interest is capitalized)
  const principalAfterGrace = interestCapitalized ? loanAmount + gracePeriodInterest : loanAmount;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principalAfterGrace / loanTermMonths;
  } else {
    monthlyPayment =
      (principalAfterGrace * monthlyRate * (1 + monthlyRate) ** loanTermMonths) /
      ((1 + monthlyRate) ** loanTermMonths - 1);
  }

  const totalPaid = monthlyPayment * loanTermMonths;
  const totalInterest =
    totalPaid - principalAfterGrace + (interestCapitalized ? 0 : gracePeriodInterest);
  const totalCost = loanAmount + totalInterest + gracePeriodInterest;

  // Calculate payoff date
  const now = new Date();
  const payoffDate = new Date(
    now.getFullYear(),
    now.getMonth() + gracePeriodMonths + loanTermMonths,
    now.getDate()
  );

  // Generate yearly amortization schedule
  const amortization: StudentLoanResult["amortization"] = [];
  let balance = principalAfterGrace;

  for (let year = 1; year <= loanTermYears; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let month = 1; month <= 12; month++) {
      if (balance <= 0) break;
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
      balance = Math.max(0, balance - principalPayment);
      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;
    }

    amortization.push({
      year,
      principalPaid: yearlyPrincipal,
      interestPaid: yearlyInterest,
      endBalance: balance,
    });
  }

  return {
    monthlyPayment,
    totalInterest,
    totalCost,
    gracePeriodInterest,
    principalAfterGrace,
    payoffDate: payoffDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    }),
    amortization,
  };
}
