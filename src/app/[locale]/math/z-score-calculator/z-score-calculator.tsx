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
  type ZScoreInput,
  type ZScoreResult,
  calculateZScore,
} from "@/lib/converters/math/z-score";

type ZScoreMode = "calculate" | "fromZScore" | "probability";

interface FormValues {
  mode: ZScoreMode;
  value: string;
  mean: string;
  standardDeviation: string;
  zScore: string;
}

export function ZScoreCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");
  const tMath = useTranslations("calculator.math");

  const { values, setValue, result } = useConverter<FormValues, ZScoreResult | null>({
    initialValues: {
      mode: "calculate",
      value: "85",
      mean: "100",
      standardDeviation: "15",
      zScore: "-1",
    },
    calculate: (vals) => {
      const input: ZScoreInput = {
        mode: vals.mode,
        value: parseFloat(vals.value) || 0,
        mean: parseFloat(vals.mean) || 0,
        standardDeviation: parseFloat(vals.standardDeviation) || 1,
        zScore: parseFloat(vals.zScore) || 0,
      };
      return { value: calculateZScore(input) };
    },
  });

  const zResult = result?.value;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{tMath("calculationMode")}</Label>
        <Select
          value={values.mode}
          onValueChange={(v) => setValue("mode", v as ZScoreMode)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="calculate">{tMath("calculateZScore")}</SelectItem>
            <SelectItem value="fromZScore">{tMath("valueFromZScore")}</SelectItem>
            <SelectItem value="probability">{tMath("zScoreFromPercentile")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {values.mode === "calculate" && (
          <InputField
            id="value"
            label={tMath("rawValue")}
            value={values.value}
            onChange={(v) => setValue("value", v)}
            step="any"
            placeholder="85"
          />
        )}

        {values.mode === "fromZScore" && (
          <InputField
            id="zScore"
            label={tMath("zScore")}
            value={values.zScore}
            onChange={(v) => setValue("zScore", v)}
            step="any"
            placeholder="-1"
          />
        )}

        {values.mode === "probability" && (
          <InputField
            id="value"
            label={tMath("percentile")}
            value={values.value}
            onChange={(v) => setValue("value", v)}
            step="any"
            min={0}
            max={100}
            placeholder="50"
          />
        )}

        <InputField
          id="mean"
          label={tMath("mean")}
          value={values.mean}
          onChange={(v) => setValue("mean", v)}
          step="any"
          placeholder="100"
        />

        <InputField
          id="standardDeviation"
          label={tMath("standardDeviation")}
          value={values.standardDeviation}
          onChange={(v) => setValue("standardDeviation", v)}
          step="any"
          min={0.001}
          placeholder="15"
        />
      </div>

      {zResult && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <OutputDisplay
              label={tMath("zScore")}
              value={zResult.zScore.toFixed(4)}
              size="lg"
            />
            <OutputDisplay
              label={tMath("rawValue")}
              value={zResult.value.toFixed(4)}
              size="lg"
            />
          </div>

          <ResultGrid
            results={[
              { label: tMath("percentile"), value: `${zResult.percentile.toFixed(2)}%` },
              { label: tMath("probabilityBelow"), value: `${(zResult.probabilityBelow * 100).toFixed(2)}%` },
              { label: tMath("probabilityAbove"), value: `${(zResult.probabilityAbove * 100).toFixed(2)}%` },
              { label: tMath("probabilityBetween"), value: `${((zResult.probabilityBetween || 0) * 100).toFixed(2)}%` },
            ]}
          />

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{tMath("interpretation")}:</p>
            <p className="text-sm text-muted-foreground">{zResult.interpretation}</p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{tMath("calculationSteps")}:</p>
            <div className="text-sm text-muted-foreground font-mono space-y-1">
              {zResult.steps.map((step, i) => (
                <p key={i}>{step}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
