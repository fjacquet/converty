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
import { createCalculatorStore } from "@/stores/calculator-store";
import {
  type RatioInput,
  type RatioResult,
  calculateRatio,
} from "@/lib/converters/math/ratio";

interface FormValues {
  mode: "simplify" | "scale" | "findMissing" | "compare";
  a: string;
  b: string;
  c: string;
  d: string;
  scaleFactor: string;
  targetValue: string;
}

const useRatioStore = createCalculatorStore<FormValues, RatioResult | null>({
  name: "ratio-calculator",
  initialValues: {
    mode: "simplify",
    a: "12",
    b: "18",
    c: "3",
    d: "",
    scaleFactor: "2",
    targetValue: "24",
  },
  calculate: (vals) => {
    const input: RatioInput = {
      mode: vals.mode,
      a: parseFloat(vals.a) || 0,
      b: parseFloat(vals.b) || 0,
      c: vals.c ? parseFloat(vals.c) : undefined,
      d: vals.d ? parseFloat(vals.d) : undefined,
      scaleFactor: vals.scaleFactor ? parseFloat(vals.scaleFactor) : undefined,
      targetValue: vals.targetValue ? parseFloat(vals.targetValue) : undefined,
    };
    return calculateRatio(input);
  },
});

export function RatioCalculator() {
  const tMath = useTranslations("calculator.math");

  const { values, setValue, result } = useRatioStore();

  const ratioResult = result;

  const renderInputs = () => {
    const baseInputs = (
      <>
        <InputField
          id="a"
          label="A"
          value={values.a}
          onChange={(v) => setValue("a", v)}
          step="any"
          placeholder="12"
        />
        <InputField
          id="b"
          label="B"
          value={values.b}
          onChange={(v) => setValue("b", v)}
          step="any"
          placeholder="18"
        />
      </>
    );

    switch (values.mode) {
      case "simplify":
        return baseInputs;
      case "scale":
        return (
          <>
            {baseInputs}
            <InputField
              id="scaleFactor"
              label={tMath("scaleFactor")}
              value={values.scaleFactor}
              onChange={(v) => setValue("scaleFactor", v)}
              step="any"
              placeholder="2"
            />
          </>
        );
      case "findMissing":
        return (
          <>
            {baseInputs}
            <InputField
              id="c"
              label="C"
              value={values.c}
              onChange={(v) => setValue("c", v)}
              step="any"
              placeholder="3"
            />
            <InputField
              id="d"
              label="D (?)"
              value={values.d}
              onChange={(v) => setValue("d", v)}
              step="any"
              placeholder="Leave empty to find"
            />
          </>
        );
      case "compare":
        return (
          <>
            {baseInputs}
            <InputField
              id="c"
              label="C"
              value={values.c}
              onChange={(v) => setValue("c", v)}
              step="any"
              placeholder="4"
            />
            <InputField
              id="d"
              label="D"
              value={values.d}
              onChange={(v) => setValue("d", v)}
              step="any"
              placeholder="6"
            />
          </>
        );
      default:
        return baseInputs;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{tMath("calculationType")}</Label>
          <Select
            value={values.mode}
            onValueChange={(v) => setValue("mode", v as FormValues["mode"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simplify">{tMath("simplifyRatio")}</SelectItem>
              <SelectItem value="scale">{tMath("scaleRatio")}</SelectItem>
              <SelectItem value="findMissing">{tMath("findMissingValue")}</SelectItem>
              <SelectItem value="compare">{tMath("compareRatios")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {renderInputs()}
        </div>
      </div>

      {ratioResult && (
        <div className="space-y-4">
          <OutputDisplay
            label={tMath("simplifiedRatio")}
            value={`${ratioResult.simplified.a} : ${ratioResult.simplified.b}`}
            size="lg"
          />

          <ResultGrid
            results={[
              { label: tMath("decimal"), value: ratioResult.decimal.toFixed(6) },
              { label: tMath("percentage"), value: ratioResult.percentage.toFixed(2), unit: "%" },
              { label: tMath("fraction"), value: ratioResult.fraction },
            ]}
          />

          {ratioResult.scaled && (
            <div className="rounded-lg border border-primary bg-primary/5 p-4">
              <p className="text-sm font-medium mb-2">{tMath("scaledRatio")}:</p>
              <p className="text-lg font-mono">{ratioResult.scaled.a} : {ratioResult.scaled.b}</p>
            </div>
          )}

          {ratioResult.missing !== undefined && (
            <div className="rounded-lg border border-green-500 bg-green-50 dark:bg-green-950 p-4">
              <p className="text-sm font-medium mb-2 text-green-700 dark:text-green-300">{tMath("missingValue")}:</p>
              <p className="text-2xl font-mono text-green-700 dark:text-green-300">{ratioResult.missing.toFixed(4)}</p>
            </div>
          )}

          {ratioResult.comparison && (
            <div className="rounded-lg border border-blue-500 bg-blue-50 dark:bg-blue-950 p-4">
              <p className="text-sm font-medium mb-2 text-blue-700 dark:text-blue-300">{tMath("comparison")}:</p>
              <p className="text-lg font-mono text-blue-700 dark:text-blue-300">{ratioResult.comparison}</p>
            </div>
          )}

          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium mb-3">{tMath("equivalentRatios")}:</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              {ratioResult.equivalentRatios.slice(0, 10).map((ratio, i) => (
                <div key={i} className="bg-muted rounded p-2 text-center font-mono">
                  {ratio.a} : {ratio.b}
                </div>
              ))}
            </div>
          </div>

          {ratioResult.steps.length > 0 && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium">{tMath("steps")}:</p>
              {ratioResult.steps.map((step, i) => (
                <p key={i} className="text-sm text-muted-foreground font-mono">
                  {step}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
