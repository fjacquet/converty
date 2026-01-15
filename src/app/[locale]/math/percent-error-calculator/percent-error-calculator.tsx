"use client";

import { useTranslations } from "next-intl";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { useConverter } from "@/hooks";
import {
  type PercentErrorInput,
  type PercentErrorResult,
  calculatePercentError,
} from "@/lib/converters/math/percent-error";

interface FormValues {
  experimental: string;
  theoretical: string;
}

export function PercentErrorCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");
  const tMath = useTranslations("calculator.math");

  const { values, setValue, result } = useConverter<FormValues, PercentErrorResult | null>({
    initialValues: {
      experimental: "10.5",
      theoretical: "10",
    },
    calculate: (vals) => {
      const input: PercentErrorInput = {
        experimental: parseFloat(vals.experimental) || 0,
        theoretical: parseFloat(vals.theoretical) || 0,
      };
      return { value: calculatePercentError(input) };
    },
  });

  const errorResult = result?.value;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="experimental"
          label={tMath("experimentalValue")}
          value={values.experimental}
          onChange={(v) => setValue("experimental", v)}
          step="any"
          placeholder="10.5"
        />

        <InputField
          id="theoretical"
          label={tMath("theoreticalValue")}
          value={values.theoretical}
          onChange={(v) => setValue("theoretical", v)}
          step="any"
          placeholder="10"
        />
      </div>

      {errorResult && (
        <div className="space-y-4">
          <OutputDisplay
            label={tMath("percentError")}
            value={errorResult.percentError.toFixed(4)}
            unit="%"
            size="lg"
          />

          <ResultGrid
            results={[
              { label: tMath("absoluteError"), value: errorResult.absoluteError.toFixed(6) },
              { label: tMath("relativeError"), value: errorResult.relativeError.toFixed(6) },
            ]}
          />

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{tMath("formula")}:</p>
            <p className="text-sm text-muted-foreground font-mono">{errorResult.formula}</p>
            <p className="text-sm text-muted-foreground">{errorResult.interpretation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
