"use client";

import { useTranslations } from "next-intl";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { useConverter } from "@/hooks";
import {
  calculateTargetHeartRate,
  type TargetHeartRateInput,
  type TargetHeartRateResult,
} from "@/lib/converters/health/target-heart-rate";

interface FormValues {
  age: string;
  restingHeartRate: string;
}

export function TargetHeartRateCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, TargetHeartRateResult | null>({
    initialValues: {
      age: "30",
      restingHeartRate: "60",
    },
    calculate: (vals) => {
      const input: TargetHeartRateInput = {
        age: parseFloat(vals.age) || 0,
        restingHeartRate: parseFloat(vals.restingHeartRate) || undefined,
      };
      return { value: calculateTargetHeartRate(input) };
    },
  });

  const hrResult = result?.value;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
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
          id="restingHeartRate"
          label={t("restingHeartRate")}
          value={values.restingHeartRate}
          onChange={(v) => setValue("restingHeartRate", v)}
          min={30}
          max={120}
          step="1"
          placeholder="60"
        />
      </div>

      {hrResult && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <OutputDisplay
              label={tResults("maxHeartRate")}
              value={hrResult.maxHeartRate}
              unit="bpm"
              size="lg"
            />
            {hrResult.heartRateReserve && (
              <OutputDisplay
                label={tResults("heartRateReserve")}
                value={hrResult.heartRateReserve}
                unit="bpm"
              />
            )}
          </div>

          <h3 className="text-lg font-semibold">{tResults("heartRateZones")}</h3>
          <div className="space-y-2">
            {hrResult.zones.map((zone) => (
              <div
                key={zone.name}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{zone.name}</p>
                  <p className="text-sm text-muted-foreground">{zone.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {zone.minBpm} - {zone.maxBpm} bpm
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {zone.minPercent}% - {zone.maxPercent}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          <ResultGrid
            results={[
              {
                label: tResults("fatBurningZone"),
                value: `${hrResult.fatBurningZone.min} - ${hrResult.fatBurningZone.max}`,
                unit: "bpm",
              },
              {
                label: tResults("cardioZone"),
                value: `${hrResult.cardioZone.min} - ${hrResult.cardioZone.max}`,
                unit: "bpm",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
