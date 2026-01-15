"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type AutoLoanResult, calculateAutoLoan } from "@/lib/converters/finance/auto-loan";

export function AutoLoanCalculator() {
  const t = useTranslations("calculator");
  const format = useFormatter();

  const [vehiclePrice, setVehiclePrice] = useState<number>(35000);
  const [downPayment, setDownPayment] = useState<number>(5000);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(6.5);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [salesTaxRate, setSalesTaxRate] = useState<number>(7.7);

  const result: AutoLoanResult | null = calculateAutoLoan({
    vehiclePrice,
    downPayment,
    tradeInValue,
    annualInterestRate,
    loanTermMonths,
    salesTaxRate,
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
            <Label htmlFor="vehiclePrice">Vehicle Price</Label>
            <Input
              id="vehiclePrice"
              type="number"
              min="0"
              step="1000"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="downPayment">Down Payment</Label>
            <Input
              id="downPayment"
              type="number"
              min="0"
              step="500"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tradeInValue">Trade-In Value</Label>
            <Input
              id="tradeInValue"
              type="number"
              min="0"
              step="500"
              value={tradeInValue}
              onChange={(e) => setTradeInValue(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salesTaxRate">Sales Tax Rate (%)</Label>
            <Input
              id="salesTaxRate"
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={salesTaxRate}
              onChange={(e) => setSalesTaxRate(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualInterestRate">Interest Rate (%)</Label>
            <Input
              id="annualInterestRate"
              type="number"
              min="0"
              max="30"
              step="0.1"
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanTermMonths">Loan Term (months)</Label>
            <Input
              id="loanTermMonths"
              type="number"
              min="12"
              max="84"
              step="12"
              value={loanTermMonths}
              onChange={(e) => setLoanTermMonths(Number(e.target.value))}
            />
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
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-3xl font-bold">{formatCurrency(result.monthlyPayment)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-xl font-bold">{formatCurrency(result.loanAmount)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Sales Tax</p>
                  <p className="text-xl font-bold">{formatCurrency(result.salesTax)}</p>
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
                  <span className="text-muted-foreground">Vehicle Price</span>
                  <span>{formatCurrency(vehiclePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">+ Sales Tax</span>
                  <span>{formatCurrency(result.salesTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">- Down Payment</span>
                  <span>{formatCurrency(downPayment)}</span>
                </div>
                {tradeInValue > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">- Trade-In</span>
                    <span>{formatCurrency(tradeInValue)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>= Amount Financed</span>
                  <span>{formatCurrency(result.loanAmount)}</span>
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
