"use client";

import { useState } from "react";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { calculateAudioFilesize, AUDIO_FORMATS, DURATION_PRESETS, type AudioFormat } from "@/lib/converters/video/audio-filesize";

export function AudioFilesizeCalculator() {
  const [duration, setDuration] = useState("180");
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const [quality, setQuality] = useState<"low" | "typical" | "high">("typical");
  const [channels, setChannels] = useState<1 | 2>(2);

  const result = calculateAudioFilesize(parseInt(duration) || 0, format, quality, channels);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <InputField id="duration" label="Duration" value={duration} onChange={setDuration} unit="sec" min={1} />
          <div className="flex flex-wrap gap-1">
            {DURATION_PRESETS.map((p) => (
              <button key={p.name} onClick={() => setDuration(p.seconds.toString())} className="text-xs px-2 py-1 rounded border hover:bg-muted/50">{p.name}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value as AudioFormat)} className="w-full h-10 px-3 rounded-md border bg-background">
            {AUDIO_FORMATS.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Quality</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value as "low" | "typical" | "high")} className="w-full h-10 px-3 rounded-md border bg-background">
            <option value="low">Low</option>
            <option value="typical">Typical</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Channels</label>
          <select value={channels} onChange={(e) => setChannels(parseInt(e.target.value) as 1 | 2)} className="w-full h-10 px-3 rounded-md border bg-background">
            <option value="1">Mono</option>
            <option value="2">Stereo</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <OutputDisplay label="Estimated File Size" value={result.formatted} size="lg" />
          <ResultGrid
            results={[
              { label: "Bitrate", value: result.bitrate, unit: "kbps" },
              { label: "Size", value: result.estimatedMB, unit: "MB" },
            ]}
            columns={2}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Format</th><th className="text-left py-2">Type</th><th className="text-right py-2">Est. Size</th></tr></thead>
              <tbody>
                {AUDIO_FORMATS.map((f) => {
                  const est = calculateAudioFilesize(parseInt(duration) || 0, f.id, quality, channels);
                  return (
                    <tr key={f.id} className={`border-b border-muted ${f.id === format ? "bg-primary/10" : ""}`}>
                      <td className="py-2 font-medium">{f.name}</td>
                      <td className="py-2 text-muted-foreground">{f.description}</td>
                      <td className="py-2 text-right font-mono">{est?.formatted}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
