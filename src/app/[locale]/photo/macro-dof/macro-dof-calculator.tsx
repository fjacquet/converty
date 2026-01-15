"use client";

import { useState } from "react";
import { COMMON_APERTURES } from "@/lib/converters/photo/depth-of-field";
import {
  COMMON_MAGNIFICATIONS,
  calculateFocusStackShots,
  calculateMacroDoFWithFocalLength,
  MACRO_SENSOR_COC,
} from "@/lib/converters/photo/macro-dof";

export function MacroDoFCalculator() {
  const [aperture, setAperture] = useState("8");
  const [magnification, setMagnification] = useState("1");
  const [sensorPreset, setSensorPreset] = useState("Full Frame");
  const [focalLength, setFocalLength] = useState("100");
  const [pupilRatio, setPupilRatio] = useState("1");

  // For focus stacking calculation
  const [totalDepthNeeded, setTotalDepthNeeded] = useState("10");

  const sensor = MACRO_SENSOR_COC.find((s) => s.name === sensorPreset) || MACRO_SENSOR_COC[0];

  const result = calculateMacroDoFWithFocalLength(
    parseFloat(aperture) || 0,
    parseFloat(magnification) || 0,
    sensor.coc,
    parseFloat(focalLength) || 0,
    parseFloat(pupilRatio) || 1
  );

  const focusStackShots = calculateFocusStackShots(
    parseFloat(totalDepthNeeded) || 0,
    parseFloat(aperture) || 0,
    parseFloat(magnification) || 0,
    sensor.coc
  );

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Aperture (f/)</label>
          <select
            value={aperture}
            onChange={(e) => setAperture(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {COMMON_APERTURES.map((a) => (
              <option key={a} value={a}>
                f/{a}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Magnification</label>
          <select
            value={magnification}
            onChange={(e) => setMagnification(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {COMMON_MAGNIFICATIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            {COMMON_MAGNIFICATIONS.find((m) => m.value === parseFloat(magnification))
              ?.description || ""}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sensor Size</label>
          <select
            value={sensorPreset}
            onChange={(e) => setSensorPreset(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {MACRO_SENSOR_COC.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} (CoC: {s.coc}mm)
              </option>
            ))}
          </select>
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
              max="500"
            />
            <span className="flex items-center text-sm text-muted-foreground">mm</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {[50, 60, 90, 100, 105, 180].map((fl) => (
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
          <label className="text-sm font-medium">Pupil Ratio (Advanced)</label>
          <input
            type="number"
            value={pupilRatio}
            onChange={(e) => setPupilRatio(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background"
            min="0.1"
            max="3"
            step="0.1"
          />
          <p className="text-xs text-muted-foreground">
            1.0 for symmetric lenses. Different for retrofocus/telephoto designs.
          </p>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg border bg-primary/10">
              <p className="text-sm text-muted-foreground">Total Depth of Field</p>
              <p className="text-2xl font-bold">{result.totalDoF} mm</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm text-muted-foreground">In Front of Focus</p>
              <p className="text-2xl font-bold">{result.inFront} mm</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm text-muted-foreground">Behind Focus</p>
              <p className="text-2xl font-bold">{result.behind} mm</p>
            </div>
            <div className="p-4 rounded-lg border bg-amber-500/10">
              <p className="text-sm text-muted-foreground">Effective Aperture</p>
              <p className="text-2xl font-bold">f/{result.effectiveAperture}</p>
              <p className="text-xs text-muted-foreground">
                {result.effectiveAperture > parseFloat(aperture) * 1.5
                  ? "Significant light loss"
                  : "Moderate light loss"}
              </p>
            </div>
          </div>

          {result.workingDistance && (
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm text-muted-foreground">Approximate Working Distance</p>
              <p className="text-xl font-bold">
                {result.workingDistance < 1000
                  ? `${result.workingDistance} mm`
                  : `${(result.workingDistance / 10).toFixed(1)} cm`}
              </p>
              <p className="text-xs text-muted-foreground">
                Distance from front of lens to subject (approximate)
              </p>
            </div>
          )}

          {/* Notes */}
          {result.notes.length > 0 && (
            <div className="p-4 rounded-lg border bg-amber-500/10">
              <p className="font-medium mb-2">Notes</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {result.notes.map((note, i) => (
                  <li key={i}>&#8226; {note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Focus Stacking Calculator */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="font-medium mb-4">Focus Stacking Calculator</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Depth Needed</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={totalDepthNeeded}
                onChange={(e) => setTotalDepthNeeded(e.target.value)}
                className="flex-1 h-10 px-3 rounded-md border bg-background"
                min="0.1"
                max="100"
                step="0.1"
              />
              <span className="flex items-center text-sm text-muted-foreground">mm</span>
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-primary/10">
            <p className="text-sm text-muted-foreground">Shots Required</p>
            <p className="text-2xl font-bold">{focusStackShots} shots</p>
            <p className="text-xs text-muted-foreground">With 30% overlap between frames</p>
          </div>
        </div>
      </div>

      {/* Reference */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="font-medium mb-2">Macro DoF Formula</p>
        <p className="text-sm font-mono text-muted-foreground mb-2">
          DoF = 2 × N × c × (m + 1) / m²
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Where:</p>
          <ul className="ml-4">
            <li>N = f-number (aperture)</li>
            <li>c = Circle of Confusion</li>
            <li>m = magnification ratio</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
