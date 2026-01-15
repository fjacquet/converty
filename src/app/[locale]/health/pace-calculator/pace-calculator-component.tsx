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
  type PaceInput,
  type PaceResult,
  calculatePace,
} from "@/lib/converters/health/pace-calculator";

interface FormValues {
  mode: "pace" | "time" | "distance";
  distance: string;
  hours: string;
  minutes: string;
  seconds: string;
  paceMinutes: string;
  paceSeconds: string;
}

export function PaceCalculatorComponent() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, PaceResult | null>({
    initialValues: {
      mode: "pace",
      distance: "10",
      hours: "0",
      minutes: "50",
      seconds: "0",
      paceMinutes: "5",
      paceSeconds: "0",
    },
    calculate: (vals) => {
      const input: PaceInput = {
        mode: vals.mode,
        distance: parseFloat(vals.distance) || 0,
        hours: parseInt(vals.hours) || 0,
        minutes: parseInt(vals.minutes) || 0,
        seconds: parseInt(vals.seconds) || 0,
        paceMinutes: parseInt(vals.paceMinutes) || 0,
        paceSeconds: parseInt(vals.paceSeconds) || 0,
      };
      return { value: calculatePace(input) };
    },
  });

  const paceResult = result?.value;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t("calculationMode")}</Label>
        <Select
          value={values.mode}
          onValueChange={(v) => setValue("mode", v as "pace" | "time" | "distance")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pace">{t("calculatePace")}</SelectItem>
            <SelectItem value="time">{t("calculateTime")}</SelectItem>
            <SelectItem value="distance">{t("calculateDistance")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {values.mode !== "distance" && (
          <InputField
            id="distance"
            label={t("distanceKm")}
            value={values.distance}
            onChange={(v) => setValue("distance", v)}
            min={0}
            step="0.1"
            placeholder="10"
          />
        )}

        {values.mode !== "pace" && (
          <div className="space-y-2">
            <Label>{t("pacePerKm")}</Label>
            <div className="flex gap-2">
              <InputField
                id="paceMinutes"
                label={t("minutes")}
                value={values.paceMinutes}
                onChange={(v) => setValue("paceMinutes", v)}
                min={0}
                max={59}
                step="1"
                placeholder="5"
              />
              <InputField
                id="paceSeconds"
                label={t("seconds")}
                value={values.paceSeconds}
                onChange={(v) => setValue("paceSeconds", v)}
                min={0}
                max={59}
                step="1"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {values.mode !== "time" && (
          <div className="space-y-2">
            <Label>{t("time")}</Label>
            <div className="flex gap-2">
              <InputField
                id="hours"
                label={t("hours")}
                value={values.hours}
                onChange={(v) => setValue("hours", v)}
                min={0}
                step="1"
                placeholder="0"
              />
              <InputField
                id="minutes"
                label={t("minutes")}
                value={values.minutes}
                onChange={(v) => setValue("minutes", v)}
                min={0}
                max={59}
                step="1"
                placeholder="50"
              />
              <InputField
                id="seconds"
                label={t("seconds")}
                value={values.seconds}
                onChange={(v) => setValue("seconds", v)}
                min={0}
                max={59}
                step="1"
                placeholder="0"
              />
            </div>
          </div>
        )}
      </div>

      {paceResult && (
        <div className="space-y-4">
          <ResultGrid
            results={[
              {
                label: tResults("pacePerKm"),
                value: `${paceResult.pace.minutes}:${paceResult.pace.seconds.toString().padStart(2, "0")}`,
                unit: "/km",
              },
              {
                label: tResults("pacePerMile"),
                value: `${paceResult.paceMile.minutes}:${paceResult.paceMile.seconds.toString().padStart(2, "0")}`,
                unit: "/mi",
              },
              {
                label: tResults("speed"),
                value: paceResult.speed.toFixed(1),
                unit: "km/h",
              },
              {
                label: tResults("speedMph"),
                value: paceResult.speedMph.toFixed(1),
                unit: "mph",
              },
              {
                label: tResults("totalTime"),
                value: `${paceResult.totalTime.hours}:${paceResult.totalTime.minutes.toString().padStart(2, "0")}:${paceResult.totalTime.seconds.toString().padStart(2, "0")}`,
                unit: "",
              },
              {
                label: tResults("totalDistance"),
                value: paceResult.distance.toFixed(2),
                unit: "km",
              },
            ]}
          />

          {paceResult.splits.length > 0 && paceResult.splits.length <= 50 && (
            <>
              <h3 className="text-lg font-semibold">{tResults("splits")}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-sm font-semibold">Km</th>
                      <th className="px-3 py-2 text-left text-sm font-semibold">{t("time")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paceResult.splits.map((split) => (
                      <tr key={split.km}>
                        <td className="px-3 py-2 text-sm">{split.km}</td>
                        <td className="px-3 py-2 text-sm font-medium">{split.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
