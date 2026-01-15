"use client";

import { useTranslations } from "next-intl";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConverter } from "@/hooks";
import {
  type FatIntakeInput,
  type FatIntakeResult,
  calculateFatIntake,
} from "@/lib/converters/health/fat-intake-calculator";

interface FormValues {
  calories: string;
  goal: "weightLoss" | "maintenance" | "muscleGain" | "keto" | "lowFat";
}

export function FatIntakeCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, FatIntakeResult | null>({
    initialValues: {
      calories: "2000",
      goal: "maintenance",
    },
    calculate: (vals) => {
      const input: FatIntakeInput = {
        calories: parseInt(vals.calories) || 0,
        goal: vals.goal,
      };
      return { value: calculateFatIntake(input) };
    },
  });

  const fatResult = result?.value;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="calories"
          label={t("dailyCalories")}
          value={values.calories}
          onChange={(v) => setValue("calories", v)}
          min={1000}
          max={6000}
          step="50"
          placeholder="2000"
        />

        <div className="space-y-2">
          <Label>{t("goal")}</Label>
          <Select
            value={values.goal}
            onValueChange={(v) => setValue("goal", v as typeof values.goal)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weightLoss">{t("weightLoss")}</SelectItem>
              <SelectItem value="maintenance">{t("maintenance")}</SelectItem>
              <SelectItem value="muscleGain">{t("muscleGain")}</SelectItem>
              <SelectItem value="keto">{t("keto")}</SelectItem>
              <SelectItem value="lowFat">{t("lowFat")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {fatResult && (
        <div className="space-y-4">
          <OutputDisplay
            label={tResults("dailyFatIntake")}
            value={Math.round(fatResult.dailyFatGrams)}
            unit="g"
            size="lg"
          />

          <ResultGrid
            results={[
              {
                label: tResults("fatCalories"),
                value: Math.round(fatResult.dailyFatCalories),
                unit: "kcal",
              },
              {
                label: tResults("fatPercent"),
                value: fatResult.fatPercent,
                unit: "%",
              },
              {
                label: tResults("saturatedFatMax"),
                value: Math.round(fatResult.saturatedFatMax),
                unit: "g",
              },
              {
                label: tResults("omega3Min"),
                value: fatResult.omega3Min.toFixed(1),
                unit: "g",
              },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("fatBreakdown")}</h3>
          <ResultGrid
            results={[
              {
                label: tResults("saturatedFat"),
                value: `${Math.round(fatResult.breakdown.saturated.grams)}g (${fatResult.breakdown.saturated.percent}%)`,
              },
              {
                label: tResults("monounsaturatedFat"),
                value: `${Math.round(fatResult.breakdown.monounsaturated.grams)}g (${fatResult.breakdown.monounsaturated.percent}%)`,
              },
              {
                label: tResults("polyunsaturatedFat"),
                value: `${Math.round(fatResult.breakdown.polyunsaturated.grams)}g (${fatResult.breakdown.polyunsaturated.percent}%)`,
              },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("healthyFatSources")}</h3>
          <ul className="list-disc list-inside space-y-1 bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            {fatResult.foodSources.healthy.map((source, index) => (
              <li key={index} className="text-sm text-green-700 dark:text-green-300">{source}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold">{tResults("limitTheseFats")}</h3>
          <ul className="list-disc list-inside space-y-1 bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
            {fatResult.foodSources.limit.map((source, index) => (
              <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300">{source}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold">{tResults("avoidTheseFats")}</h3>
          <ul className="list-disc list-inside space-y-1 bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            {fatResult.foodSources.avoid.map((source, index) => (
              <li key={index} className="text-sm text-red-700 dark:text-red-300">{source}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
