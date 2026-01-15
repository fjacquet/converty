"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  calculateSalary,
  FILING_STATUSES,
  type FilingStatus,
  PAY_FREQUENCIES,
  type PayFrequency,
  type SalaryInput,
  type SalaryResult,
  US_STATES,
} from "@/lib/converters/finance/salary";
import { createCalculatorStore } from "@/stores/calculator-store";

const useSalaryStore = createCalculatorStore<SalaryInput, SalaryResult>({
  name: "salary-calculator",
  initialValues: {
    salary: 75000,
    payFrequency: "annual" as PayFrequency,
    hoursPerWeek: 40,
    filingStatus: "single" as FilingStatus,
    stateCode: "CA",
    preTaxDeductions: 500,
    postTaxDeductions: 0,
  },
  calculate: calculateSalary,
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export function SalaryCalculator() {
  const { values, setValue, result } = useSalaryStore();

  const taxPieData = result
    ? [
        { name: "Take Home", value: result.netAnnual },
        { name: "Federal Tax", value: result.federalTax },
        { name: "State Tax", value: result.stateTax },
        { name: "FICA", value: result.socialSecurity + result.medicare },
      ]
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Income Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="salary"
              label="Salary Amount"
              type="number"
              value={values.salary.toString()}
              onChange={(value) => setValue("salary", Number.parseFloat(value) || 0)}
              min={0}
            />
            <div className="space-y-2">
              <Label>Pay Frequency</Label>
              <Select
                value={values.payFrequency}
                onValueChange={(value) => setValue("payFrequency", value as PayFrequency)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAY_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {values.payFrequency === "hourly" && (
            <InputField
              id="hoursPerWeek"
              label="Hours Per Week"
              type="number"
              value={values.hoursPerWeek.toString()}
              onChange={(value) => setValue("hoursPerWeek", Number.parseFloat(value) || 0)}
              min={1}
              max={80}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tax Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Filing Status</Label>
              <Select
                value={values.filingStatus}
                onValueChange={(value) => setValue("filingStatus", value as FilingStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILING_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Select
                value={values.stateCode}
                onValueChange={(value) => setValue("stateCode", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
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
          <CardTitle className="text-lg">Deductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="preTaxDeductions"
              label="Pre-Tax Deductions (monthly)"
              type="number"
              value={values.preTaxDeductions.toString()}
              onChange={(value) => setValue("preTaxDeductions", Number.parseFloat(value) || 0)}
              min={0}
            />
            <InputField
              id="postTaxDeductions"
              label="Post-Tax Deductions (monthly)"
              type="number"
              value={values.postTaxDeductions.toString()}
              onChange={(value) => setValue("postTaxDeductions", Number.parseFloat(value) || 0)}
              min={0}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Pre-tax deductions include 401(k), HSA, FSA contributions. Post-tax deductions include
            Roth 401(k), life insurance, etc.
          </p>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Take-Home Pay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(result.netMonthly)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">per month</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-lg font-semibold">{formatCurrency(result.netAnnual)}</p>
                  <p className="text-xs text-muted-foreground">Annual</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-lg font-semibold">{formatCurrency(result.netMonthly)}</p>
                  <p className="text-xs text-muted-foreground">Monthly</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-lg font-semibold">{formatCurrency(result.netBiweekly)}</p>
                  <p className="text-xs text-muted-foreground">Bi-weekly</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-lg font-semibold">{formatCurrency(result.netWeekly)}</p>
                  <p className="text-xs text-muted-foreground">Weekly</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Income Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taxPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {taxPieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tax Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.taxBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="category" width={150} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultGrid
                results={[
                  { label: "Gross Annual", value: formatCurrency(result.grossAnnual) },
                  { label: "Taxable Income", value: formatCurrency(result.taxableIncome) },
                  { label: "Total Tax", value: formatCurrency(result.totalTax) },
                  { label: "Net Annual", value: formatCurrency(result.netAnnual) },
                  { label: "Effective Tax Rate", value: `${result.effectiveTaxRate.toFixed(1)}%` },
                  { label: "Marginal Tax Rate", value: `${result.marginalTaxRate.toFixed(0)}%` },
                ]}
                columns={3}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
