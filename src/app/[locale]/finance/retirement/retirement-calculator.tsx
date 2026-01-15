"use client";

import { createCalculatorStore } from "@/stores/calculator-store";
import {
  calculateRetirement,
  type RetirementInput,
  type RetirementResult,
} from "@/lib/converters/finance/retirement";
import { InputField, ResultGrid } from "@/components/converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

const useRetirementStore = createCalculatorStore<RetirementInput, RetirementResult>({
  name: "retirement-calculator",
  initialValues: {
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 1000,
    expectedReturn: 7,
    inflationRate: 2.5,
    desiredAnnualIncome: 60000,
    socialSecurityBenefit: 2000,
    lifeExpectancy: 90,
  },
  calculate: calculateRetirement,
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatCompact = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value.toFixed(0)}`;
};

export function RetirementCalculator() {
  const { values, setValue, result } = useRetirementStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              id="currentAge"
              label="Current Age"
              type="number"
              value={values.currentAge.toString()}
              onChange={(value) => setValue("currentAge", Number.parseFloat(value) || 0)}
              min={18}
              max={80}
            />
            <InputField
              id="retirementAge"
              label="Retirement Age"
              type="number"
              value={values.retirementAge.toString()}
              onChange={(value) => setValue("retirementAge", Number.parseFloat(value) || 0)}
              min={50}
              max={100}
            />
            <InputField
              id="lifeExpectancy"
              label="Life Expectancy"
              type="number"
              value={values.lifeExpectancy.toString()}
              onChange={(value) => setValue("lifeExpectancy", Number.parseFloat(value) || 0)}
              min={70}
              max={120}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Savings & Contributions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="currentSavings"
              label="Current Retirement Savings"
              type="number"
              value={values.currentSavings.toString()}
              onChange={(value) => setValue("currentSavings", Number.parseFloat(value) || 0)}
              min={0}
            />
            <InputField
              id="monthlyContribution"
              label="Monthly Contribution"
              type="number"
              value={values.monthlyContribution.toString()}
              onChange={(value) => setValue("monthlyContribution", Number.parseFloat(value) || 0)}
              min={0}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Returns & Income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="expectedReturn"
              label="Expected Annual Return (%)"
              type="number"
              value={values.expectedReturn.toString()}
              onChange={(value) => setValue("expectedReturn", Number.parseFloat(value) || 0)}
              min={0}
              max={20}
            />
            <InputField
              id="inflationRate"
              label="Expected Inflation (%)"
              type="number"
              value={values.inflationRate.toString()}
              onChange={(value) => setValue("inflationRate", Number.parseFloat(value) || 0)}
              min={0}
              max={10}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="desiredAnnualIncome"
              label="Desired Annual Income in Retirement"
              type="number"
              value={values.desiredAnnualIncome.toString()}
              onChange={(value) => setValue("desiredAnnualIncome", Number.parseFloat(value) || 0)}
              min={0}
            />
            <InputField
              id="socialSecurityBenefit"
              label="Expected Social Security (monthly)"
              type="number"
              value={values.socialSecurityBenefit.toString()}
              onChange={(value) => setValue("socialSecurityBenefit", Number.parseFloat(value) || 0)}
              min={0}
            />
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Retirement Projection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(result.retirementSavings)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Projected Savings at Retirement
                </p>
              </div>

              {result.hasSufficientFunds ? (
                <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg text-center">
                  You&apos;re on track for a comfortable retirement!
                </div>
              ) : (
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-center">
                  Consider increasing contributions. Gap: {formatCurrency(result.savingsGap)}
                </div>
              )}

              <ResultGrid
                results={[
                  { label: "Total Contributions", value: formatCurrency(result.totalContributions) },
                  { label: "Total Growth", value: formatCurrency(result.totalGrowth) },
                  {
                    label: "Inflation-Adjusted Value",
                    value: formatCurrency(result.inflationAdjustedSavings),
                  },
                  { label: "Years in Retirement", value: result.yearsInRetirement },
                  {
                    label: "Monthly Retirement Income",
                    value: formatCurrency(result.monthlyRetirementIncome),
                  },
                ]}
                columns={2}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Savings Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.projections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" tickFormatter={(v) => `Age ${v}`} />
                    <YAxis tickFormatter={(value) => formatCompact(value)} />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      labelFormatter={(label) => `Age ${label}`}
                    />
                    <ReferenceLine
                      x={values.retirementAge}
                      stroke="hsl(var(--destructive))"
                      strokeDasharray="3 3"
                      label={{ value: "Retirement", position: "top" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="savings"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      name="Total Savings"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accumulation Phase Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Age</th>
                      <th className="text-right py-2 px-2">Contributions</th>
                      <th className="text-right py-2 px-2">Growth</th>
                      <th className="text-right py-2 px-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.projections
                      .filter((p) => p.phase === "accumulation")
                      .slice(0, 20)
                      .map((row) => (
                        <tr key={row.age} className="border-b">
                          <td className="py-2 px-2">{row.age}</td>
                          <td className="text-right py-2 px-2">
                            {formatCurrency(row.contribution)}
                          </td>
                          <td className="text-right py-2 px-2">{formatCurrency(row.growth)}</td>
                          <td className="text-right py-2 px-2 font-medium">
                            {formatCurrency(row.savings)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {result.projections.filter((p) => p.phase === "accumulation").length > 20 && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Showing first 20 years...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
