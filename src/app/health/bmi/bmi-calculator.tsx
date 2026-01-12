"use client";

import { useConverter } from "@/hooks";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import {
  calculateBMI,
  BMIInput,
  BMIResult,
  getBMICategoryInfo,
  WeightUnit,
  HeightUnit,
} from "@/lib/converters/health/bmi";
import { cn } from "@/lib/utils";

const WEIGHT_UNITS = [
  { value: "kg", label: "kg" },
  { value: "lb", label: "lb" },
];

const HEIGHT_UNITS = [
  { value: "cm", label: "cm" },
  { value: "m", label: "m" },
  { value: "in", label: "in" },
  { value: "ft", label: "ft" },
];

interface FormValues {
  weight: string;
  weightUnit: WeightUnit;
  height: string;
  heightUnit: HeightUnit;
}

export function BMICalculator() {
  const { values, setValue, result } = useConverter<
    FormValues,
    BMIResult | null
  >({
    initialValues: {
      weight: "70",
      weightUnit: "kg",
      height: "175",
      heightUnit: "cm",
    },
    calculate: (vals) => {
      const input: BMIInput = {
        weight: parseFloat(vals.weight) || 0,
        weightUnit: vals.weightUnit,
        height: parseFloat(vals.height) || 0,
        heightUnit: vals.heightUnit,
      };
      return { value: calculateBMI(input) };
    },
  });

  const bmiResult = result?.value;
  const categoryInfo = bmiResult ? getBMICategoryInfo(bmiResult.category) : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="weight"
          label="Weight"
          value={values.weight}
          onChange={(v) => setValue("weight", v)}
          units={WEIGHT_UNITS}
          selectedUnit={values.weightUnit}
          onUnitChange={(u) => setValue("weightUnit", u as WeightUnit)}
          min={0}
          step="0.1"
          placeholder="Enter weight"
        />

        <InputField
          id="height"
          label="Height"
          value={values.height}
          onChange={(v) => setValue("height", v)}
          units={HEIGHT_UNITS}
          selectedUnit={values.heightUnit}
          onUnitChange={(u) => setValue("heightUnit", u as HeightUnit)}
          min={0}
          step="0.1"
          placeholder="Enter height"
        />
      </div>

      {bmiResult && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <OutputDisplay
              label="Your BMI"
              value={bmiResult.bmi}
              size="lg"
              className="flex-1"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Category
              </p>
              <div
                className={cn(
                  "rounded-md border bg-muted/50 px-3 py-4",
                  categoryInfo?.color
                )}
              >
                <span className="text-2xl font-bold">
                  {bmiResult.categoryLabel}
                </span>
              </div>
            </div>
          </div>

          <ResultGrid
            results={[
              {
                label: "Healthy Weight Range",
                value: `${bmiResult.healthyWeightRange.min} - ${bmiResult.healthyWeightRange.max}`,
                unit: "kg",
              },
              ...(bmiResult.weightToHealthy !== null
                ? [
                    {
                      label:
                        bmiResult.category === "underweight"
                          ? "Weight to gain"
                          : "Weight to lose",
                      value: Math.abs(bmiResult.weightToHealthy),
                      unit: "kg",
                    },
                  ]
                : []),
            ]}
          />

          {/* BMI Scale Visualization */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">BMI Scale</p>
            <div className="relative h-8 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-blue-400" title="Underweight" />
                <div className="flex-1 bg-green-400" title="Normal" />
                <div className="flex-1 bg-yellow-400" title="Overweight" />
                <div className="flex-1 bg-orange-400" title="Obese I" />
                <div className="flex-1 bg-red-400" title="Obese II" />
                <div className="flex-1 bg-red-600" title="Obese III" />
              </div>
              {/* BMI Indicator */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-black dark:bg-white"
                style={{
                  left: `${Math.min(Math.max(((bmiResult.bmi - 15) / 30) * 100, 0), 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40</span>
              <span>45</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
