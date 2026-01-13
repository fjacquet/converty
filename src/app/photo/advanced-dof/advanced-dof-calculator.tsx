"use client";

import { useState } from "react";
import {
  PRINT_SIZES,
  SENSOR_COC,
  VIEWING_DISTANCES,
  VISUAL_ACUITY_PRESETS,
} from "@/lib/converters/photo/circle-of-confusion";
import { COMMON_APERTURES } from "@/lib/converters/photo/depth-of-field";
import {
  calculateAdvancedDoF,
  COMMON_DISTANCES,
  formatDistance,
} from "@/lib/converters/photo/advanced-dof";

export function AdvancedDoFCalculator() {
  // Camera settings
  const [aperture, setAperture] = useState("5.6");
  const [focalLength, setFocalLength] = useState("50");
  const [subjectDistance, setSubjectDistance] = useState("3");

  // Sensor
  const [sensorPreset, setSensorPreset] = useState("Full Frame (35mm)");
  const sensor = SENSOR_COC.find((s) => s.name === sensorPreset) || SENSOR_COC[0];

  // Viewing conditions
  const [printWidth, setPrintWidth] = useState("254");
  const [viewingDistance, setViewingDistance] = useState("450");
  const [visualAcuity, setVisualAcuity] = useState("30");

  const result = calculateAdvancedDoF({
    aperture: parseFloat(aperture) || 0,
    focalLength: parseFloat(focalLength) || 0,
    subjectDistance: parseFloat(subjectDistance) || 0,
    sensorWidth: sensor.width,
    sensorHeight: sensor.height,
    printWidth: parseFloat(printWidth) || 0,
    viewingDistance: parseFloat(viewingDistance) || 0,
    visualAcuity: parseFloat(visualAcuity) || 0,
  });

  return (
    <div className="space-y-6">
      {/* Camera Settings */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="font-medium mb-4">Camera Settings</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sensor</label>
            <select
              value={sensorPreset}
              onChange={(e) => setSensorPreset(e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-background"
            >
              {SENSOR_COC.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Aperture (f/)</label>
            <div className="flex gap-2">
              <select
                value={aperture}
                onChange={(e) => setAperture(e.target.value)}
                className="flex-1 h-10 px-3 rounded-md border bg-background"
              >
                {COMMON_APERTURES.map((a) => (
                  <option key={a} value={a}>
                    f/{a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Focal Length</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={focalLength}
                onChange={(e) => setFocalLength(e.target.value)}
                className="flex-1 h-10 px-3 rounded-md border bg-background"
                min="1"
                max="2000"
              />
              <span className="flex items-center text-sm text-muted-foreground">mm</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {[24, 35, 50, 85, 135, 200].map((fl) => (
                <button
                  key={fl}
                  onClick={() => setFocalLength(String(fl))}
                  className={`px-2 py-1 text-xs rounded border ${
                    focalLength === String(fl)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {fl}mm
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subject Distance</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={subjectDistance}
                onChange={(e) => setSubjectDistance(e.target.value)}
                className="flex-1 h-10 px-3 rounded-md border bg-background"
                min="0.1"
                max="1000"
                step="0.1"
              />
              <span className="flex items-center text-sm text-muted-foreground">m</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {COMMON_DISTANCES.slice(0, 4).map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSubjectDistance(String(d.value))}
                  className={`px-2 py-1 text-xs rounded border ${
                    subjectDistance === String(d.value)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {d.value}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Viewing Conditions */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="font-medium mb-4">Viewing Conditions (for CoC adjustment)</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Print Width</label>
            <select
              value={printWidth}
              onChange={(e) => setPrintWidth(e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-background"
            >
              {PRINT_SIZES.map((size) => (
                <option key={size.label} value={size.width}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Viewing Distance</label>
            <select
              value={viewingDistance}
              onChange={(e) => setViewingDistance(e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-background"
            >
              {VIEWING_DISTANCES.map((dist) => (
                <option key={dist.label} value={dist.value}>
                  {dist.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Visual Acuity</label>
            <select
              value={visualAcuity}
              onChange={(e) => setVisualAcuity(e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-background"
            >
              {VISUAL_ACUITY_PRESETS.map((preset) => (
                <option key={preset.label} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Primary Results */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg border bg-primary/10">
              <p className="text-sm text-muted-foreground">Total Depth of Field</p>
              <p className="text-2xl font-bold">{formatDistance(result.totalDoF)}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm text-muted-foreground">Near Limit</p>
              <p className="text-2xl font-bold">{formatDistance(result.nearLimit)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistance(result.inFrontOfSubject)} in front
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm text-muted-foreground">Far Limit</p>
              <p className="text-2xl font-bold">{formatDistance(result.farLimit)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistance(result.behindSubject)} behind
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm text-muted-foreground">Hyperfocal Distance</p>
              <p className="text-2xl font-bold">{formatDistance(result.hyperfocalDistance)}</p>
            </div>
          </div>

          {/* CoC Comparison */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg border bg-blue-500/10">
              <p className="font-medium mb-2">Adjusted CoC (Your Conditions)</p>
              <p className="text-xl font-bold">{result.adjustedCoC} mm</p>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <p>Near: {formatDistance(result.nearLimit)}</p>
                <p>Far: {formatDistance(result.farLimit)}</p>
                <p>Total DoF: {formatDistance(result.totalDoF)}</p>
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="font-medium mb-2">Standard CoC</p>
              <p className="text-xl font-bold">{result.standardCoC} mm</p>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <p>Near: {formatDistance(result.comparison.standardNear)}</p>
                <p>Far: {formatDistance(result.comparison.standardFar)}</p>
                <p>Total DoF: {formatDistance(result.comparison.standardDoF)}</p>
              </div>
            </div>
          </div>

          {/* Difference Analysis */}
          {(result.comparison.differenceFront !== 0 || result.comparison.differenceBack !== 0) && (
            <div className="p-4 rounded-lg border bg-amber-500/10">
              <p className="font-medium mb-2">Difference from Standard</p>
              <div className="text-sm">
                {result.adjustedCoC < result.standardCoC ? (
                  <p>
                    Your viewing conditions are <strong>more demanding</strong> than standard. The
                    adjusted DoF is <strong>narrower</strong> - you need to be more precise with
                    focus.
                  </p>
                ) : (
                  <p>
                    Your viewing conditions are <strong>more relaxed</strong> than standard. The
                    adjusted DoF is <strong>wider</strong> - you have more margin for error.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
