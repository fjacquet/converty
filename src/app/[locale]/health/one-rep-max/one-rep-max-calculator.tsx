"use client";

import { useTranslations } from "next-intl";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { useConverter } from "@/hooks";
import {
  type OneRepMaxInput,
  type OneRepMaxResult,
  calculateOneRepMax,
} from "@/lib/converters/health/one-rep-max";

interface FormValues {
  weight: string;
  reps: string;
}

export function OneRepMaxCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, OneRepMaxResult | null>({
    initialValues: {
      weight: "100",
      reps: "5",
    },
    calculate: (vals) => {
      const input: OneRepMaxInput = {
        weight: parseFloat(vals.weight) || 0,
        reps: parseInt(vals.reps) || 0,
      };
      return { value: calculateOneRepMax(input) };
    },
  });

  const oneRmResult = result?.value;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="weight"
          label={t("weightLifted")}
          value={values.weight}
          onChange={(v) => setValue("weight", v)}
          min={0}
          step="0.5"
          placeholder="100"
        />

        <InputField
          id="reps"
          label={t("repetitions")}
          value={values.reps}
          onChange={(v) => setValue("reps", v)}
          min={1}
          max={30}
          step="1"
          placeholder="5"
        />
      </div>

      {oneRmResult && (
        <div className="space-y-4">
          <OutputDisplay
            label={tResults("estimated1RM")}
            value={Math.round(oneRmResult.average)}
            unit="kg"
            size="lg"
          />

          <h3 className="text-lg font-semibold">{tResults("formulaResults")}</h3>
          <ResultGrid
            results={[
              { label: "Epley", value: Math.round(oneRmResult.epley), unit: "kg" },
              { label: "Brzycki", value: Math.round(oneRmResult.brzycki), unit: "kg" },
              { label: "Lander", value: Math.round(oneRmResult.lander), unit: "kg" },
              { label: "Lombardi", value: Math.round(oneRmResult.lombardi), unit: "kg" },
              { label: "Mayhew", value: Math.round(oneRmResult.mayhew), unit: "kg" },
              { label: "O'Conner", value: Math.round(oneRmResult.oconner), unit: "kg" },
              { label: "Wathan", value: Math.round(oneRmResult.wathan), unit: "kg" },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("percentageChart")}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-semibold">%</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{t("weight")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{t("reps")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {oneRmResult.percentages.map((row) => (
                  <tr key={row.percent}>
                    <td className="px-3 py-2 text-sm">{row.percent}%</td>
                    <td className="px-3 py-2 text-sm font-medium">{Math.round(row.weight)} kg</td>
                    <td className="px-3 py-2 text-sm">{row.reps}</td>
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
