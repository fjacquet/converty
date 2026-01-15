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
  type HealthyWeightInput,
  type HealthyWeightResult,
  calculateHealthyWeight,
} from "@/lib/converters/health/healthy-weight-calculator";

interface FormValues {
  height: string;
  age: string;
  gender: "male" | "female";
  frameSize: "small" | "medium" | "large";
}

export function HealthyWeightCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, HealthyWeightResult | null>({
    initialValues: {
      height: "170",
      age: "30",
      gender: "male",
      frameSize: "medium",
    },
    calculate: (vals) => {
      const input: HealthyWeightInput = {
        height: parseFloat(vals.height) || 0,
        age: parseInt(vals.age) || 0,
        gender: vals.gender,
        frameSize: vals.frameSize,
      };
      return { value: calculateHealthyWeight(input) };
    },
  });

  const weightResult = result?.value;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="height"
          label={t("height")}
          value={values.height}
          onChange={(v) => setValue("height", v)}
          min={100}
          max={250}
          step="1"
          placeholder="170"
        />

        <InputField
          id="age"
          label={t("age")}
          value={values.age}
          onChange={(v) => setValue("age", v)}
          min={1}
          max={120}
          step="1"
          placeholder="30"
        />

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

        <div className="space-y-2">
          <Label>{t("frameSize")}</Label>
          <Select
            value={values.frameSize}
            onValueChange={(v) => setValue("frameSize", v as "small" | "medium" | "large")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">{t("small")}</SelectItem>
              <SelectItem value="medium">{t("medium")}</SelectItem>
              <SelectItem value="large">{t("large")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {weightResult && (
        <div className="space-y-4">
          <OutputDisplay
            label={tResults("idealWeight")}
            value={weightResult.idealWeight.toFixed(1)}
            unit="kg"
            size="lg"
          />

          <ResultGrid
            results={[
              {
                label: tResults("healthyRange"),
                value: `${weightResult.adjustedRange.min.toFixed(1)} - ${weightResult.adjustedRange.max.toFixed(1)}`,
                unit: "kg",
              },
              {
                label: tResults("bmiBasedRange"),
                value: `${weightResult.bmiBasedRange.min.toFixed(1)} - ${weightResult.bmiBasedRange.max.toFixed(1)}`,
                unit: "kg",
              },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("bmiThresholds")}</h3>
          <ResultGrid
            results={[
              { label: tResults("underweight"), value: `< ${weightResult.currentBmiThresholds.underweight.toFixed(1)}`, unit: "kg" },
              { label: tResults("normalWeight"), value: `${weightResult.currentBmiThresholds.underweight.toFixed(1)} - ${weightResult.currentBmiThresholds.normal.toFixed(1)}`, unit: "kg" },
              { label: tResults("overweight"), value: `${weightResult.currentBmiThresholds.normal.toFixed(1)} - ${weightResult.currentBmiThresholds.overweight.toFixed(1)}`, unit: "kg" },
              { label: tResults("obese"), value: `> ${weightResult.currentBmiThresholds.overweight.toFixed(1)}`, unit: "kg" },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("weightCategories")}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{t("category")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{tResults("bmiRange")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{tResults("weightRange")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {weightResult.weightCategories.map((cat) => (
                  <tr key={cat.category}>
                    <td className="px-3 py-2 text-sm">{cat.category}</td>
                    <td className="px-3 py-2 text-sm">{cat.bmiRange}</td>
                    <td className="px-3 py-2 text-sm">{cat.minWeight.toFixed(1)} - {cat.maxWeight.toFixed(1)} kg</td>
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
