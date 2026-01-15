"use client";

import { createCalculatorStore } from "@/stores/calculator-store";
import {
  calculateLoan,
  type LoanInput,
  type LoanResult,
} from "@/lib/converters/finance/loan";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const useLoanStore = createCalculatorStore<LoanInput, LoanResult>({
  name: "loan-calculator",
  initialValues: {
    loanAmount: 25000,
    interestRate: 8.5,
    loanTerm: 60,
    startDate: new Date().toISOString().split("T")[0],
  },
  calculate: calculateLoan,
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function LoanCalculator() {
  const { values, setValue, result } = useLoanStore();

  const pieData = result
    ? [
        { name: "Principal", value: values.loanAmount },
        { name: "Interest", value: result.totalInterest },
      ]
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="loanAmount"
            label="Loan Amount"
            type="number"
            value={values.loanAmount.toString()}
            onChange={(value) => setValue("loanAmount", Number.parseFloat(value) || 0)}
            min={0}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="interestRate"
              label="Annual Interest Rate (%)"
              type="number"
              value={values.interestRate.toString()}
              onChange={(value) => setValue("interestRate", Number.parseFloat(value) || 0)}
              min={0}
              max={50}
            />
            <InputField
              id="loanTerm"
              label="Loan Term (months)"
              type="number"
              value={values.loanTerm.toString()}
              onChange={(value) => setValue("loanTerm", Number.parseFloat(value) || 0)}
              min={1}
              max={360}
            />
          </div>

          <InputField
            id="startDate"
            label="Start Date"
            type="date"
            value={values.startDate}
            onChange={(value) => setValue("startDate", value)}
          />
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(result.monthlyPayment)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">per month</p>
              </div>

              <ResultGrid
                results={[
                  { label: "Loan Amount", value: formatCurrency(values.loanAmount) },
                  { label: "Total Interest", value: formatCurrency(result.totalInterest) },
                  { label: "Total Payment", value: formatCurrency(result.totalPayment) },
                  { label: "Payoff Date", value: result.payoffDate },
                  { label: "Effective Rate", value: `${result.effectiveRate.toFixed(2)}%` },
                ]}
                columns={2}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Principal vs Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      <Cell fill="hsl(var(--primary))" />
                      <Cell fill="hsl(var(--destructive))" />
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
              <CardTitle className="text-lg">Balance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.yearlyTotals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      name="Remaining Balance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Yearly Principal vs Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.yearlyTotals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
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
                      fillOpacity={0.6}
                      name="Principal"
                    />
                    <Area
                      type="monotone"
                      dataKey="interest"
                      stackId="1"
                      stroke="hsl(var(--destructive))"
                      fill="hsl(var(--destructive))"
                      fillOpacity={0.6}
                      name="Interest"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
