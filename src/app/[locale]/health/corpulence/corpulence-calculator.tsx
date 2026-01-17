"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { calculateCorpulence, compareToBMI } from "@/lib/converters/health/corpulence";

export function CorpulenceCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const numWeight = parseFloat(weight) || 0;
  const numHeight = parseFloat(height) || 0;

  const result = calculateCorpulence(numWeight, numHeight, unit);
  const comparison = compareToBMI(numWeight, numHeight, unit);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "text-blue-600 dark:text-blue-400";
      case "Normal (Lower)":
      case "Normal":
      case "Normal (Upper)":
        return "text-green-600 dark:text-green-400";
      case "Overweight":
        return "text-yellow-600 dark:text-yellow-400";
      case "Obese":
        return "text-red-600 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setUnit("metric")}
          className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
            unit === "metric" ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
          }`}
        >
          Metric (kg/cm)
        </button>
        <button
          onClick={() => setUnit("imperial")}
          className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
            unit === "imperial"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 hover:bg-muted"
          }`}
        >
          Imperial (lbs/in)
        </button>
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="weight"
          label={t("weightSimple")}
          value={weight}
          onChange={setWeight}
          unit={unit === "metric" ? "kg" : "lbs"}
          min={1}
          step={0.1}
          placeholder={t("enterWeight")}
        />
        <InputField
          id="height"
          label={t("heightSimple")}
          value={height}
          onChange={setHeight}
          unit={unit === "metric" ? "cm" : "in"}
          min={1}
          step={0.1}
          placeholder={t("enterHeight")}
        />
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <OutputDisplay
              label={t("corpulenceIndex")}
              value={`${result.corpulenceIndex} kg/m³`}
              size="lg"
            />
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">{tResults("category")}</p>
              <p className={`text-xl font-semibold ${getCategoryColor(result.category)}`}>
                {result.category}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-muted/50">
            <p className="text-sm font-medium mb-1">Health Risk Assessment</p>
            <p className="text-muted-foreground">{result.healthRisk}</p>
          </div>

          {/* BMI Comparison */}
          {comparison && (
            <div className="space-y-2">
              <h3 className="font-medium">Comparison with BMI</h3>
              <ResultGrid
                results={[
                  { label: "Corpulence Index", value: comparison.ci, unit: "kg/m³" },
                  { label: "BMI", value: comparison.bmi, unit: "kg/m²" },
                ]}
                columns={2}
              />
              <p className="text-sm text-muted-foreground p-3 rounded border bg-muted/50">
                {comparison.difference}
              </p>
            </div>
          )}

          {/* Reference Table */}
          <div className="space-y-2">
            <h3 className="font-medium">Corpulence Index Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Range (kg/m³)</th>
                    <th className="text-left py-2 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-muted">
                    <td className="py-2 font-mono">&lt; 11</td>
                    <td className="py-2 text-blue-600 dark:text-blue-400">Underweight</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="py-2 font-mono">11 - 15</td>
                    <td className="py-2 text-green-600 dark:text-green-400">Normal</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="py-2 font-mono">15 - 17</td>
                    <td className="py-2 text-yellow-600 dark:text-yellow-400">Overweight</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="py-2 font-mono">&gt; 17</td>
                    <td className="py-2 text-red-600 dark:text-red-400">Obese</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-lg border bg-muted/50 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">About Corpulence Index</p>
            <p>
              The Corpulence Index (CI), also known as the Ponderal Index, is calculated as weight
              divided by height cubed (kg/m³). Unlike BMI which uses height squared, CI may provide
              a more accurate assessment for very tall or short individuals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
