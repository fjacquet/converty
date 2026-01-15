"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResultGrid } from "@/components/converter";
import {
  type NumberSequenceInput,
  type NumberSequenceResult,
  calculateNumberSequence,
} from "@/lib/converters/math/number-sequence";

type Mode = NumberSequenceInput["mode"];

const modes: { value: Mode; label: string }[] = [
  { value: "arithmetic", label: "Arithmetic Sequence" },
  { value: "geometric", label: "Geometric Sequence" },
  { value: "fibonacci", label: "Fibonacci Sequence" },
  { value: "custom", label: "Analyze Custom Sequence" },
  { value: "findPattern", label: "Find Pattern" },
];

export function NumberSequenceCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");
  const tMath = useTranslations("calculator.math");

  const [mode, setMode] = useState<Mode>("arithmetic");
  const [firstTerm, setFirstTerm] = useState(1);
  const [commonDifference, setCommonDifference] = useState(2);
  const [commonRatio, setCommonRatio] = useState(2);
  const [numberOfTerms, setNumberOfTerms] = useState(10);
  const [findNthTerm, setFindNthTerm] = useState<number | undefined>(undefined);
  const [customTerms, setCustomTerms] = useState("1, 3, 5, 7, 9");
  const [result, setResult] = useState<NumberSequenceResult | null>(null);

  const needsFirstTerm = mode === "arithmetic" || mode === "geometric";
  const needsDifference = mode === "arithmetic";
  const needsRatio = mode === "geometric";
  const needsCustomTerms = mode === "custom" || mode === "findPattern";

  const calculate = useCallback(() => {
    const terms = needsCustomTerms
      ? customTerms
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n))
      : undefined;

    const input: NumberSequenceInput = {
      mode,
      firstTerm: needsFirstTerm ? firstTerm : undefined,
      commonDifference: needsDifference ? commonDifference : undefined,
      commonRatio: needsRatio ? commonRatio : undefined,
      numberOfTerms,
      findNthTerm: findNthTerm || undefined,
      terms,
    };

    setResult(calculateNumberSequence(input));
  }, [
    mode,
    firstTerm,
    commonDifference,
    commonRatio,
    numberOfTerms,
    findNthTerm,
    customTerms,
    needsFirstTerm,
    needsDifference,
    needsRatio,
    needsCustomTerms,
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {tMath("numberSequence") || "Number Sequence Calculator"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("sequenceType") || "Sequence Type"}</Label>
            <Select
              value={mode}
              onValueChange={(v) => {
                setMode(v as Mode);
                setResult(null);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modes.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {needsFirstTerm && (
            <div className="space-y-2">
              <Label>{t("firstTerm") || "First Term (a₁)"}</Label>
              <Input
                type="number"
                value={firstTerm}
                onChange={(e) => {
                  setFirstTerm(Number(e.target.value));
                  setResult(null);
                }}
              />
            </div>
          )}

          {needsDifference && (
            <div className="space-y-2">
              <Label>{t("commonDifference") || "Common Difference (d)"}</Label>
              <Input
                type="number"
                value={commonDifference}
                onChange={(e) => {
                  setCommonDifference(Number(e.target.value));
                  setResult(null);
                }}
              />
            </div>
          )}

          {needsRatio && (
            <div className="space-y-2">
              <Label>{t("commonRatio") || "Common Ratio (r)"}</Label>
              <Input
                type="number"
                step="0.1"
                value={commonRatio}
                onChange={(e) => {
                  setCommonRatio(Number(e.target.value));
                  setResult(null);
                }}
              />
            </div>
          )}

          {needsCustomTerms && (
            <div className="space-y-2">
              <Label>{t("customTerms") || "Enter Terms (comma-separated)"}</Label>
              <Input
                type="text"
                value={customTerms}
                onChange={(e) => {
                  setCustomTerms(e.target.value);
                  setResult(null);
                }}
                placeholder="1, 3, 5, 7, 9"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>{t("numberOfTerms") || "Number of Terms (n)"}</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={numberOfTerms}
              onChange={(e) => {
                setNumberOfTerms(Number(e.target.value));
                setResult(null);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("findNthTerm") || "Find Specific Term (optional)"}</Label>
            <Input
              type="number"
              min={1}
              value={findNthTerm || ""}
              onChange={(e) => {
                setFindNthTerm(
                  e.target.value ? Number(e.target.value) : undefined
                );
                setResult(null);
              }}
              placeholder="e.g., 50 for 50th term"
            />
          </div>

          <button
            type="button"
            onClick={calculate}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {t("calculate") || "Calculate"}
          </button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{result.sequenceType}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Formula</Label>
                <p className="text-lg font-mono">{result.formula}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  nth Term Formula
                </Label>
                <p className="text-lg font-mono">{result.nthTermFormula}</p>
              </div>
              {result.sumFormula && (
                <div>
                  <Label className="text-muted-foreground">Sum Formula</Label>
                  <p className="text-lg font-mono">{result.sumFormula}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{tResults("sequence") || "Sequence"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm break-all">
                {result.sequence.slice(0, 20).join(", ")}
                {result.sequence.length > 20 && "..."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{tResults("details") || "Details"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultGrid
                results={[
                  { label: "First Term", value: result.firstTerm.toString() },
                  ...(result.commonDifference !== undefined
                    ? [
                        {
                          label: "Common Difference (d)",
                          value: result.commonDifference.toString(),
                        },
                      ]
                    : []),
                  ...(result.commonRatio !== undefined
                    ? [
                        {
                          label: "Common Ratio (r)",
                          value: result.commonRatio.toFixed(6),
                        },
                      ]
                    : []),
                  { label: "Sum of Terms", value: result.sum.toLocaleString() },
                  ...(result.nthTerm !== undefined
                    ? [
                        {
                          label: `Term ${findNthTerm}`,
                          value: result.nthTerm.toLocaleString(),
                        },
                      ]
                    : []),
                  ...(result.isConvergent !== undefined
                    ? [
                        {
                          label: "Convergent",
                          value: result.isConvergent ? "Yes" : "No",
                        },
                      ]
                    : []),
                  ...(result.limit !== undefined
                    ? [
                        {
                          label: "Limit (S∞)",
                          value: result.limit.toFixed(6),
                        },
                      ]
                    : []),
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{tResults("steps") || "Calculation Steps"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm font-mono">
                {result.steps.map((step, i) => (
                  <li key={i} className="text-muted-foreground">
                    {step}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
