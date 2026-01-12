"use client";

import { useState } from "react";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { calculateVideoBitrate, COMMON_RESOLUTIONS, COMMON_FRAMERATES } from "@/lib/converters/video/video-bitrate";

export function VideoBitrateCalculator() {
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [fps, setFps] = useState("30");
  const [bitDepth, setBitDepth] = useState<8 | 10 | 12>(8);
  const [codec, setCodec] = useState<"h264" | "h265" | "prores" | "raw">("h264");
  const [quality, setQuality] = useState<"low" | "medium" | "high" | "lossless">("medium");

  const result = calculateVideoBitrate(parseInt(width) || 0, parseInt(height) || 0, parseInt(fps) || 0, bitDepth, codec, quality);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <InputField id="width" label="Width" value={width} onChange={setWidth} unit="px" min={1} />
            <InputField id="height" label="Height" value={height} onChange={setHeight} unit="px" min={1} />
          </div>
          <div className="flex flex-wrap gap-1">
            {COMMON_RESOLUTIONS.slice(1, 5).map((r) => (
              <button key={r.name} onClick={() => { setWidth(r.width.toString()); setHeight(r.height.toString()); }} className="text-xs px-2 py-1 rounded border hover:bg-muted/50">{r.name}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Frame Rate</label>
          <select value={fps} onChange={(e) => setFps(e.target.value)} className="w-full h-10 px-3 rounded-md border bg-background">
            {COMMON_FRAMERATES.map((f) => (<option key={f} value={f}>{f} fps</option>))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Bit Depth</label>
          <select value={bitDepth} onChange={(e) => setBitDepth(parseInt(e.target.value) as 8 | 10 | 12)} className="w-full h-10 px-3 rounded-md border bg-background">
            <option value="8">8-bit</option>
            <option value="10">10-bit</option>
            <option value="12">12-bit</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Codec</label>
          <select value={codec} onChange={(e) => setCodec(e.target.value as "h264" | "h265" | "prores" | "raw")} className="w-full h-10 px-3 rounded-md border bg-background">
            <option value="h264">H.264 / AVC</option>
            <option value="h265">H.265 / HEVC</option>
            <option value="prores">ProRes</option>
            <option value="raw">RAW</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Quality</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value as "low" | "medium" | "high" | "lossless")} className="w-full h-10 px-3 rounded-md border bg-background">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="lossless">Lossless</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <OutputDisplay label="Estimated Bitrate" value={`${result.bitrateMbps} Mbps`} size="lg" />

          <ResultGrid
            results={[
              { label: "Bitrate", value: result.bitrateKbps.toLocaleString(), unit: "kbps" },
              { label: "Bits/Pixel", value: result.bitsPerPixel },
            ]}
            columns={2}
          />

          <div className="p-4 rounded-lg border bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Quality Assessment</p>
            <p className="text-xl font-semibold">{result.qualityLevel}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
