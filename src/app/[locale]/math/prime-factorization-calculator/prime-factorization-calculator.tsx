"use client";

import { useTranslations } from "next-intl";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { Badge } from "@/components/ui/badge";
import { useConverter } from "@/hooks";
import {
  type PrimeFactorizationInput,
  type PrimeFactorizationResult,
  calculatePrimeFactorization,
} from "@/lib/converters/math/prime-factorization";

interface FormValues {
  number: string;
}

export function PrimeFactorizationCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");
  const tMath = useTranslations("calculator.math");

  const { values, setValue, result } = useConverter<FormValues, PrimeFactorizationResult | null>({
    initialValues: {
      number: "84",
    },
    calculate: (vals) => {
      const input: PrimeFactorizationInput = {
        number: parseInt(vals.number) || 0,
      };
      return { value: calculatePrimeFactorization(input) };
    },
  });

  const primeResult = result?.value;

  return (
    <div className="space-y-6">
      <InputField
        id="number"
        label={tMath("enterNumber")}
        value={values.number}
        onChange={(v) => setValue("number", v)}
        min={1}
        step="1"
        placeholder="84"
      />

      {primeResult && (
        <div className="space-y-4">
          {primeResult.isPrime && (
            <Badge variant="secondary">{tMath("primeNumber")}</Badge>
          )}

          <OutputDisplay
            label={tMath("primeFactorization")}
            value={primeResult.factorString}
            size="lg"
          />

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{tMath("expandedForm")}:</p>
            <p className="text-sm text-muted-foreground font-mono">{primeResult.expandedForm}</p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{tMath("factorTree")}:</p>
            <div className="text-sm text-muted-foreground font-mono space-y-1">
              {primeResult.factorTree.map((step, i) => (
                <p key={i}>{step}</p>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{tMath("allDivisors")}:</p>
            <p className="text-sm text-muted-foreground">
              {primeResult.allDivisors.join(", ")}
            </p>
          </div>

          <ResultGrid
            results={[
              { label: tMath("numberOfDivisors"), value: String(primeResult.divisorCount) },
              { label: tMath("sumOfDivisors"), value: String(primeResult.divisorSum) },
            ]}
          />
        </div>
      )}
    </div>
  );
}
