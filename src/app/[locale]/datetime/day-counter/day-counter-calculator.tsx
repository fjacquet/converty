"use client";

import { createCalculatorStore } from "@/stores/calculator-store";
import { calculateDayCounter, type DayCounterInput, type DayCounterResult } from "@/lib/converters/datetime/day-counter";
import { InputField, ResultGrid } from "@/components/converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const useDayCounterStore = createCalculatorStore<DayCounterInput, DayCounterResult>({
  name: "day-counter-calculator",
  initialValues: {
    startDate: "",
    endDate: "",
    includeEndDate: true,
  },
  calculate: calculateDayCounter,
});

export function DayCounterCalculator() {
  const { values, setValue, result } = useDayCounterStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Date Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="startDate"
              label="Start Date"
              type="date"
              value={values.startDate}
              onChange={(value) => setValue("startDate", value)}
            />
            <InputField
              id="endDate"
              label="End Date"
              type="date"
              value={values.endDate}
              onChange={(value) => setValue("endDate", value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="includeEndDate"
              checked={values.includeEndDate}
              onCheckedChange={(checked) => setValue("includeEndDate", checked)}
            />
            <Label htmlFor="includeEndDate">Include end date in count</Label>
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
                <p className="text-4xl font-bold text-primary">{result.totalDays}</p>
                <p className="text-sm text-muted-foreground mt-1">total days</p>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-lg font-medium">{result.formattedDuration}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultGrid
                results={[
                  { label: "Total Days", value: result.totalDays },
                  { label: "Business Days", value: result.businessDays },
                  { label: "Weekend Days", value: result.weekendDays },
                  { label: "Full Weeks", value: result.weeks },
                  { label: "Remaining Days", value: result.remainingDays },
                  { label: "Approx. Months", value: result.months },
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
