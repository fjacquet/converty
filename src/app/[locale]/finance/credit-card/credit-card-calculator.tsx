"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type CreditCardResult, calculateCreditCard } from "@/lib/converters/finance/credit-card";

export function CreditCardCalculator() {
  const t = useTranslations("calculator");
  const format = useFormatter();

  const [balance, setBalance] = useState<number>(5000);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(19.99);
  const [minimumPaymentPercent, setMinimumPaymentPercent] = useState<number>(2);
  const [minimumPaymentFixed, setMinimumPaymentFixed] = useState<number>(25);
  const [additionalPayment, setAdditionalPayment] = useState<number>(50);
  const [targetMonths, setTargetMonths] = useState<number>(24);

  const result: CreditCardResult | null = calculateCreditCard({
    balance,
    annualInterestRate,
    minimumPaymentPercent,
    minimumPaymentFixed,
    additionalPayment,
    targetMonths,
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
            <Label htmlFor="balance">Current Balance</Label>
            <Input
              id="balance"
              type="number"
              min="100"
              step="100"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualInterestRate">Annual Interest Rate (%)</Label>
            <Input
              id="annualInterestRate"
              type="number"
              min="0"
              max="40"
              step="0.01"
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumPaymentPercent">Minimum Payment (%)</Label>
            <Input
              id="minimumPaymentPercent"
              type="number"
              min="1"
              max="10"
              step="0.1"
              value={minimumPaymentPercent}
              onChange={(e) => setMinimumPaymentPercent(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Percentage of balance for minimum payment
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumPaymentFixed">Minimum Payment Floor</Label>
            <Input
              id="minimumPaymentFixed"
              type="number"
              min="10"
              step="5"
              value={minimumPaymentFixed}
              onChange={(e) => setMinimumPaymentFixed(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Minimum payment cannot go below this amount
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalPayment">Additional Payment</Label>
            <Input
              id="additionalPayment"
              type="number"
              min="0"
              step="10"
              value={additionalPayment}
              onChange={(e) => setAdditionalPayment(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetMonths">Target Payoff (months)</Label>
            <Input
              id="targetMonths"
              type="number"
              min="1"
              max="120"
              step="1"
              value={targetMonths}
              onChange={(e) => setTargetMonths(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Calculate payment needed to pay off in this time
            </p>
          </div>
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
                <p className="text-sm text-muted-foreground">First Payment</p>
                <p className="text-3xl font-bold">{formatCurrency(result.firstPayment)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Average: {formatCurrency(result.averagePayment)}
                </p>
              </div>

              <div className="p-4 bg-yellow-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Time to Payoff</p>
                <p className="text-xl font-bold text-yellow-600">
                  {Math.floor(result.yearsToPayoff)} years, {result.monthsToPayoff % 12} months
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ({result.monthsToPayoff} total months)
                </p>
              </div>

              {result.paymentForTarget && (
                <div className="p-4 bg-blue-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Payment for {targetMonths}-Month Payoff
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(result.paymentForTarget)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-xl font-bold">{formatCurrency(result.totalPaid)}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Balance</span>
                  <span>{formatCurrency(balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">+ Total Interest</span>
                  <span>{formatCurrency(result.totalInterest)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2">
                  <span>= Total Cost</span>
                  <span>{formatCurrency(result.totalPaid)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Enter valid values to calculate. Payment must cover interest.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
