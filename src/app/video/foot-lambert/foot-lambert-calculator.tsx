"use client";

import { useState } from "react";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { calculateFootLambert, REFERENCE_VALUES } from "@/lib/converters/video/foot-lambert";

export function FootLambertCalculator() {
  const [value, setValue] = useState("14");
  const [unit, setUnit] = useState<"fl" | "nits" | "lumens">("fl");
  const [screenWidth, setScreenWidth] = useState("40");
  const [screenHeight, setScreenHeight] = useState("17");

  const result = calculateFootLambert(
    parseFloat(value) || 0,
    unit,
    unit === "lumens" ? parseFloat(screenWidth) : undefined,
    unit === "lumens" ? parseFloat(screenHeight) : undefined
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InputField id="value" label="Value" value={value} onChange={setValue} min={0.1} step={0.1} />
        <div className="space-y-2">
          <label className="text-sm font-medium">Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value as "fl" | "nits" | "lumens")} className="w-full h-10 px-3 rounded-md border bg-background">
            <option value="fl">Foot-Lamberts (fL)</option>
            <option value="nits">Nits (cd/m²)</option>
            <option value="lumens">Lumens</option>
          </select>
        </div>
        {unit === "lumens" && (
          <>
            <InputField id="screenWidth" label="Screen Width" value={screenWidth} onChange={setScreenWidth} unit="ft" min={1} />
            <InputField id="screenHeight" label="Screen Height" value={screenHeight} onChange={setScreenHeight} unit="ft" min={1} />
          </>
        )}
      </div>

      {result && (
        <div className="space-y-6">
          <ResultGrid
            results={[
              { label: "Foot-Lamberts", value: result.footLamberts, unit: "fL" },
              { label: "Nits", value: result.nits, unit: "cd/m²" },
              ...(result.lumens > 0 ? [{ label: "Lumens", value: result.lumens, unit: "lm" }] : []),
            ]}
            columns={result.lumens > 0 ? 3 : 2}
          />

          <div className="p-4 rounded-lg border bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Brightness Level</p>
            <p className="text-xl font-semibold">{result.description}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.useCase}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Reference Values</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left py-2">Standard</th><th className="text-right py-2">Foot-Lamberts</th><th className="text-left py-2 pl-4">Note</th></tr></thead>
                <tbody>
                  {REFERENCE_VALUES.map((ref) => (
                    <tr key={ref.name} className={`border-b border-muted ${Math.abs(ref.fl - result.footLamberts) < 2 ? "bg-primary/10" : ""}`}>
                      <td className="py-2 font-medium">{ref.name}</td>
                      <td className="py-2 text-right font-mono">{ref.fl} fL</td>
                      <td className="py-2 pl-4 text-muted-foreground">{ref.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
