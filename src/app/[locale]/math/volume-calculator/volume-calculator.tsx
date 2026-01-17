"use client";

import { useTranslations } from "next-intl";
import { InputField, OutputDisplay } from "@/components/converter";
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
  type VolumeInput,
  type VolumeResult,
  calculateVolume,
} from "@/lib/converters/math/volume";

interface FormValues {
  shape: "cube" | "rectangular" | "sphere" | "cylinder" | "cone" | "pyramid" | "prism" | "torus";
  length: string;
  width: string;
  height: string;
  radius: string;
  majorRadius: string;
  minorRadius: string;
  baseArea: string;
}

const useVolumeStore = createCalculatorStore<FormValues, VolumeResult | null>({
  name: "volume-calculator",
  initialValues: {
    shape: "cube",
    length: "5",
    width: "4",
    height: "3",
    radius: "5",
    majorRadius: "10",
    minorRadius: "3",
    baseArea: "25",
  },
  calculate: (vals) => {
    const input: VolumeInput = {
      shape: vals.shape,
      length: parseFloat(vals.length) || undefined,
      width: parseFloat(vals.width) || undefined,
      height: parseFloat(vals.height) || undefined,
      radius: parseFloat(vals.radius) || undefined,
      majorRadius: parseFloat(vals.majorRadius) || undefined,
      minorRadius: parseFloat(vals.minorRadius) || undefined,
      baseArea: parseFloat(vals.baseArea) || undefined,
    };
    return calculateVolume(input);
  },
});

export function VolumeCalculator() {
  const tMath = useTranslations("calculator.math");

  const { values, setValue, result } = useVolumeStore();

  const volumeResult = result;

  const renderInputs = () => {
    switch (values.shape) {
      case "cube":
        return (
          <InputField
            id="length"
            label={tMath("sideLength")}
            value={values.length}
            onChange={(v) => setValue("length", v)}
            step="any"
            min={0.0001}
            placeholder="5"
          />
        );
      case "rectangular":
        return (
          <>
            <InputField
              id="length"
              label={tMath("length")}
              value={values.length}
              onChange={(v) => setValue("length", v)}
              step="any"
              min={0.0001}
              placeholder="5"
            />
            <InputField
              id="width"
              label={tMath("width")}
              value={values.width}
              onChange={(v) => setValue("width", v)}
              step="any"
              min={0.0001}
              placeholder="4"
            />
            <InputField
              id="height"
              label={tMath("height")}
              value={values.height}
              onChange={(v) => setValue("height", v)}
              step="any"
              min={0.0001}
              placeholder="3"
            />
          </>
        );
      case "sphere":
        return (
          <InputField
            id="radius"
            label={tMath("radius")}
            value={values.radius}
            onChange={(v) => setValue("radius", v)}
            step="any"
            min={0.0001}
            placeholder="5"
          />
        );
      case "cylinder":
      case "cone":
        return (
          <>
            <InputField
              id="radius"
              label={tMath("radius")}
              value={values.radius}
              onChange={(v) => setValue("radius", v)}
              step="any"
              min={0.0001}
              placeholder="5"
            />
            <InputField
              id="height"
              label={tMath("height")}
              value={values.height}
              onChange={(v) => setValue("height", v)}
              step="any"
              min={0.0001}
              placeholder="10"
            />
          </>
        );
      case "pyramid":
      case "prism":
        return (
          <>
            <InputField
              id="baseArea"
              label={tMath("baseArea")}
              value={values.baseArea}
              onChange={(v) => setValue("baseArea", v)}
              step="any"
              min={0.0001}
              placeholder="25"
            />
            <InputField
              id="height"
              label={tMath("height")}
              value={values.height}
              onChange={(v) => setValue("height", v)}
              step="any"
              min={0.0001}
              placeholder="10"
            />
          </>
        );
      case "torus":
        return (
          <>
            <InputField
              id="majorRadius"
              label={tMath("majorRadius")}
              value={values.majorRadius}
              onChange={(v) => setValue("majorRadius", v)}
              step="any"
              min={0.0001}
              placeholder="10"
            />
            <InputField
              id="minorRadius"
              label={tMath("minorRadius")}
              value={values.minorRadius}
              onChange={(v) => setValue("minorRadius", v)}
              step="any"
              min={0.0001}
              placeholder="3"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{tMath("shape")}</Label>
          <Select
            value={values.shape}
            onValueChange={(v) => setValue("shape", v as FormValues["shape"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cube">{tMath("cube")}</SelectItem>
              <SelectItem value="rectangular">{tMath("rectangularPrism")}</SelectItem>
              <SelectItem value="sphere">{tMath("sphere")}</SelectItem>
              <SelectItem value="cylinder">{tMath("cylinder")}</SelectItem>
              <SelectItem value="cone">{tMath("cone")}</SelectItem>
              <SelectItem value="pyramid">{tMath("pyramid")}</SelectItem>
              <SelectItem value="prism">{tMath("prism")}</SelectItem>
              <SelectItem value="torus">{tMath("torus")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {renderInputs()}
        </div>
      </div>

      {volumeResult && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <OutputDisplay
              label={tMath("volume")}
              value={volumeResult.volume.toFixed(4)}
              unit={volumeResult.unit}
              size="lg"
            />
            <OutputDisplay
              label={tMath("surfaceArea")}
              value={volumeResult.surfaceArea.toFixed(4)}
              unit="sq units"
              size="lg"
            />
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{tMath("formula")}:</p>
            <p className="text-sm text-muted-foreground font-mono">{volumeResult.formula}</p>
          </div>

          {volumeResult.steps.length > 0 && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium">{tMath("steps")}:</p>
              {volumeResult.steps.map((step, i) => (
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
