"use client";

import { useState } from "react";
import { ResultGrid } from "@/components/converter";
import { calculateFrameRateConversion, COMMON_FRAME_RATES } from "@/lib/converters/video/frame-rate";

export function FrameRateConverter() {
  const [sourceFps, setSourceFps] = useState("24");
  const [targetFps, setTargetFps] = useState("30");

  const result = calculateFrameRateConversion(parseFloat(sourceFps) || 0, parseFloat(targetFps) || 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Source Frame Rate</label>
          <select value={sourceFps} onChange={(e) => setSourceFps(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background">
            {COMMON_FRAME_RATES.map((f) => (<option key={f.fps} value={f.fps}>{f.name}</option>))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Frame Rate</label>
          <select value={targetFps} onChange={(e) => setTargetFps(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background">
            {COMMON_FRAME_RATES.map((f) => (<option key={f.fps} value={f.fps}>{f.name}</option>))}
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <ResultGrid
            results={[
              { label: "Speed Change", value: result.speedChange > 0 ? `+${result.speedChange}` : result.speedChange, unit: "%" },
              { label: "Duration Change", value: result.durationChange > 0 ? `+${result.durationChange}` : result.durationChange, unit: "%" },
            ]}
            columns={2}
          />

          <div className="p-4 rounded-lg border bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Conversion Method</p>
            <p className="text-xl font-semibold">{result.conversionMethod}</p>
            <p className="text-sm text-muted-foreground mt-1">Audio: {result.audioAdjustment}</p>
          </div>

          {result.warnings.length > 0 && (
            <div className="p-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">Warnings</p>
              <ul className="text-sm space-y-1">
                {result.warnings.map((w, i) => (<li key={i}>• {w}</li>))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">FFmpeg Command</p>
              <pre className="p-3 rounded-lg bg-muted text-sm font-mono overflow-x-auto">{result.ffmpegCommand}</pre>
            </div>
            {result.soxCommand && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Sox Audio Command</p>
                <pre className="p-3 rounded-lg bg-muted text-sm font-mono overflow-x-auto">{result.soxCommand}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
