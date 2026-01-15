"use client";

import { useTranslations } from "next-intl";
import { InputField, ResultGrid } from "@/components/converter";
import { useConverter } from "@/hooks";
import {
  type BodySurfaceAreaInput,
  type BodySurfaceAreaResult,
  calculateBodySurfaceArea,
} from "@/lib/converters/health/body-surface-area";

interface FormValues {
  weight: string;
  height: string;
}

export function BodySurfaceAreaCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, BodySurfaceAreaResult | null>({
    initialValues: {
      weight: "70",
      height: "175",
    },
    calculate: (vals) => {
      const input: BodySurfaceAreaInput = {
        weight: parseFloat(vals.weight) || 0,
        height: parseFloat(vals.height) || 0,
      };
      return { value: calculateBodySurfaceArea(input) };
    },
  });

  const bsaResult = result?.value;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="weight"
          label={t("weight")}
          value={values.weight}
          onChange={(v) => setValue("weight", v)}
          min={0}
          step="0.1"
          placeholder="70"
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

      {bsaResult && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {tResults("bodySurfaceArea")} (Multiple Formulas)
          </h3>
          <ResultGrid
            results={[
              {
                label: "Du Bois Formula",
                value: bsaResult.duBois,
                unit: "m²",
              },
              {
                label: "Mosteller Formula",
                value: bsaResult.mosteller,
                unit: "m²",
              },
              {
                label: "Haycock Formula",
                value: bsaResult.haycock,
                unit: "m²",
              },
              {
                label: "Gehan-George Formula",
                value: bsaResult.gehanGeorge,
                unit: "m²",
              },
              {
                label: "Boyd Formula",
                value: bsaResult.boyd,
                unit: "m²",
              },
              {
                label: tResults("average"),
                value: bsaResult.average,
                unit: "m²",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
