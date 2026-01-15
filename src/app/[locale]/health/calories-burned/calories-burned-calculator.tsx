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
  type CaloriesBurnedInput,
  type CaloriesBurnedResult,
  calculateCaloriesBurned,
  getAvailableActivities,
} from "@/lib/converters/health/calories-burned";

interface FormValues {
  weight: string;
  activity: string;
  duration: string;
}

export function CaloriesBurnedCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const activities = getAvailableActivities();

  const { values, setValue, result } = useConverter<FormValues, CaloriesBurnedResult | null>({
    initialValues: {
      weight: "70",
      activity: "running_6mph",
      duration: "30",
    },
    calculate: (vals) => {
      const input: CaloriesBurnedInput = {
        weight: parseFloat(vals.weight) || 0,
        activity: vals.activity,
        duration: parseFloat(vals.duration) || 0,
      };
      return { value: calculateCaloriesBurned(input) };
    },
  });

  const burnedResult = result?.value;

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

        <div className="space-y-2">
          <Label>{t("activity")}</Label>
          <Select value={values.activity} onValueChange={(v) => setValue("activity", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activities.map((activity) => (
                <SelectItem key={activity.id} value={activity.id}>
                  {activity.name} (MET: {activity.met})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <InputField
          id="duration"
          label={t("duration")}
          value={values.duration}
          onChange={(v) => setValue("duration", v)}
          min={0}
          step="1"
          placeholder="30"
        />
      </div>

      {burnedResult && (
        <div className="space-y-4">
          <OutputDisplay
            label={tResults("caloriesBurned")}
            value={Math.round(burnedResult.caloriesBurned)}
            unit={tResults("kcal")}
            size="lg"
          />

          <ResultGrid
            results={[
              {
                label: tResults("caloriesPerMinute"),
                value: burnedResult.caloriesPerMinute.toFixed(1),
                unit: "kcal/min",
              },
              {
                label: "Activity",
                value: burnedResult.activityName,
                unit: "",
              },
              {
                label: "MET Value",
                value: burnedResult.met.toFixed(1),
                unit: "",
              },
              {
                label: "Equivalent Walking",
                value: Math.round(burnedResult.equivalentWalking),
                unit: "minutes",
              },
              {
                label: tResults("fatBurned"),
                value: burnedResult.fatBurned.toFixed(1),
                unit: "g",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
