"use client";

import { useTranslations } from "next-intl";
import { InputField, ResultGrid } from "@/components/converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateDayOfWeek,
  type DayOfWeekInput,
  type DayOfWeekResult,
} from "@/lib/converters/datetime/day-of-week";
import { createCalculatorStore } from "@/stores/calculator-store";

const useDayOfWeekStore = createCalculatorStore<DayOfWeekInput, DayOfWeekResult>({
  name: "day-of-week-calculator",
  initialValues: {
    date: "",
  },
  calculate: calculateDayOfWeek,
});

export function DayOfWeekCalculator() {
  const t = useTranslations("calculator.labels");
  const tSections = useTranslations("calculator.sections");
  const { values, setValue, result } = useDayOfWeekStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("date")}</CardTitle>
        </CardHeader>
        <CardContent>
          <InputField
            id="date"
            label={t("date")}
            type="date"
            value={values.date}
            onChange={(value) => setValue("date", value)}
          />
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{tSections("results")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-3xl font-bold text-primary">{result.dayOfWeek}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.isWeekend ? "Weekend" : "Weekday"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{tSections("details")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultGrid
                results={[
                  { label: "Day Number", value: `${result.dayNumber} (0=Sun, 6=Sat)` },
                  { label: t("weeks"), value: result.weekNumber },
                  { label: "Day of Year", value: result.dayOfYear },
                  { label: `${t("days")} Left in Year`, value: result.daysLeftInYear },
                  { label: "Quarter", value: `Q${result.quarter}` },
                  { label: "Type", value: result.isWeekend ? "Weekend" : "Weekday" },
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
