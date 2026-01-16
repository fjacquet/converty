"use client";

import { useTranslations } from "next-intl";
import { InputField, ResultGrid } from "@/components/converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  calculateDayCounter,
  type DayCounterInput,
  type DayCounterResult,
} from "@/lib/converters/datetime/day-counter";
import { createCalculatorStore } from "@/stores/calculator-store";

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
  const t = useTranslations("calculator.labels");
  const tSections = useTranslations("calculator.sections");
  const { values, setValue, result } = useDayCounterStore();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{tSections("input")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="startDate"
              label={t("startDate")}
              type="date"
              value={values.startDate}
              onChange={(value) => setValue("startDate", value)}
            />
            <InputField
              id="endDate"
              label={t("endDate")}
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
            <Label htmlFor="includeEndDate">{t("endDate")}</Label>
          </div>
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
                <p className="text-4xl font-bold text-primary">{result.totalDays}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("days")}</p>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-lg font-medium">{result.formattedDuration}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{tSections("breakdown")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultGrid
                results={[
                  { label: t("days"), value: result.totalDays },
                  { label: "Business Days", value: result.businessDays },
                  { label: "Weekend Days", value: result.weekendDays },
                  { label: t("weeks"), value: result.weeks },
                  { label: t("days"), value: result.remainingDays },
                  { label: t("months"), value: result.months },
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
