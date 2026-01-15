"use client";

import { InputField, ResultGrid } from "@/components/converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateHours, type HoursInput, type HoursResult } from "@/lib/converters/datetime/hours";
import { createCalculatorStore } from "@/stores/calculator-store";

const useHoursStore = createCalculatorStore<HoursInput, HoursResult>({
  name: "hours-calculator",
  initialValues: {
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
  },
  calculate: calculateHours,
});

export function HoursCalculator() {
  const { values, setValue, result } = useHoursStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="startDate"
              label="Start Date (optional)"
              type="date"
              value={values.startDate ?? ""}
              onChange={(value) => setValue("startDate", value)}
              helperText="Leave empty for same-day calculation"
            />
            <InputField
              id="startTime"
              label="Start Time"
              type="time"
              value={values.startTime}
              onChange={(value) => setValue("startTime", value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">End</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="endDate"
              label="End Date (optional)"
              type="date"
              value={values.endDate ?? ""}
              onChange={(value) => setValue("endDate", value)}
              helperText="Leave empty for same-day calculation"
            />
            <InputField
              id="endTime"
              label="End Time"
              type="time"
              value={values.endTime}
              onChange={(value) => setValue("endTime", value)}
            />
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-3xl font-bold text-primary">{result.formattedDuration}</p>
              <p className="text-sm text-muted-foreground mt-1">{result.totalHours} total hours</p>
            </div>
            <ResultGrid
              results={[
                { label: "Hours", value: result.hours },
                { label: "Minutes", value: result.minutes },
                { label: "Seconds", value: result.seconds },
                { label: "Total Hours", value: result.totalHours },
                { label: "Total Minutes", value: result.totalMinutes.toLocaleString() },
                { label: "Total Seconds", value: result.totalSeconds.toLocaleString() },
              ]}
              columns={3}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
