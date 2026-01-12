"use client";

import { useState } from "react";
import { InputField, OutputDisplay } from "@/components/converter";
import {
  calculateDownloadTime,
  FILE_SIZE_UNITS,
  SPEED_UNITS,
  BANDWIDTH_PRESETS,
  FILE_SIZE_PRESETS,
} from "@/lib/converters/data/download-calculator";

export function DownloadCalculator() {
  const [fileSize, setFileSize] = useState("4");
  const [fileSizeUnit, setFileSizeUnit] = useState("GB");
  const [bandwidth, setBandwidth] = useState("100");
  const [bandwidthUnit, setBandwidthUnit] = useState("mbps");

  const result = calculateDownloadTime(
    parseFloat(fileSize) || 0,
    fileSizeUnit,
    parseFloat(bandwidth) || 0,
    bandwidthUnit
  );

  return (
    <div className="space-y-6">
      {/* File Size Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">File Size</label>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="fileSize"
            label=""
            value={fileSize}
            onChange={setFileSize}
            min={0}
            step={0.1}
            placeholder="Enter file size"
          />
          <select
            value={fileSizeUnit}
            onChange={(e) => setFileSizeUnit(e.target.value)}
            className="h-10 px-3 rounded-md border bg-background"
          >
            {FILE_SIZE_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILE_SIZE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setFileSize(preset.size.toString());
                setFileSizeUnit(preset.unit);
              }}
              className="text-xs px-2 py-1 rounded border hover:bg-muted/50"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bandwidth Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Connection Speed</label>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="bandwidth"
            label=""
            value={bandwidth}
            onChange={setBandwidth}
            min={0}
            step={1}
            placeholder="Enter speed"
          />
          <select
            value={bandwidthUnit}
            onChange={(e) => setBandwidthUnit(e.target.value)}
            className="h-10 px-3 rounded-md border bg-background"
          >
            {SPEED_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {BANDWIDTH_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setBandwidth(preset.speed.toString());
                setBandwidthUnit(preset.unit);
              }}
              className="text-xs px-2 py-1 rounded border hover:bg-muted/50"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <OutputDisplay
            label="Estimated Download Time"
            value={result.formatted}
            size="lg"
          />

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <div className="p-3 rounded-md border bg-muted/50 text-center">
              <p className="text-2xl font-mono font-bold">{result.days}</p>
              <p className="text-sm text-muted-foreground">Days</p>
            </div>
            <div className="p-3 rounded-md border bg-muted/50 text-center">
              <p className="text-2xl font-mono font-bold">{result.hours}</p>
              <p className="text-sm text-muted-foreground">Hours</p>
            </div>
            <div className="p-3 rounded-md border bg-muted/50 text-center">
              <p className="text-2xl font-mono font-bold">{result.minutes}</p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div className="p-3 rounded-md border bg-muted/50 text-center">
              <p className="text-2xl font-mono font-bold">{result.seconds}</p>
              <p className="text-sm text-muted-foreground">Seconds</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Total: {result.totalSeconds.toLocaleString(undefined, { maximumFractionDigits: 1 })} seconds
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
