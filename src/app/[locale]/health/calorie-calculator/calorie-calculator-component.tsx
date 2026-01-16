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
  type CalorieInput,
  type CalorieResult,
  calculateCalories,
} from "@/lib/converters/health/calorie-calculator";

interface FormValues {
  gender: "male" | "female";
  age: string;
  weight: string;
  height: string;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "veryActive";
  targetWeight: string;
  weeksToGoal: string;
}

export function CalorieCalculatorComponent() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, CalorieResult | null>({
    initialValues: {
      gender: "male",
      age: "30",
      weight: "80",
      height: "175",
      activityLevel: "moderate",
      targetWeight: "75",
      weeksToGoal: "12",
    },
    calculate: (vals) => {
      const input: CalorieInput = {
        gender: vals.gender,
        age: parseFloat(vals.age) || 0,
        weight: parseFloat(vals.weight) || 0,
        height: parseFloat(vals.height) || 0,
        activityLevel: vals.activityLevel,
        targetWeight: parseFloat(vals.targetWeight) || 0,
        weeksToGoal: parseFloat(vals.weeksToGoal) || 0,
      };
      return { value: calculateCalories(input) };
    },
  });

  const calorieResult = result?.value;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("gender")}</Label>
          <Select
            value={values.gender}
            onValueChange={(v) => setValue("gender", v as "male" | "female")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t("male")}</SelectItem>
              <SelectItem value="female">{t("female")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <InputField
          id="age"
          label={t("age")}
          value={values.age}
          onChange={(v) => setValue("age", v)}
          min={0}
          max={120}
          step="1"
          placeholder="30"
        />

        <InputField
          id="weight"
          label={t("weight")}
          value={values.weight}
          onChange={(v) => setValue("weight", v)}
          min={0}
          step="0.1"
          placeholder="80"
        />

        <InputField
          id="height"
          label={t("height")}
          value={values.height}
          onChange={(v) => setValue("height", v)}
          min={0}
          step="0.1"
          placeholder="175"
        />

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
              <SelectItem value="veryActive">{t("veryActive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <InputField
          id="targetWeight"
          label={t("targetWeight")}
          value={values.targetWeight}
          onChange={(v) => setValue("targetWeight", v)}
          min={0}
          step="0.1"
          placeholder="75"
        />

        <InputField
          id="weeksToGoal"
          label={t("weeksToGoal")}
          value={values.weeksToGoal}
          onChange={(v) => setValue("weeksToGoal", v)}
          min={1}
          step="1"
          placeholder="12"
        />
      </div>

      {calorieResult && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <OutputDisplay
              label={tResults("bmr")}
              value={Math.round(calorieResult.bmr)}
              unit={tResults("kcal") + "/day"}
            />
            <OutputDisplay
              label={t("maintenance")}
              value={Math.round(calorieResult.maintenanceCalories)}
              unit={tResults("kcal") + "/day"}
            />
          </div>

          <OutputDisplay
            label={tResults("targetCalories")}
            value={Math.round(calorieResult.targetCalories)}
            unit={tResults("kcal") + "/day"}
            size="lg"
          />

          {!calorieResult.isSafe && (
            <div className="rounded-md bg-destructive/10 p-3 text-destructive">
              Warning: This plan may not be safe. Consider extending your timeline or adjusting your
              goal.
            </div>
          )}

          <h3 className="text-lg font-semibold">Daily Macros</h3>
          <ResultGrid
            results={[
              {
                label: tResults("proteinGrams"),
                value: Math.round(calorieResult.proteinGrams),
                unit: "g",
              },
              {
                label: tResults("carbsGrams"),
                value: Math.round(calorieResult.carbsGrams),
                unit: "g",
              },
              {
                label: tResults("fatGrams"),
                value: Math.round(calorieResult.fatGrams),
                unit: "g",
              },
            ]}
          />

          <ResultGrid
            results={[
              {
                label: "Daily Deficit/Surplus",
                value: Math.round(Math.abs(calorieResult.dailyDeficit)),
                unit: calorieResult.dailyDeficit > 0 ? "kcal deficit" : "kcal surplus",
              },
              {
                label: "Weekly Weight Change",
                value: calorieResult.weeklyWeightChange.toFixed(2),
                unit: "kg/week",
              },
              {
                label: "Projected Date",
                value: calorieResult.projectedDate,
                unit: "",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
