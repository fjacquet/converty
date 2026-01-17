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
import { createCalculatorStore } from "@/stores/calculator-store";
import {
  type BodyTypeInput,
  type BodyTypeResult,
  calculateBodyType,
} from "@/lib/converters/health/body-type-calculator";

interface FormValues {
  gender: "male" | "female";
  wristCircumference: string;
  height: string;
  shoulderWidth: string;
  hipWidth: string;
}

const useStore = createCalculatorStore<FormValues, BodyTypeResult | null>({
  name: "body-type-calculator",
  initialValues: {
    gender: "male",
    wristCircumference: "17",
    height: "175",
    shoulderWidth: "45",
    hipWidth: "35",
  },
  calculate: (vals) => {
    const input: BodyTypeInput = {
      gender: vals.gender,
      wristCircumference: parseFloat(vals.wristCircumference) || 0,
      height: parseFloat(vals.height) || 0,
      shoulderWidth: parseFloat(vals.shoulderWidth) || undefined,
      hipWidth: parseFloat(vals.hipWidth) || undefined,
    };
    return calculateBodyType(input);
  },
});

export function BodyTypeCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useStore();

  const getBodyTypeColor = (type: string) => {
    switch (type) {
      case "ectomorph":
        return "bg-blue-100 dark:bg-blue-900";
      case "mesomorph":
        return "bg-green-100 dark:bg-green-900";
      case "endomorph":
        return "bg-orange-100 dark:bg-orange-900";
      default:
        return "bg-purple-100 dark:bg-purple-900";
    }
  };

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
          id="height"
          label={t("height")}
          value={values.height}
          onChange={(v) => setValue("height", v)}
          min={0}
          step="0.1"
          placeholder="175"
        />

        <InputField
          id="wristCircumference"
          label={t("wristCircumference")}
          value={values.wristCircumference}
          onChange={(v) => setValue("wristCircumference", v)}
          min={0}
          step="0.1"
          placeholder="17"
        />

        <InputField
          id="shoulderWidth"
          label={t("shoulderWidth")}
          value={values.shoulderWidth}
          onChange={(v) => setValue("shoulderWidth", v)}
          min={0}
          step="0.1"
          placeholder="45"
        />

        <InputField
          id="hipWidth"
          label={t("hipWidth")}
          value={values.hipWidth}
          onChange={(v) => setValue("hipWidth", v)}
          min={0}
          step="0.1"
          placeholder="35"
        />
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg text-center ${getBodyTypeColor(result.bodyType)}`}>
            <h2 className="text-2xl font-bold capitalize">{result.bodyType}</h2>
            <p className="text-sm">{tResults("frameSize")}: {result.frameSize}</p>
          </div>

          <ResultGrid
            results={[
              {
                label: tResults("wristRatio"),
                value: result.wristRatio.toFixed(2),
                unit: "",
              },
              ...(result.shoulderToHipRatio
                ? [{
                    label: tResults("shoulderToHipRatio"),
                    value: result.shoulderToHipRatio.toFixed(2),
                    unit: "",
                  }]
                : []),
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("characteristics")}</h3>
          <ul className="list-disc list-inside space-y-1 bg-muted p-4 rounded-lg">
            {result.characteristics.map((char) => (
              <li key={char} className="text-sm">{char}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold">{tResults("trainingRecommendations")}</h3>
          <ul className="list-disc list-inside space-y-1 bg-muted p-4 rounded-lg">
            {result.trainingRecommendations.map((rec) => (
              <li key={rec} className="text-sm">{rec}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold">{tResults("nutritionRecommendations")}</h3>
          <ul className="list-disc list-inside space-y-1 bg-muted p-4 rounded-lg">
            {result.nutritionRecommendations.map((rec) => (
              <li key={rec} className="text-sm">{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
