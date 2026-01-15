"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type AnnuityResult, calculateAnnuity } from "@/lib/converters/finance/annuity-calculator";

export function AnnuityCalculator() {
  const t = useTranslations("calculator");
  const format = useFormatter();

  const [principal, setPrincipal] = useState<number>(500000);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(5);
  const [payoutYears, setPayoutYears] = useState<number>(20);
  const [paymentFrequency, setPaymentFrequency] = useState<number>(12);
  const [annuityType, setAnnuityType] = useState<"immediate" | "deferred">("immediate");
  const [deferralYears, setDeferralYears] = useState<number>(5);

  const result: AnnuityResult | null = calculateAnnuity({
    principal,
    annualInterestRate,
    payoutYears,
    paymentFrequency,
    annuityType,
    deferralYears: annuityType === "deferred" ? deferralYears : 0,
  });

  const formatCurrency = (value: number) =>
    format.number(value, { style: "currency", currency: "CHF" });

  const getPaymentLabel = () => {
    switch (paymentFrequency) {
      case 12:
        return "Monthly";
      case 4:
        return "Quarterly";
      case 1:
        return "Annual";
      default:
        return "Periodic";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("sections.input")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Annuity Type</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="annuityType"
                  checked={annuityType === "immediate"}
                  onChange={() => setAnnuityType("immediate")}
                  className="h-4 w-4"
                />
                <span>Immediate</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="annuityType"
                  checked={annuityType === "deferred"}
                  onChange={() => setAnnuityType("deferred")}
                  className="h-4 w-4"
                />
                <span>Deferred</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="principal">Principal Amount</Label>
            <Input
              id="principal"
              type="number"
              min="10000"
              step="10000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">Amount invested in the annuity</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualInterestRate">Interest Rate (%)</Label>
            <Input
              id="annualInterestRate"
              type="number"
              min="0"
              max="15"
              step="0.25"
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
            />
          </div>

          {annuityType === "deferred" && (
            <div className="space-y-2">
              <Label htmlFor="deferralYears">Deferral Period (years)</Label>
              <Input
                id="deferralYears"
                type="number"
                min="1"
                max="30"
                step="1"
                value={deferralYears}
                onChange={(e) => setDeferralYears(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Years before payments begin</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="payoutYears">Payout Period (years)</Label>
            <Input
              id="payoutYears"
              type="number"
              min="5"
              max="40"
              step="1"
              value={payoutYears}
              onChange={(e) => setPayoutYears(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentFrequency">Payment Frequency</Label>
            <select
              id="paymentFrequency"
              value={paymentFrequency}
              onChange={(e) => setPaymentFrequency(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value={12}>Monthly</option>
              <option value={4}>Quarterly</option>
              <option value={1}>Annual</option>
            </select>
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
                <p className="text-sm text-muted-foreground">{getPaymentLabel()} Payment</p>
                <p className="text-3xl font-bold">{formatCurrency(result.periodicPayment)}</p>
                <p className="text-xs text-muted-foreground mt-1">For {payoutYears} years</p>
              </div>

              {annuityType === "deferred" && (
                <div className="p-4 bg-blue-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Value at Payout Start</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(result.presentValue)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    After {deferralYears} years of growth
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Payments</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(result.totalPayments)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Interest Earned</p>
                  <p className="text-xl font-bold">{formatCurrency(result.totalInterestEarned)}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Effective Annual Rate</p>
                <p className="text-xl font-bold">{result.effectiveRate.toFixed(2)}%</p>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Initial Investment</span>
                  <span>{formatCurrency(principal)}</span>
                </div>
                {annuityType === "deferred" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">+ Growth During Deferral</span>
                    <span>{formatCurrency(result.presentValue - principal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">+ Interest During Payout</span>
                  <span>
                    {formatCurrency(
                      result.totalInterestEarned -
                        (annuityType === "deferred" ? result.presentValue - principal : 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2">
                  <span>= Total Received</span>
                  <span className="text-green-600">{formatCurrency(result.totalPayments)}</span>
                </div>
              </div>

              {result.schedule.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Annual Summary</p>
                  <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                    {result.schedule.slice(0, 10).map((item) => (
                      <div key={item.period} className="flex justify-between">
                        <span className="text-muted-foreground">Year {item.period}</span>
                        <span>{formatCurrency(item.payment)}</span>
                      </div>
                    ))}
                    {result.schedule.length > 10 && (
                      <p className="text-xs text-muted-foreground">
                        + {result.schedule.length - 10} more years...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Enter valid values to calculate</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
