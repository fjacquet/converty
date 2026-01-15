"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateHomeEquity, type HomeEquityResult } from "@/lib/converters/finance/home-equity";

export function HomeEquityCalculator() {
  const t = useTranslations("calculator");
  const format = useFormatter();

  const [homeValue, setHomeValue] = useState<number>(500000);
  const [mortgageBalance, setMortgageBalance] = useState<number>(300000);
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(7.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(15);
  const [isHELOC, setIsHELOC] = useState<boolean>(false);

  const result: HomeEquityResult | null = calculateHomeEquity({
    homeValue,
    mortgageBalance,
    loanAmount,
    annualInterestRate,
    loanTermYears,
    isHELOC,
  });

  const formatCurrency = (value: number) =>
    format.number(value, { style: "currency", currency: "CHF" });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("sections.input")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="homeValue">Home Value</Label>
            <Input
              id="homeValue"
              type="number"
              min="0"
              step="10000"
              value={homeValue}
              onChange={(e) => setHomeValue(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mortgageBalance">Current Mortgage Balance</Label>
            <Input
              id="mortgageBalance"
              type="number"
              min="0"
              step="5000"
              value={mortgageBalance}
              onChange={(e) => setMortgageBalance(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanAmount">Desired Loan Amount</Label>
            <Input
              id="loanAmount"
              type="number"
              min="0"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualInterestRate">Interest Rate (%)</Label>
            <Input
              id="annualInterestRate"
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanTermYears">Loan Term (years)</Label>
            <Input
              id="loanTermYears"
              type="number"
              min="5"
              max="30"
              step="5"
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isHELOC"
              type="checkbox"
              checked={isHELOC}
              onChange={(e) => setIsHELOC(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isHELOC" className="text-sm font-normal">
              HELOC (Home Equity Line of Credit)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            HELOC has a draw period with interest-only payments, then a repayment period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("sections.results")}</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-3xl font-bold">{formatCurrency(result.monthlyPayment)}</p>
                {isHELOC && result.interestOnlyPayment && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Interest-only during draw: {formatCurrency(result.interestOnlyPayment)}
                  </p>
                )}
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Available Equity (85% LTV)</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(result.availableEquity)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on home value less existing mortgage
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Current LTV</p>
                  <p className="text-xl font-bold">{result.loanToValue.toFixed(1)}%</p>
                </div>
                <div
                  className={`p-4 rounded-lg ${result.combinedLTV > 80 ? "bg-yellow-500/10" : "bg-green-500/10"}`}
                >
                  <p className="text-sm text-muted-foreground">Combined LTV</p>
                  <p
                    className={`text-xl font-bold ${result.combinedLTV > 80 ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {result.combinedLTV.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-xl font-bold">{formatCurrency(result.totalCost)}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Home Value</span>
                  <span>{formatCurrency(homeValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mortgage Balance</span>
                  <span>{formatCurrency(mortgageBalance)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Current Equity</span>
                  <span>{formatCurrency(homeValue - mortgageBalance)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">New Loan Amount</span>
                  <span>{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Equity After Loan</span>
                  <span>{formatCurrency(homeValue - mortgageBalance - loanAmount)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Enter values to calculate</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
