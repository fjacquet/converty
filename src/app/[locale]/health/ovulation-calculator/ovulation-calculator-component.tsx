"use client";

import { useTranslations } from "next-intl";
import { InputField, ResultGrid } from "@/components/converter";
import { Label } from "@/components/ui/label";
import { useConverter } from "@/hooks";
import {
  type OvulationInput,
  type OvulationResult,
  calculateOvulation,
} from "@/lib/converters/health/ovulation-calculator";

interface FormValues {
  lastPeriodDate: string;
  cycleLength: string;
}

export function OvulationCalculatorComponent() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const today = new Date().toISOString().split("T")[0];

  const { values, setValue, result } = useConverter<FormValues, OvulationResult | null>({
    initialValues: {
      lastPeriodDate: today,
      cycleLength: "28",
    },
    calculate: (vals) => {
      const input: OvulationInput = {
        lastPeriodDate: vals.lastPeriodDate,
        cycleLength: parseInt(vals.cycleLength) || 28,
      };
      return { value: calculateOvulation(input) };
    },
  });

  const ovulationResult = result?.value;

  const getFertilityColor = (fertility: string) => {
    switch (fertility) {
      case "peak":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("lastPeriodDate")}</Label>
          <input
            type="date"
            value={values.lastPeriodDate}
            onChange={(e) => setValue("lastPeriodDate", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <InputField
          id="cycleLength"
          label={t("cycleLength")}
          value={values.cycleLength}
          onChange={(v) => setValue("cycleLength", v)}
          min={21}
          max={40}
          step="1"
          placeholder="28"
        />
      </div>

      {ovulationResult && (
        <div className="space-y-4">
          <ResultGrid
            results={[
              {
                label: tResults("ovulationDate"),
                value: ovulationResult.ovulationDate,
                unit: "",
              },
              {
                label: tResults("fertileWindowStart"),
                value: ovulationResult.fertileWindowStart,
                unit: "",
              },
              {
                label: tResults("fertileWindowEnd"),
                value: ovulationResult.fertileWindowEnd,
                unit: "",
              },
              {
                label: tResults("nextPeriod"),
                value: ovulationResult.nextPeriodDate,
                unit: "",
              },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("fertileWindow")}</h3>
          <div className="space-y-2">
            {ovulationResult.fertileWindow.map((day) => (
              <div
                key={day.date}
                className="flex justify-between items-center p-2 rounded bg-muted"
              >
                <span>{day.date}</span>
                <span>Day {day.dayOfCycle}</span>
                <span className={`px-2 py-1 rounded text-white text-sm ${getFertilityColor(day.fertility)}`}>
                  {day.fertility}
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold">{tResults("upcomingCycles")}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{t("cycle")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{tResults("periodStart")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{tResults("ovulation")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{tResults("fertileWindow")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ovulationResult.upcomingCycles.map((cycle) => (
                  <tr key={cycle.cycleNumber}>
                    <td className="px-3 py-2 text-sm">{cycle.cycleNumber}</td>
                    <td className="px-3 py-2 text-sm">{cycle.periodStart}</td>
                    <td className="px-3 py-2 text-sm font-medium">{cycle.ovulation}</td>
                    <td className="px-3 py-2 text-sm">{cycle.fertileStart} - {cycle.fertileEnd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
