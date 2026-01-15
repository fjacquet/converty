"use client";

import { createCalculatorStore } from "@/stores/calculator-store";
import { calculateTime, type TimeInput, type TimeResult } from "@/lib/converters/datetime/time";
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

const useTimeStore = createCalculatorStore<TimeInput, TimeResult>({
  name: "time-calculator",
  initialValues: {
    startTime: "",
    operation: "add",
    hours: "0",
    minutes: "0",
    seconds: "0",
  },
  calculate: calculateTime,
});

export function TimeCalculator() {
  const { values, setValue, result } = useTimeStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Start Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="startTime"
            label="Start Time"
            type="time"
            value={values.startTime}
            onChange={(value) => setValue("startTime", value)}
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
          <CardTitle className="text-lg">Duration to {values.operation === "add" ? "Add" : "Subtract"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <InputField
              id="hours"
              label="Hours"
              type="number"
              value={values.hours}
              onChange={(value) => setValue("hours", value)}
              min={0}
            />
            <InputField
              id="minutes"
              label="Minutes"
              type="number"
              value={values.minutes}
              onChange={(value) => setValue("minutes", value)}
              min={0}
            />
            <InputField
              id="seconds"
              label="Seconds"
              type="number"
              value={values.seconds}
              onChange={(value) => setValue("seconds", value)}
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
              <p className="text-3xl font-bold text-primary">{result.formatted12h}</p>
              <p className="text-sm text-muted-foreground mt-1">{result.formatted24h} (24h)</p>
            </div>
            {result.crossesMidnight && (
              <div className="text-center p-2 bg-yellow-500/10 rounded-lg">
                <p className="text-sm font-medium">
                  {result.dayChange > 0 ? `+${result.dayChange} day(s)` : `${result.dayChange} day(s)`}
                </p>
              </div>
            )}
            <ResultGrid
              results={[
                { label: "24-Hour Format", value: result.formatted24h },
                { label: "12-Hour Format", value: result.formatted12h },
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
