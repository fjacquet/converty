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
import {
  type CaloriesBurnedInput,
  type CaloriesBurnedResult,
  calculateCaloriesBurned,
  getAvailableActivities,
} from "@/lib/converters/health/calories-burned";
import { createCalculatorStore } from "@/stores/calculator-store";

interface FormValues {
  weight: string;
  activity: string;
  duration: string;
}

const activities = getAvailableActivities();

const useStore = createCalculatorStore<FormValues, CaloriesBurnedResult | null>({
  name: "calories-burned-calculator",
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
    return calculateCaloriesBurned(input);
  },
});

export function CaloriesBurnedCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useStore();

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

      {result && (
        <div className="space-y-4">
          <OutputDisplay
            label={tResults("caloriesBurned")}
            value={Math.round(result.caloriesBurned)}
            unit={tResults("kcal")}
            size="lg"
          />

          <ResultGrid
            results={[
              {
                label: tResults("caloriesPerMinute"),
                value: result.caloriesPerMinute.toFixed(1),
                unit: "kcal/min",
              },
              {
                label: "Activity",
                value: result.activityName,
                unit: "",
              },
              {
                label: "MET Value",
                value: result.met.toFixed(1),
                unit: "",
              },
              {
                label: "Equivalent Walking",
                value: Math.round(result.equivalentWalking),
                unit: "minutes",
              },
              {
                label: tResults("fatBurned"),
                value: result.fatBurned.toFixed(1),
                unit: "g",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
