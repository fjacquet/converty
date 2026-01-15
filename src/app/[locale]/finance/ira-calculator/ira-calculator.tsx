"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateIra, type IraResult } from "@/lib/converters/finance/ira-calculator";

export function IraCalculator() {
  const t = useTranslations("calculator");
  const format = useFormatter();

  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentBalance, setCurrentBalance] = useState<number>(10000);
  const [annualContribution, setAnnualContribution] = useState<number>(6500);
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(7);
  const [iraType, setIraType] = useState<"traditional" | "roth">("roth");
  const [taxBracket, setTaxBracket] = useState<number>(22);
  const [retirementTaxBracket, setRetirementTaxBracket] = useState<number>(15);

  const result: IraResult | null = calculateIra({
    currentAge,
    retirementAge,
    currentBalance,
    annualContribution,
    annualReturnRate,
    iraType,
    taxBracket,
    retirementTaxBracket,
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
            <Label>IRA Type</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="iraType"
                  checked={iraType === "traditional"}
                  onChange={() => setIraType("traditional")}
                  className="h-4 w-4"
                />
                <span>Traditional</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="iraType"
                  checked={iraType === "roth"}
                  onChange={() => setIraType("roth")}
                  className="h-4 w-4"
                />
                <span>Roth</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentAge">Current Age</Label>
              <Input
                id="currentAge"
                type="number"
                min="18"
                max="70"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retirementAge">Retirement Age</Label>
              <Input
                id="retirementAge"
                type="number"
                min="50"
                max="75"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentBalance">Current Balance</Label>
            <Input
              id="currentBalance"
              type="number"
              min="0"
              step="1000"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualContribution">Annual Contribution</Label>
            <Input
              id="annualContribution"
              type="number"
              min="0"
              max="8000"
              step="500"
              value={annualContribution}
              onChange={(e) => setAnnualContribution(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Limit: {currentAge >= 50 ? "CHF 8,000" : "CHF 7,000"}/year
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualReturnRate">Expected Return (%)</Label>
            <Input
              id="annualReturnRate"
              type="number"
              min="0"
              max="15"
              step="0.5"
              value={annualReturnRate}
              onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxBracket">Current Tax Bracket (%)</Label>
              <Input
                id="taxBracket"
                type="number"
                min="0"
                max="50"
                step="1"
                value={taxBracket}
                onChange={(e) => setTaxBracket(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retirementTaxBracket">Retirement Tax (%)</Label>
              <Input
                id="retirementTaxBracket"
                type="number"
                min="0"
                max="50"
                step="1"
                value={retirementTaxBracket}
                onChange={(e) => setRetirementTaxBracket(Number(e.target.value))}
              />
            </div>
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
                <p className="text-sm text-muted-foreground">Total at Retirement</p>
                <p className="text-3xl font-bold">{formatCurrency(result.totalAtRetirement)}</p>
              </div>

              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Effective Value (After Tax)</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(result.effectiveValue)}
                </p>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Retirement Income</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(result.monthlyInRetirement)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on 4% withdrawal rule{iraType === "traditional" ? ", after tax" : ""}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Contributions</p>
                  <p className="text-lg font-bold">{formatCurrency(result.totalContributions)}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">Investment Growth</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(result.totalGrowth)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <p className="font-medium">
                  Tax Impact ({iraType === "traditional" ? "Traditional" : "Roth"})
                </p>
                {iraType === "traditional" ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax Savings Now</span>
                      <span className="text-green-600">
                        +{formatCurrency(result.taxSavingsNow)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax in Retirement</span>
                      <span className="text-red-600">
                        -{formatCurrency(result.taxInRetirement)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    No tax deduction now, but all withdrawals are tax-free in retirement
                  </p>
                )}
              </div>

              {result.projections.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Balance Projections</p>
                  <div className="space-y-2 text-sm">
                    {result.projections.map((proj) => (
                      <div key={proj.age} className="flex justify-between">
                        <span className="text-muted-foreground">Age {proj.age}</span>
                        <span>{formatCurrency(proj.balance)}</span>
                      </div>
                    ))}
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
