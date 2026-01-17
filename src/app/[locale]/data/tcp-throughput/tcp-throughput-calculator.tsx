"use client";

import { useTranslations } from "next-intl";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { createCalculatorStore } from "@/stores/calculator-store";
import {
  type TcpThroughputInput,
  type TcpThroughputResult,
  calculateTcpThroughput,
} from "@/lib/converters/network/tcp-throughput";

interface FormValues {
  mss: string;
  rtt: string;
  lossRate: string;
  cFactor: string;
}

const useStore = createCalculatorStore<FormValues, TcpThroughputResult>({
  name: "tcp-throughput",
  initialValues: {
    mss: "1460",
    rtt: "80",
    lossRate: "0.0001",
    cFactor: "1",
  },
  calculate: (vals) => {
    const input: TcpThroughputInput = {
      mss: parseFloat(vals.mss) || 1460,
      rtt: parseFloat(vals.rtt) || 1,
      lossRate: parseFloat(vals.lossRate) || 0.0001,
      cFactor: parseFloat(vals.cFactor) || 1,
    };
    return calculateTcpThroughput(input);
  },
});

export function TcpThroughputCalculator() {
  const t = useTranslations("calculator.network");
  const { values, setValue, result } = useStore();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="mss"
          label={t("mss")}
          value={values.mss}
          onChange={(v) => setValue("mss", v)}
          min={1}
          step="1"
          placeholder="1460"
        />
        <InputField
          id="rtt"
          label={t("rtt")}
          value={values.rtt}
          onChange={(v) => setValue("rtt", v)}
          min={0.1}
          step="0.1"
          placeholder="80"
        />
        <InputField
          id="lossRate"
          label={t("lossRate")}
          value={values.lossRate}
          onChange={(v) => setValue("lossRate", v)}
          min={0}
          step="0.0001"
          placeholder="0.0001"
        />
        <InputField
          id="cFactor"
          label={t("cFactor")}
          value={values.cFactor}
          onChange={(v) => setValue("cFactor", v)}
          min={0.5}
          max={2}
          step="0.01"
          placeholder="1"
        />
      </div>

      {result && (
        <div className="space-y-4">
          <OutputDisplay
            label={t("maxThroughput")}
            value={result.throughputMbps.toFixed(2)}
            unit="Mbps"
            size="lg"
          />

          <ResultGrid
            results={[
              { label: t("throughputGbps"), value: result.throughputGbps.toFixed(4), unit: "Gbps" },
              { label: t("throughputMbps"), value: result.throughputMbps.toFixed(2), unit: "Mbps" },
              { label: t("throughputKbps"), value: result.throughputKbps.toFixed(0), unit: "Kbps" },
              { label: t("throughputMBs"), value: result.throughputMBPerSec.toFixed(2), unit: "MB/s" },
            ]}
          />

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{t("formula")}:</p>
            <p className="text-sm text-muted-foreground font-mono">{result.formula}</p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">{t("calculationSteps")}:</p>
            <div className="text-sm text-muted-foreground font-mono space-y-1">
              {result.steps.map((step, i) => (
                <p key={i}>{step}</p>
              ))}
            </div>
          </div>

          {result.recommendations.length > 0 && (
            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 space-y-2">
              <p className="text-sm font-medium">{t("recommendations")}:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                {result.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
