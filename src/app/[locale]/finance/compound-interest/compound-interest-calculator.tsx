"use client";

import { createCalculatorStore } from "@/stores/calculator-store";
import {
  calculateCompoundInterest,
  COMPOUND_FREQUENCIES,
  type CompoundInterestInput,
  type CompoundInterestResult,
  type CompoundFrequency,
} from "@/lib/converters/finance/compound-interest";
import { InputField, ResultGrid } from "@/components/converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const useCompoundInterestStore = createCalculatorStore<CompoundInterestInput, CompoundInterestResult>({
  name: "compound-interest-calculator",
  initialValues: {
    principal: 10000,
    interestRate: 7,
    years: 10,
    compoundFrequency: "monthly" as CompoundFrequency,
    monthlyContribution: 500,
    contributionTiming: "end" as const,
  },
  calculate: calculateCompoundInterest,
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function CompoundInterestCalculator() {
  const { values, setValue, result } = useCompoundInterestStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Investment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="principal"
              label="Initial Investment"
              type="number"
              value={values.principal.toString()}
              onChange={(value) => setValue("principal", Number.parseFloat(value) || 0)}
              min={0}
            />
            <InputField
              id="interestRate"
              label="Annual Interest Rate (%)"
              type="number"
              value={values.interestRate.toString()}
              onChange={(value) => setValue("interestRate", Number.parseFloat(value) || 0)}
              min={0}
              max={100}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="years"
              label="Investment Period (years)"
              type="number"
              value={values.years.toString()}
              onChange={(value) => setValue("years", Number.parseFloat(value) || 0)}
              min={1}
              max={100}
            />
            <div className="space-y-2">
              <Label>Compound Frequency</Label>
              <Select
                value={values.compoundFrequency}
                onValueChange={(value) => setValue("compoundFrequency", value as CompoundFrequency)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPOUND_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regular Contributions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="monthlyContribution"
              label="Monthly Contribution"
              type="number"
              value={values.monthlyContribution.toString()}
              onChange={(value) => setValue("monthlyContribution", Number.parseFloat(value) || 0)}
              min={0}
            />
            <div className="space-y-2">
              <Label>Contribution Timing</Label>
              <Select
                value={values.contributionTiming}
                onValueChange={(value) =>
                  setValue("contributionTiming", value as "beginning" | "end")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginning">Beginning of Month</SelectItem>
                  <SelectItem value="end">End of Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(result.finalBalance)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Final Balance</p>
              </div>

              <ResultGrid
                results={[
                  { label: "Initial Investment", value: formatCurrency(result.totalPrincipal) },
                  { label: "Total Contributions", value: formatCurrency(result.totalContributions) },
                  { label: "Total Interest Earned", value: formatCurrency(result.totalInterest) },
                  { label: "Effective Annual Rate", value: `${result.effectiveAnnualRate.toFixed(2)}%` },
                ]}
                columns={2}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.yearlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tickFormatter={(v) => `Year ${v}`} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="principal"
                      stackId="1"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.8}
                      name="Initial Investment"
                    />
                    <Area
                      type="monotone"
                      dataKey="contributions"
                      stackId="1"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.6}
                      name="Contributions"
                    />
                    <Area
                      type="monotone"
                      dataKey="interest"
                      stackId="1"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      fillOpacity={0.6}
                      name="Interest"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Balance Growth by Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.yearlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tickFormatter={(v) => `Y${v}`} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Bar dataKey="balance" fill="hsl(var(--primary))" name="Balance" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Year-by-Year Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Year</th>
                      <th className="text-right py-2 px-2">Contributions</th>
                      <th className="text-right py-2 px-2">Interest</th>
                      <th className="text-right py-2 px-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="border-b">
                        <td className="py-2 px-2">{row.year}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(row.contributions)}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(row.interest)}</td>
                        <td className="text-right py-2 px-2 font-medium">
                          {formatCurrency(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
