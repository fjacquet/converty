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
import { createCalculatorStore } from "@/stores/calculator-store";
import {
  type ProbabilityInput,
  type ProbabilityResult,
  calculateProbability,
} from "@/lib/converters/math/probability";

interface FormValues {
  mode: "single" | "and" | "or" | "conditional" | "complement" | "binomial" | "permutation" | "combination";
  probabilityA: string;
  probabilityB: string;
  probabilityAandB: string;
  n: string;
  r: string;
  trials: string;
  successes: string;
}

const useProbabilityStore = createCalculatorStore<FormValues, ProbabilityResult | null>({
  name: "probability-calculator",
  initialValues: {
    mode: "single",
    probabilityA: "0.5",
    probabilityB: "0.3",
    probabilityAandB: "0.15",
    n: "10",
    r: "3",
    trials: "10",
    successes: "3",
  },
  calculate: (vals) => {
    const input: ProbabilityInput = {
      mode: vals.mode,
      probabilityA: parseFloat(vals.probabilityA),
      probabilityB: parseFloat(vals.probabilityB),
      probabilityAandB: parseFloat(vals.probabilityAandB),
      n: parseInt(vals.n),
      r: parseInt(vals.r),
      trials: parseInt(vals.trials),
      successes: parseInt(vals.successes),
    };
    return calculateProbability(input);
  },
});

export function ProbabilityCalculator() {
  const tMath = useTranslations("calculator.math");

  const { values, setValue, result } = useProbabilityStore();

  const probabilityResult = result;

  const renderInputs = () => {
    switch (values.mode) {
      case "single":
        return (
          <InputField
            id="probabilityA"
            label={tMath("probabilityA")}
            value={values.probabilityA}
            onChange={(v) => setValue("probabilityA", v)}
            step="0.01"
            min={0}
            max={1}
            placeholder="0.5"
          />
        );
      case "and":
        return (
          <>
            <InputField
              id="probabilityA"
              label={tMath("probabilityA")}
              value={values.probabilityA}
              onChange={(v) => setValue("probabilityA", v)}
              step="0.01"
              min={0}
              max={1}
              placeholder="0.5"
            />
            <InputField
              id="probabilityB"
              label={tMath("probabilityB")}
              value={values.probabilityB}
              onChange={(v) => setValue("probabilityB", v)}
              step="0.01"
              min={0}
              max={1}
              placeholder="0.3"
            />
          </>
        );
      case "or":
        return (
          <>
            <InputField
              id="probabilityA"
              label={tMath("probabilityA")}
              value={values.probabilityA}
              onChange={(v) => setValue("probabilityA", v)}
              step="0.01"
              min={0}
              max={1}
              placeholder="0.5"
            />
            <InputField
              id="probabilityB"
              label={tMath("probabilityB")}
              value={values.probabilityB}
              onChange={(v) => setValue("probabilityB", v)}
              step="0.01"
              min={0}
              max={1}
              placeholder="0.3"
            />
            <InputField
              id="probabilityAandB"
              label={tMath("probabilityAandB")}
              value={values.probabilityAandB}
              onChange={(v) => setValue("probabilityAandB", v)}
              step="0.01"
              min={0}
              max={1}
              placeholder="0.15"
            />
          </>
        );
      case "conditional":
        return (
          <>
            <InputField
              id="probabilityAandB"
              label={tMath("probabilityAandB")}
              value={values.probabilityAandB}
              onChange={(v) => setValue("probabilityAandB", v)}
              step="0.01"
              min={0}
              max={1}
              placeholder="0.15"
            />
            <InputField
              id="probabilityB"
              label={tMath("probabilityB")}
              value={values.probabilityB}
              onChange={(v) => setValue("probabilityB", v)}
              step="0.01"
              min={0}
              max={1}
              placeholder="0.3"
            />
          </>
        );
      case "complement":
        return (
          <InputField
            id="probabilityA"
            label={tMath("probabilityA")}
            value={values.probabilityA}
            onChange={(v) => setValue("probabilityA", v)}
            step="0.01"
            min={0}
            max={1}
            placeholder="0.5"
          />
        );
      case "binomial":
        return (
          <>
            <InputField
              id="trials"
              label={tMath("numberOfTrials")}
              value={values.trials}
              onChange={(v) => setValue("trials", v)}
              step="1"
              min={1}
              placeholder="10"
            />
            <InputField
              id="successes"
              label={tMath("numberOfSuccesses")}
              value={values.successes}
              onChange={(v) => setValue("successes", v)}
              step="1"
              min={0}
              placeholder="3"
            />
            <InputField
              id="probabilityA"
              label={tMath("probabilityOfSuccess")}
              value={values.probabilityA}
              onChange={(v) => setValue("probabilityA", v)}
              step="0.01"
              min={0}
              max={1}
              placeholder="0.5"
            />
          </>
        );
      case "permutation":
      case "combination":
        return (
          <>
            <InputField
              id="n"
              label={tMath("totalItems")}
              value={values.n}
              onChange={(v) => setValue("n", v)}
              step="1"
              min={0}
              placeholder="10"
            />
            <InputField
              id="r"
              label={tMath("selectedItems")}
              value={values.r}
              onChange={(v) => setValue("r", v)}
              step="1"
              min={0}
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
          <Label>{tMath("calculationType")}</Label>
          <Select
            value={values.mode}
            onValueChange={(v) => setValue("mode", v as FormValues["mode"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">{tMath("singleEvent")}</SelectItem>
              <SelectItem value="and">{tMath("probabilityAnd")}</SelectItem>
              <SelectItem value="or">{tMath("probabilityOr")}</SelectItem>
              <SelectItem value="conditional">{tMath("conditionalProbability")}</SelectItem>
              <SelectItem value="complement">{tMath("complement")}</SelectItem>
              <SelectItem value="binomial">{tMath("binomialDistribution")}</SelectItem>
              <SelectItem value="permutation">{tMath("permutation")}</SelectItem>
              <SelectItem value="combination">{tMath("combination")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {renderInputs()}
        </div>
      </div>

      {probabilityResult && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <OutputDisplay
              label={tMath("probability")}
              value={probabilityResult.result.toFixed(6)}
              size="lg"
            />
            <OutputDisplay
              label={tMath("percentage")}
              value={probabilityResult.percentage.toFixed(2)}
              unit="%"
              size="lg"
            />
          </div>

          <ResultGrid
            results={[
              { label: tMath("oddsFor"), value: probabilityResult.odds.for },
              { label: tMath("oddsAgainst"), value: probabilityResult.odds.against },
            ]}
          />

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{tMath("formula")}:</p>
            <p className="text-sm text-muted-foreground font-mono">{probabilityResult.formula}</p>
            <p className="text-sm text-muted-foreground mt-2">{probabilityResult.explanation}</p>
          </div>

          {probabilityResult.steps.length > 0 && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium">{tMath("steps")}:</p>
              {probabilityResult.steps.map((step, i) => (
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
