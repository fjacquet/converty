"use client";

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
import { calculateDate, type DateInput, type DateResult } from "@/lib/converters/datetime/date";
import { createCalculatorStore } from "@/stores/calculator-store";

const useDateStore = createCalculatorStore<DateInput, DateResult>({
  name: "date-calculator",
  initialValues: {
    startDate: "",
    operation: "add",
    years: "0",
    months: "0",
    weeks: "0",
    days: "0",
  },
  calculate: calculateDate,
});

export function DateCalculator() {
  const { values, setValue, result } = useDateStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Start Date</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="startDate"
            label="Start Date"
            type="date"
            value={values.startDate}
            onChange={(value) => setValue("startDate", value)}
          />

          <div className="space-y-2">
            <Label>Operation</Label>
            <Select
              value={values.operation}
              onValueChange={(value) => setValue("operation", value as "add" | "subtract")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add</SelectItem>
                <SelectItem value="subtract">Subtract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Duration to {values.operation === "add" ? "Add" : "Subtract"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InputField
              id="years"
              label="Years"
              type="number"
              value={values.years}
              onChange={(value) => setValue("years", value)}
              min={0}
            />
            <InputField
              id="months"
              label="Months"
              type="number"
              value={values.months}
              onChange={(value) => setValue("months", value)}
              min={0}
            />
            <InputField
              id="weeks"
              label="Weeks"
              type="number"
              value={values.weeks}
              onChange={(value) => setValue("weeks", value)}
              min={0}
            />
            <InputField
              id="days"
              label="Days"
              type="number"
              value={values.days}
              onChange={(value) => setValue("days", value)}
              min={0}
            />
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">{result.formattedDate}</p>
            </div>
            <ResultGrid
              results={[
                { label: "Day of Week", value: result.dayOfWeek },
                { label: "Days Difference", value: result.daysFromStart },
                { label: "ISO Date", value: result.resultDate.toISOString().split("T")[0] },
              ]}
              columns={3}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
