"use client";

import { useTranslations } from "next-intl";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConverter } from "@/hooks";
import {
  type WaterIntakeInput,
  type WaterIntakeResult,
  calculateWaterIntake,
} from "@/lib/converters/health/water-intake-calculator";

interface FormValues {
  weight: string;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "athlete";
  climate: "temperate" | "hot" | "humid" | "cold";
  pregnant: boolean;
  breastfeeding: boolean;
}

export function WaterIntakeCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, WaterIntakeResult | null>({
    initialValues: {
      weight: "70",
      activityLevel: "moderate",
      climate: "temperate",
      pregnant: false,
      breastfeeding: false,
    },
    calculate: (vals) => {
      const input: WaterIntakeInput = {
        weight: parseFloat(vals.weight) || 0,
        activityLevel: vals.activityLevel,
        climate: vals.climate,
        pregnant: vals.pregnant,
        breastfeeding: vals.breastfeeding,
      };
      return { value: calculateWaterIntake(input) };
    },
  });

  const waterResult = result?.value;

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
          <Label>{t("activityLevel")}</Label>
          <Select
            value={values.activityLevel}
            onValueChange={(v) => setValue("activityLevel", v as typeof values.activityLevel)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">{t("sedentary")}</SelectItem>
              <SelectItem value="light">{t("light")}</SelectItem>
              <SelectItem value="moderate">{t("moderate")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="athlete">{t("athlete")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("climate")}</Label>
          <Select
            value={values.climate}
            onValueChange={(v) => setValue("climate", v as typeof values.climate)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="temperate">{t("temperate")}</SelectItem>
              <SelectItem value="hot">{t("hot")}</SelectItem>
              <SelectItem value="humid">{t("humid")}</SelectItem>
              <SelectItem value="cold">{t("cold")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="pregnant"
              checked={values.pregnant}
              onCheckedChange={(checked) => setValue("pregnant", checked)}
            />
            <Label htmlFor="pregnant">{t("pregnant")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="breastfeeding"
              checked={values.breastfeeding}
              onCheckedChange={(checked) => setValue("breastfeeding", checked)}
            />
            <Label htmlFor="breastfeeding">{t("breastfeeding")}</Label>
          </div>
        </div>
      </div>

      {waterResult && (
        <div className="space-y-4">
          <OutputDisplay
            label={tResults("dailyWaterIntake")}
            value={waterResult.dailyIntakeLiters.toFixed(1)}
            unit="L"
            size="lg"
          />

          <ResultGrid
            results={[
              {
                label: tResults("milliliters"),
                value: Math.round(waterResult.dailyIntakeMl),
                unit: "ml",
              },
              {
                label: tResults("ounces"),
                value: Math.round(waterResult.dailyIntakeOz),
                unit: "oz",
              },
              {
                label: tResults("cups"),
                value: Math.round(waterResult.dailyIntakeCups),
                unit: "cups",
              },
              {
                label: tResults("hourlyReminder"),
                value: waterResult.hourlyReminder,
                unit: "ml/h",
              },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("breakdown")}</h3>
          <ResultGrid
            results={[
              { label: tResults("baseNeeds"), value: Math.round(waterResult.breakdown.baseNeeds), unit: "ml" },
              { label: tResults("activityAddition"), value: waterResult.breakdown.activityAddition, unit: "ml" },
              { label: tResults("climateAddition"), value: waterResult.breakdown.climateAddition, unit: "ml" },
              { label: tResults("specialAddition"), value: waterResult.breakdown.specialAddition, unit: "ml" },
            ]}
          />

          <h3 className="text-lg font-semibold">{tResults("drinkingSchedule")}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{t("time")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{t("amount")}</th>
                  <th className="px-3 py-2 text-left text-sm font-semibold">{tResults("cumulative")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {waterResult.schedule.map((item) => (
                  <tr key={item.time}>
                    <td className="px-3 py-2 text-sm">{item.time}</td>
                    <td className="px-3 py-2 text-sm">{item.amount} ml</td>
                    <td className="px-3 py-2 text-sm">{item.cumulative} ml</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold">{tResults("hydrationTips")}</h3>
          <ul className="list-disc list-inside space-y-1 bg-muted p-4 rounded-lg">
            {waterResult.tips.map((tip, index) => (
              <li key={index} className="text-sm">{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
