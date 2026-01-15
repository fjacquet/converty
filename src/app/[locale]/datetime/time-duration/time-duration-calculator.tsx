"use client";

import { InputField, ResultGrid } from "@/components/converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateTimeDuration,
  type TimeDurationInput,
  type TimeDurationResult,
} from "@/lib/converters/datetime/time-duration";
import { createCalculatorStore } from "@/stores/calculator-store";

const useTimeDurationStore = createCalculatorStore<TimeDurationInput, TimeDurationResult>({
  name: "time-duration-calculator",
  initialValues: {
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  },
  calculate: calculateTimeDuration,
});

export function TimeDurationCalculator() {
  const { values, setValue, result } = useTimeDurationStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Start Date & Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="startDate"
              label="Start Date"
              type="date"
              value={values.startDate}
              onChange={(value) => setValue("startDate", value)}
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
          <CardTitle className="text-lg">End Date & Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="endDate"
              label="End Date"
              type="date"
              value={values.endDate}
              onChange={(value) => setValue("endDate", value)}
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
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-xl font-bold text-primary">{result.formattedDuration}</p>
              </div>
              <ResultGrid
                results={[
                  { label: "Years", value: result.years },
                  { label: "Months", value: result.months },
                  { label: "Days", value: result.days },
                  { label: "Hours", value: result.hours },
                  { label: "Minutes", value: result.minutes },
                  { label: "Seconds", value: result.seconds },
                ]}
                columns={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Totals</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultGrid
                results={[
                  { label: "Total Days", value: result.totalDays.toLocaleString() },
                  { label: "Total Hours", value: result.totalHours.toLocaleString() },
                  { label: "Total Minutes", value: result.totalMinutes.toLocaleString() },
                  { label: "Total Seconds", value: result.totalSeconds.toLocaleString() },
                ]}
                columns={2}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
