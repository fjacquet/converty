export interface SavingsGoalInput {
  goalAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  annualInterestRate: number;
}

export interface SavingsGoalResult {
  monthsToGoal: number;
  yearsToGoal: number;
  totalContributions: number;
  totalInterestEarned: number;
  finalBalance: number;
  goalReachable: boolean;
  projections: Array<{
    month: number;
    balance: number;
    contribution: number;
    interest: number;
  }>;
}

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalResult | null {
  const { goalAmount, currentSavings, monthlyContribution, annualInterestRate } = input;

  if (goalAmount <= 0 || currentSavings < 0 || monthlyContribution < 0 || annualInterestRate < 0) {
    return null;
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const projections: SavingsGoalResult["projections"] = [];

  let balance = currentSavings;
  let totalContributions = 0;
  let totalInterest = 0;
  let month = 0;
  const maxMonths = 600; // 50 years max

  // If already at goal
  if (currentSavings >= goalAmount) {
    return {
      monthsToGoal: 0,
      yearsToGoal: 0,
      totalContributions: 0,
      totalInterestEarned: 0,
      finalBalance: currentSavings,
      goalReachable: true,
      projections: [{ month: 0, balance: currentSavings, contribution: 0, interest: 0 }],
    };
  }

  while (balance < goalAmount && month < maxMonths) {
    month++;
    const interest = balance * monthlyRate;
    totalInterest += interest;
    totalContributions += monthlyContribution;
    balance += interest + monthlyContribution;

    // Record yearly projections for display
    if (month % 12 === 0 || balance >= goalAmount) {
      projections.push({
        month,
        balance: Math.round(balance * 100) / 100,
        contribution: Math.round(totalContributions * 100) / 100,
        interest: Math.round(totalInterest * 100) / 100,
      });
    }
  }

  const goalReachable = balance >= goalAmount;

  return {
    monthsToGoal: goalReachable ? month : -1,
    yearsToGoal: goalReachable ? Math.round((month / 12) * 10) / 10 : -1,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterestEarned: Math.round(totalInterest * 100) / 100,
    finalBalance: Math.round(balance * 100) / 100,
    goalReachable,
    projections,
  };
}
