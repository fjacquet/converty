"use client";

import { useTranslations } from "next-intl";
import { InputField, ResultGrid } from "@/components/converter";
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
  type MacroInput,
  type MacroResult,
  calculateMacros,
} from "@/lib/converters/health/macro-calculator";

interface FormValues {
  calories: string;
  goal: "maintenance" | "cutting" | "bulking" | "keto" | "highProtein";
}

export function MacroCalculatorComponent() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, MacroResult | null>({
    initialValues: {
      calories: "2000",
      goal: "maintenance",
    },
    calculate: (vals) => {
      const input: MacroInput = {
        calories: parseFloat(vals.calories) || 0,
        goal: vals.goal,
      };
      return { value: calculateMacros(input) };
    },
  });

  const macroResult = result?.value;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="calories"
          label={t("dailyCalories")}
          value={values.calories}
          onChange={(v) => setValue("calories", v)}
          min={0}
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
              <SelectItem value="maintenance">{t("maintenance")}</SelectItem>
              <SelectItem value="cutting">{t("cutting")}</SelectItem>
              <SelectItem value="bulking">{t("bulking")}</SelectItem>
              <SelectItem value="keto">{t("keto")}</SelectItem>
              <SelectItem value="highProtein">{t("highProtein")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {macroResult && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{tResults("dailyMacros")}</h3>
          <ResultGrid
            results={[
              {
                label: tResults("protein"),
                value: Math.round(macroResult.proteinGrams),
                unit: `g (${macroResult.proteinPercent}%)`,
              },
              {
                label: tResults("carbohydrates"),
                value: Math.round(macroResult.carbsGrams),
                unit: `g (${macroResult.carbsPercent}%)`,
              },
              {
                label: tResults("fat"),
                value: Math.round(macroResult.fatGrams),
                unit: `g (${macroResult.fatPercent}%)`,
              },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("caloriesFromMacros")}</h3>
          <ResultGrid
            results={[
              {
                label: tResults("proteinCalories"),
                value: Math.round(macroResult.proteinCalories),
                unit: "kcal",
              },
              {
                label: tResults("carbsCalories"),
                value: Math.round(macroResult.carbsCalories),
                unit: "kcal",
              },
              {
                label: tResults("fatCalories"),
                value: Math.round(macroResult.fatCalories),
                unit: "kcal",
              },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("perMealBreakdown")}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{t("meals")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{tResults("protein")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{tResults("carbs")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{tResults("fat")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {macroResult.mealsBreakdown.map((meal) => (
                  <tr key={meal.meals}>
                    <td className="px-3 py-2 text-sm">{meal.meals} {t("mealsPerDay")}</td>
                    <td className="px-3 py-2 text-sm">{Math.round(meal.protein)}g</td>
                    <td className="px-3 py-2 text-sm">{Math.round(meal.carbs)}g</td>
                    <td className="px-3 py-2 text-sm">{Math.round(meal.fat)}g</td>
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
