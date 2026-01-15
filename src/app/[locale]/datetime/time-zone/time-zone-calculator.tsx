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
import {
  calculateTimeZone,
  TIMEZONES,
  type TimeZoneInput,
  type TimeZoneResult,
} from "@/lib/converters/datetime/time-zone";
import { createCalculatorStore } from "@/stores/calculator-store";

const useTimeZoneStore = createCalculatorStore<TimeZoneInput, TimeZoneResult>({
  name: "time-zone-calculator",
  initialValues: {
    dateTime: "",
    fromTimezone: "America/New_York",
    toTimezone: "Europe/London",
  },
  calculate: calculateTimeZone,
});

export function TimeZoneCalculator() {
  const { values, setValue, result } = useTimeZoneStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="dateTime"
            label="Date & Time"
            type="datetime-local"
            value={values.dateTime}
            onChange={(value) => setValue("dateTime", value)}
          />

          <div className="space-y-2">
            <Label>From Time Zone</Label>
            <Select
              value={values.fromTimezone}
              onValueChange={(value) => setValue("fromTimezone", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Destination</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>To Time Zone</Label>
            <Select
              value={values.toTimezone}
              onValueChange={(value) => setValue("toTimezone", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Converted Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">{result.formattedTime}</p>
              <p className="text-sm text-muted-foreground mt-1">{result.formattedDate}</p>
            </div>
            <ResultGrid
              results={[
                { label: "Time Zone Offset", value: result.offset },
                { label: "ISO Date", value: result.convertedDateTime.toISOString().split("T")[0] },
              ]}
              columns={2}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
