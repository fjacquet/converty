"use client";

import {
  Area,
  AreaChart,
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
import {
  calculateMortgage,
  type MortgageInput,
  type MortgageResult,
} from "@/lib/converters/finance/mortgage";
import { createCalculatorStore } from "@/stores/calculator-store";

const useMortgageStore = createCalculatorStore<MortgageInput, MortgageResult>({
  name: "mortgage-calculator",
  initialValues: {
    homePrice: 400000,
    downPayment: 80000,
    downPaymentPercent: 20,
    loanTerm: 30,
    interestRate: 6.5,
    propertyTax: 4800,
    homeInsurance: 1200,
    pmi: 0,
    hoaFees: 0,
    startDate: new Date().toISOString().split("T")[0],
  },
  calculate: calculateMortgage,
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"];

export function MortgageCalculator() {
  const { values, setValue, result } = useMortgageStore();

  const handleDownPaymentChange = (value: string) => {
    const amount = Number.parseFloat(value) || 0;
    setValue("downPayment", amount);
    if (values.homePrice > 0) {
      setValue("downPaymentPercent", (amount / values.homePrice) * 100);
    }
  };

  const handleDownPaymentPercentChange = (value: string) => {
    const percent = Number.parseFloat(value) || 0;
    setValue("downPaymentPercent", percent);
    setValue("downPayment", (percent / 100) * values.homePrice);
  };

  const handleHomePriceChange = (value: string) => {
    const price = Number.parseFloat(value) || 0;
    setValue("homePrice", price);
    setValue("downPayment", (values.downPaymentPercent / 100) * price);
  };

  const pieData = result
    ? [
        { name: "Principal", value: result.loanAmount },
        { name: "Interest", value: result.totalInterest },
      ]
    : [];

  const monthlyPieData = result
    ? [
        { name: "Principal & Interest", value: result.monthlyPrincipalInterest },
        { name: "Property Tax", value: result.monthlyPropertyTax },
        { name: "Insurance", value: result.monthlyInsurance },
        ...(result.monthlyPmi > 0 ? [{ name: "PMI", value: result.monthlyPmi }] : []),
        ...(result.monthlyHoa > 0 ? [{ name: "HOA", value: result.monthlyHoa }] : []),
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
            id="homePrice"
            label="Home Price"
            type="number"
            value={values.homePrice.toString()}
            onChange={handleHomePriceChange}
            min={0}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="downPayment"
              label="Down Payment ($)"
              type="number"
              value={values.downPayment.toString()}
              onChange={handleDownPaymentChange}
              min={0}
            />
            <InputField
              id="downPaymentPercent"
              label="Down Payment (%)"
              type="number"
              value={values.downPaymentPercent.toFixed(1)}
              onChange={handleDownPaymentPercentChange}
              min={0}
              max={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="loanTerm"
              label="Loan Term (years)"
              type="number"
              value={values.loanTerm.toString()}
              onChange={(value) => setValue("loanTerm", Number.parseFloat(value) || 0)}
              min={1}
              max={50}
            />
            <InputField
              id="interestRate"
              label="Interest Rate (%)"
              type="number"
              value={values.interestRate.toString()}
              onChange={(value) => setValue("interestRate", Number.parseFloat(value) || 0)}
              min={0}
              max={30}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Costs (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="propertyTax"
              label="Property Tax (annual)"
              type="number"
              value={values.propertyTax.toString()}
              onChange={(value) => setValue("propertyTax", Number.parseFloat(value) || 0)}
              min={0}
            />
            <InputField
              id="homeInsurance"
              label="Home Insurance (annual)"
              type="number"
              value={values.homeInsurance.toString()}
              onChange={(value) => setValue("homeInsurance", Number.parseFloat(value) || 0)}
              min={0}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="pmi"
              label="PMI (monthly)"
              type="number"
              value={values.pmi.toString()}
              onChange={(value) => setValue("pmi", Number.parseFloat(value) || 0)}
              min={0}
            />
            <InputField
              id="hoaFees"
              label="HOA Fees (monthly)"
              type="number"
              value={values.hoaFees.toString()}
              onChange={(value) => setValue("hoaFees", Number.parseFloat(value) || 0)}
              min={0}
            />
          </div>
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
                  {formatCurrency(result.totalMonthlyPayment)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">per month</p>
              </div>

              <ResultGrid
                results={[
                  {
                    label: "Principal & Interest",
                    value: formatCurrency(result.monthlyPrincipalInterest),
                  },
                  { label: "Property Tax", value: formatCurrency(result.monthlyPropertyTax) },
                  { label: "Insurance", value: formatCurrency(result.monthlyInsurance) },
                  ...(result.monthlyPmi > 0
                    ? [{ label: "PMI", value: formatCurrency(result.monthlyPmi) }]
                    : []),
                  ...(result.monthlyHoa > 0
                    ? [{ label: "HOA Fees", value: formatCurrency(result.monthlyHoa) }]
                    : []),
                ]}
                columns={2}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monthlyPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {monthlyPieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultGrid
                results={[
                  { label: "Loan Amount", value: formatCurrency(result.loanAmount) },
                  { label: "Total Interest", value: formatCurrency(result.totalInterest) },
                  { label: "Total Payments", value: formatCurrency(result.totalPayments) },
                  { label: "Total Cost", value: formatCurrency(result.totalCost) },
                  { label: "Payoff Date", value: result.payoffDate },
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
                  <AreaChart data={result.yearlyBreakdown}>
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
                  <AreaChart data={result.yearlyBreakdown}>
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
