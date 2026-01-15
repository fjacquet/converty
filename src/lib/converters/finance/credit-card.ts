export interface CreditCardInput {
  balance: number;
  annualInterestRate: number;
  minimumPaymentPercent: number;
  minimumPaymentFixed: number;
  additionalPayment: number;
  targetMonths?: number;
}

export interface CreditCardResult {
  monthsToPayoff: number;
  yearsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  firstPayment: number;
  averagePayment: number;
  paymentForTarget?: number;
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export function calculateCreditCard(input: CreditCardInput): CreditCardResult | null {
  const {
    balance,
    annualInterestRate,
    minimumPaymentPercent,
    minimumPaymentFixed,
    additionalPayment,
    targetMonths,
  } = input;

  if (balance <= 0) {
    return null;
  }

  const monthlyRate = annualInterestRate / 100 / 12;

  // Calculate minimum payment as max of percentage and fixed minimum
  const getMinPayment = (bal: number) =>
    Math.max(bal * (minimumPaymentPercent / 100), minimumPaymentFixed);

  // Simulate payoff with current payments
  let currentBalance = balance;
  let totalInterest = 0;
  let totalPayments = 0;
  const schedule: CreditCardResult["schedule"] = [];
  let month = 0;

  while (currentBalance > 0.01 && month < 600) {
    month++;
    const interestCharge = currentBalance * monthlyRate;
    const minPayment = getMinPayment(currentBalance);
    const payment = Math.min(minPayment + additionalPayment, currentBalance + interestCharge);
    const principalPayment = payment - interestCharge;

    if (principalPayment <= 0) {
      return null; // Payment not enough to cover interest
    }

    currentBalance = Math.max(0, currentBalance - principalPayment);
    totalInterest += interestCharge;
    totalPayments += payment;

    schedule.push({
      month,
      payment,
      principal: principalPayment,
      interest: interestCharge,
      balance: currentBalance,
    });
  }

  // Calculate payment needed to pay off in target months
  let paymentForTarget: number | undefined;
  if (targetMonths && targetMonths > 0) {
    if (monthlyRate === 0) {
      paymentForTarget = balance / targetMonths;
    } else {
      paymentForTarget =
        (balance * monthlyRate * Math.pow(1 + monthlyRate, targetMonths)) /
        (Math.pow(1 + monthlyRate, targetMonths) - 1);
    }
  }

  return {
    monthsToPayoff: month,
    yearsToPayoff: month / 12,
    totalInterest,
    totalPaid: totalPayments,
    firstPayment: schedule[0]?.payment ?? 0,
    averagePayment: totalPayments / month,
    paymentForTarget,
    schedule,
  };
}
