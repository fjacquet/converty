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
  type CarbInput,
  type CarbResult,
  calculateCarbs,
} from "@/lib/converters/health/carb-calculator";

interface FormValues {
  calories: string;
  goal: "weightLoss" | "maintenance" | "muscleGain" | "keto" | "lowCarb" | "athlete";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "athlete";
}

export function CarbCalculatorComponent() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, CarbResult | null>({
    initialValues: {
      calories: "2000",
      goal: "maintenance",
      activityLevel: "moderate",
    },
    calculate: (vals) => {
      const input: CarbInput = {
        calories: parseInt(vals.calories) || 0,
        goal: vals.goal,
        activityLevel: vals.activityLevel,
      };
      return { value: calculateCarbs(input) };
    },
  });

  const carbResult = result?.value;

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
              <SelectItem value="lowCarb">{t("lowCarb")}</SelectItem>
              <SelectItem value="athlete">{t("athlete")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("activityLevel")}</Label>
          <Select
            value={values.activityLevel}
            onValueChange={(v) => setValue("activityLevel", v as typeof values.activityLevel)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">{t("sedentary")}</SelectItem>
              <SelectItem value="light">{t("light")}</SelectItem>
              <SelectItem value="moderate">{t("moderate")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="athlete">{t("athlete")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {carbResult && (
        <div className="space-y-4">
          <OutputDisplay
            label={tResults("dailyCarbIntake")}
            value={Math.round(carbResult.dailyCarbGrams)}
            unit="g"
            size="lg"
          />

          <ResultGrid
            results={[
              {
                label: tResults("carbCalories"),
                value: Math.round(carbResult.dailyCarbCalories),
                unit: "kcal",
              },
              {
                label: tResults("carbPercent"),
                value: carbResult.carbPercent,
                unit: "%",
              },
              {
                label: tResults("fiberMin"),
                value: Math.round(carbResult.fiberMin),
                unit: "g",
              },
              {
                label: tResults("sugarMax"),
                value: Math.round(carbResult.sugarMax),
                unit: "g",
              },
              {
                label: tResults("netCarbs"),
                value: Math.round(carbResult.netCarbs),
                unit: "g",
              },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("carbTiming")}</h3>
          <ResultGrid
            results={[
              {
                label: tResults("preworkout"),
                value: Math.round(carbResult.timing.preworkout),
                unit: "g",
              },
              {
                label: tResults("postworkout"),
                value: Math.round(carbResult.timing.postworkout),
                unit: "g",
              },
              {
                label: tResults("otherMeals"),
                value: Math.round(carbResult.timing.other),
                unit: "g",
              },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("carbTypeBreakdown")}</h3>
          <ResultGrid
            results={[
              {
                label: tResults("complexCarbs"),
                value: `${Math.round(carbResult.carbTypes.complex.grams)}g (${carbResult.carbTypes.complex.percent}%)`,
              },
              {
                label: tResults("simpleCarbs"),
                value: `${Math.round(carbResult.carbTypes.simple.grams)}g (${carbResult.carbTypes.simple.percent}%)`,
              },
              {
                label: tResults("fiber"),
                value: `${Math.round(carbResult.carbTypes.fiber.grams)}g (${carbResult.carbTypes.fiber.percent}%)`,
              },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("complexCarbSources")}</h3>
          <ul className="list-disc list-inside space-y-1 bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            {carbResult.foodSources.complex.map((source, index) => (
              <li key={index} className="text-sm text-green-700 dark:text-green-300">{source}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold">{tResults("simpleCarbSources")}</h3>
          <ul className="list-disc list-inside space-y-1 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            {carbResult.foodSources.simple.map((source, index) => (
              <li key={index} className="text-sm text-blue-700 dark:text-blue-300">{source}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold">{tResults("avoidTheseCarbs")}</h3>
          <ul className="list-disc list-inside space-y-1 bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            {carbResult.foodSources.avoid.map((source, index) => (
              <li key={index} className="text-sm text-red-700 dark:text-red-300">{source}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
