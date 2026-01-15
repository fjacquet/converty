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
  type GfrInput,
  type GfrResult,
  calculateGfr,
} from "@/lib/converters/health/gfr-calculator";

interface FormValues {
  creatinine: string;
  creatinineUnit: "mgdl" | "umol";
  age: string;
  gender: "male" | "female";
  race: "black" | "other";
  weight: string;
}

export function GfrCalculatorComponent() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  const { values, setValue, result } = useConverter<FormValues, GfrResult | null>({
    initialValues: {
      creatinine: "1.0",
      creatinineUnit: "mgdl",
      age: "45",
      gender: "male",
      race: "other",
      weight: "75",
    },
    calculate: (vals) => {
      const input: GfrInput = {
        creatinine: parseFloat(vals.creatinine) || 0,
        creatinineUnit: vals.creatinineUnit,
        age: parseInt(vals.age) || 0,
        gender: vals.gender,
        race: vals.race,
        weight: parseFloat(vals.weight) || undefined,
      };
      return { value: calculateGfr(input) };
    },
  });

  const gfrResult = result?.value;

  const getStageColor = (stage: number) => {
    switch (stage) {
      case 1:
        return "bg-green-100 dark:bg-green-900";
      case 2:
        return "bg-lime-100 dark:bg-lime-900";
      case 3:
        return "bg-yellow-100 dark:bg-yellow-900";
      case 4:
        return "bg-orange-100 dark:bg-orange-900";
      case 5:
        return "bg-red-100 dark:bg-red-900";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="creatinine"
          label={t("creatinine")}
          value={values.creatinine}
          onChange={(v) => setValue("creatinine", v)}
          min={0}
          step="0.01"
          placeholder="1.0"
        />

        <div className="space-y-2">
          <Label>{t("creatinineUnit")}</Label>
          <Select
            value={values.creatinineUnit}
            onValueChange={(v) => setValue("creatinineUnit", v as "mgdl" | "umol")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mgdl">mg/dL</SelectItem>
              <SelectItem value="umol">µmol/L</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <InputField
          id="age"
          label={t("age")}
          value={values.age}
          onChange={(v) => setValue("age", v)}
          min={18}
          max={120}
          step="1"
          placeholder="45"
        />

        <div className="space-y-2">
          <Label>{t("gender")}</Label>
          <Select
            value={values.gender}
            onValueChange={(v) => setValue("gender", v as "male" | "female")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t("male")}</SelectItem>
              <SelectItem value="female">{t("female")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <InputField
          id="weight"
          label={t("weight")}
          value={values.weight}
          onChange={(v) => setValue("weight", v)}
          min={0}
          step="0.1"
          placeholder="75"
        />
      </div>

      {gfrResult && (
        <div className="space-y-4">
          <OutputDisplay
            label={tResults("estimatedGFR")}
            value={Math.round(gfrResult.egfrCkdEpi)}
            unit="mL/min/1.73m²"
            size="lg"
          />

          <div className={`p-4 rounded-lg ${getStageColor(gfrResult.stage)}`}>
            <p className="font-semibold">{gfrResult.stageDescription}</p>
            <p>{gfrResult.kidneyFunction}</p>
            <p className="text-sm mt-2">{gfrResult.recommendation}</p>
          </div>

          <h3 className="text-lg font-semibold">{tResults("gfrByFormula")}</h3>
          <ResultGrid
            results={[
              {
                label: "CKD-EPI (2021)",
                value: Math.round(gfrResult.egfrCkdEpi),
                unit: "mL/min/1.73m²",
              },
              {
                label: "MDRD",
                value: Math.round(gfrResult.egfrMdrd),
                unit: "mL/min/1.73m²",
              },
              ...(gfrResult.egfrCockcroftGault
                ? [{
                    label: "Cockcroft-Gault",
                    value: Math.round(gfrResult.egfrCockcroftGault),
                    unit: "mL/min",
                  }]
                : []),
            ]}
          />

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">{tResults("ckdStages")}</h4>
            <ul className="space-y-1 text-sm">
              <li>Stage 1: GFR ≥90 - Normal</li>
              <li>Stage 2: GFR 60-89 - Mild decrease</li>
              <li>Stage 3a: GFR 45-59 - Mild to moderate</li>
              <li>Stage 3b: GFR 30-44 - Moderate to severe</li>
              <li>Stage 4: GFR 15-29 - Severe decrease</li>
              <li>Stage 5: GFR &lt;15 - Kidney failure</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
