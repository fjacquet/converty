"use client";

import { useTranslations } from "next-intl";
import { InputField, ResultGrid } from "@/components/converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  convertDuration,
  DURATION_UNITS,
  type DurationConverterInput,
  type DurationConverterResult,
  type DurationUnit,
} from "@/lib/converters/datetime/duration-converter";
import { createCalculatorStore } from "@/stores/calculator-store";

const UNIT_OPTIONS = DURATION_UNITS.map((u) => ({
  value: u.id,
  label: u.label,
}));

const useDurationStore = createCalculatorStore<DurationConverterInput, DurationConverterResult>({
  name: "duration-converter",
  initialValues: {
    value: "1",
    unit: "hours",
  },
  calculate: convertDuration,
});

export function DurationConverter() {
  const t = useTranslations("calculator.labels");
  const tSections = useTranslations("calculator.sections");
  const { values, setValue, result } = useDurationStore();

  const formatValue = (val: number): string => {
    if (val === 0) return "0";
    if (Math.abs(val) >= 1000000) return val.toExponential(4);
    if (Math.abs(val) >= 1) return val.toLocaleString(undefined, { maximumFractionDigits: 4 });
    if (Math.abs(val) >= 0.0001) return val.toFixed(6);
    return val.toExponential(4);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{tSections("input")}</CardTitle>
        </CardHeader>
        <CardContent>
          <InputField
            id="value"
            label={t("value")}
            value={values.value}
            onChange={(v) => setValue("value", v)}
            units={UNIT_OPTIONS}
            selectedUnit={values.unit}
            onUnitChange={(u) => setValue("unit", u as DurationUnit)}
            step="any"
          />
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{tSections("results")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{t("humanReadable")}</p>
              <p className="text-2xl font-bold text-primary">{result.humanReadable}</p>
            </div>

            <ResultGrid
              results={[
                { label: t("years"), value: formatValue(result.years), unit: "yr" },
                { label: t("months"), value: formatValue(result.months), unit: "mo" },
                { label: t("weeks"), value: formatValue(result.weeks), unit: "wk" },
                { label: t("days"), value: formatValue(result.days), unit: "d" },
                { label: t("hours"), value: formatValue(result.hours), unit: "h" },
                { label: t("minutes"), value: formatValue(result.minutes), unit: "min" },
                { label: t("seconds"), value: formatValue(result.seconds), unit: "s" },
              ]}
              columns={4}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
