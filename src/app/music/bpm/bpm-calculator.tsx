"use client";

import { useState } from "react";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { calculateBPM, getTempoMarking } from "@/lib/converters/music/bpm";

export function BPMCalculator() {
  const [bpm, setBpm] = useState("120");

  const numBpm = parseFloat(bpm) || 0;
  const result = calculateBPM(numBpm);
  const tempoMarking = numBpm > 0 ? getTempoMarking(numBpm) : "";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="bpm"
          label="Tempo"
          value={bpm}
          onChange={setBpm}
          unit="BPM"
          min={1}
          max={999}
          step={1}
          placeholder="Enter BPM"
        />
        {tempoMarking && (
          <div className="flex items-end">
            <div className="p-3 rounded-md border bg-muted/50 w-full">
              <p className="text-sm text-muted-foreground">Tempo Marking</p>
              <p className="text-lg font-medium">{tempoMarking}</p>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6">
          <ResultGrid
            results={[
              { label: "Frequency", value: result.hz, unit: "Hz" },
              { label: "Beat Duration", value: result.msPerBeat, unit: "ms" },
              { label: "Beats per Second", value: result.beatsPerSec, unit: "bps" },
              { label: "4/4 Bar Length", value: result.barLength4_4, unit: "ms" },
            ]}
            columns={2}
          />

          <div className="space-y-2">
            <h3 className="font-medium">Note Durations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Note</th>
                    <th className="text-left py-2 font-medium">Symbol</th>
                    <th className="text-right py-2 font-medium">Beats</th>
                    <th className="text-right py-2 font-medium">Duration (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.noteValues.map((note) => (
                    <tr key={note.name} className="border-b border-muted">
                      <td className="py-2">{note.name}</td>
                      <td className="py-2 font-mono">{note.symbol}</td>
                      <td className="py-2 text-right font-mono">{note.beats}</td>
                      <td className="py-2 text-right font-mono">
                        {note.durationMs.toFixed(2)}
                      </td>
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
