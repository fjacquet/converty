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
  type BmrInput,
  type BmrResult,
  calculateBmr,
} from "@/lib/converters/health/bmr-calculator";

interface FormValues {
  gender: "male" | "female";
  age: string;
  weight: string;
  height: string;
}

export function BmrCalculatorComponent() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, BmrResult | null>({
    initialValues: {
      gender: "male",
      age: "30",
      weight: "75",
      height: "175",
    },
    calculate: (vals) => {
      const input: BmrInput = {
        gender: vals.gender,
        age: parseFloat(vals.age) || 0,
        weight: parseFloat(vals.weight) || 0,
        height: parseFloat(vals.height) || 0,
      };
      return { value: calculateBmr(input) };
    },
  });

  const bmrResult = result?.value;

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
          placeholder="75"
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
      </div>

      {bmrResult && (
        <div className="space-y-4">
          <OutputDisplay
            label={tResults("bmr") + " (Average)"}
            value={Math.round(bmrResult.average)}
            unit={tResults("kcal") + "/day"}
            size="lg"
          />

          <h3 className="text-lg font-semibold">BMR Formulas</h3>
          <ResultGrid
            results={[
              {
                label: "Harris-Benedict",
                value: Math.round(bmrResult.harrisBenedict),
                unit: "kcal/day",
              },
              {
                label: "Mifflin-St Jeor",
                value: Math.round(bmrResult.mifflinStJeor),
                unit: "kcal/day",
              },
            ]}
          />

          <h3 className="text-lg font-semibold">Daily Calories by Activity Level</h3>
          <ResultGrid
            results={[
              {
                label: t("sedentary"),
                value: Math.round(bmrResult.sedentary),
                unit: "kcal/day",
              },
              {
                label: t("light"),
                value: Math.round(bmrResult.lightActivity),
                unit: "kcal/day",
              },
              {
                label: t("moderate"),
                value: Math.round(bmrResult.moderateActivity),
                unit: "kcal/day",
              },
              {
                label: t("active"),
                value: Math.round(bmrResult.veryActive),
                unit: "kcal/day",
              },
              {
                label: t("veryActive"),
                value: Math.round(bmrResult.extraActive),
                unit: "kcal/day",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
