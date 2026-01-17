"use client";

import { useState } from "react";
import { COMMON_APERTURES } from "@/lib/converters/photo/depth-of-field";
import {
  calculateDiffraction,
  DIFFRACTION_SENSOR_PRESETS,
  LIGHT_WAVELENGTHS,
} from "@/lib/converters/photo/diffraction";

export function DiffractionCalculator() {
  const [aperture, setAperture] = useState("11");
  const [sensorPreset, setSensorPreset] = useState("Full Frame 24MP");
  const [wavelength, setWavelength] = useState("550");

  const sensor =
    DIFFRACTION_SENSOR_PRESETS.find((s) => s.name === sensorPreset) ||
    DIFFRACTION_SENSOR_PRESETS[0];

  const result = calculateDiffraction({
    aperture: parseFloat(aperture) || 0,
    sensorWidth: sensor.width,
    sensorHeight: sensor.height,
    megapixels: sensor.megapixels,
    wavelength: parseFloat(wavelength) || 550,
  });

  // Calculate diffraction for all common apertures to show chart
  const apertureData = COMMON_APERTURES.map((ap) => {
    const data = calculateDiffraction({
      aperture: ap,
      sensorWidth: sensor.width,
      sensorHeight: sensor.height,
      megapixels: sensor.megapixels,
      wavelength: parseFloat(wavelength) || 550,
    });
    return { aperture: ap, ...data };
  });

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Aperture</label>
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
          <label className="text-sm font-medium">Camera/Sensor</label>
          <select
            value={sensorPreset}
            onChange={(e) => setSensorPreset(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {DIFFRACTION_SENSOR_PRESETS.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Light Wavelength</label>
          <select
            value={wavelength}
            onChange={(e) => setWavelength(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {LIGHT_WAVELENGTHS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className={`p-4 rounded-lg border ${
                result.isDiffractionLimited ? "bg-red-500/10" : "bg-green-500/10"
              }`}
            >
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-xl font-bold">
                {result.isDiffractionLimited ? "Diffraction Limited" : "Within Optimal Range"}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm text-muted-foreground">Airy Disk</p>
              <p className="text-2xl font-bold">{result.airyDiskDiameter} µm</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-sm text-muted-foreground">Pixel Pitch</p>
              <p className="text-2xl font-bold">{result.pixelPitch} µm</p>
            </div>
            <div className="p-4 rounded-lg border bg-amber-500/10">
              <p className="text-sm text-muted-foreground">Diffraction Limit</p>
              <p className="text-2xl font-bold">f/{result.diffractionLimitAperture}</p>
            </div>
          </div>

          {/* Sharpness Impact */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="font-medium mb-2">Sharpness Impact</p>
            <p className="text-muted-foreground">{result.sharpnessImpact}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Optimal aperture range: <strong>f/{result.optimalApertureRange.min}</strong> to{" "}
              <strong>f/{result.optimalApertureRange.max}</strong>
            </p>
          </div>

          {/* Notes */}
          {result.notes.length > 0 && (
            <div className="p-4 rounded-lg border bg-blue-500/10">
              <p className="font-medium mb-2">Analysis</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {result.notes.map((note) => (
                  <li key={note}>&#8226; {note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Aperture Comparison Chart */}
      <div className="space-y-4">
        <p className="text-sm font-medium">Diffraction by Aperture</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">Aperture</th>
                <th className="text-left py-2 px-2">Airy Disk</th>
                <th className="text-left py-2 px-2">vs Pixel</th>
                <th className="text-left py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {apertureData.map((data) => {
                if (!data) return null;
                const ratio = data.airyDiskDiameter! / data.pixelPitch!;
                const isSelected = data.aperture === parseFloat(aperture);

                return (
                  <tr
                    key={data.aperture}
                    className={`border-b border-muted ${
                      isSelected ? "bg-primary/10" : ""
                    } ${data.isDiffractionLimited ? "text-red-600 dark:text-red-400" : ""}`}
                  >
                    <td className="py-2 px-2 font-medium">f/{data.aperture}</td>
                    <td className="py-2 px-2">{data.airyDiskDiameter?.toFixed(2)} µm</td>
                    <td className="py-2 px-2">{(ratio * 100).toFixed(0)}%</td>
                    <td className="py-2 px-2">
                      {data.isDiffractionLimited ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-500/20">
                          Limited
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-500/20">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="space-y-4">
        <p className="text-sm font-medium">Visual Comparison</p>
        <div className="space-y-2">
          {apertureData.slice(0, 8).map((data) => {
            if (!data) return null;
            const ratio = Math.min(data.airyDiskDiameter! / data.pixelPitch!, 2);
            const widthPercent = (ratio / 2) * 100;

            return (
              <div key={data.aperture} className="flex items-center gap-2">
                <span className="w-12 text-sm font-medium">f/{data.aperture}</span>
                <div className="flex-1 h-6 bg-muted rounded overflow-hidden relative">
                  <div
                    className={`h-full transition-all ${
                      data.isDiffractionLimited ? "bg-red-500/50" : "bg-green-500/50"
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  />
                  {/* Pixel pitch marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-foreground/50"
                    style={{ left: "50%" }}
                  />
                </div>
                <span className="w-16 text-xs text-muted-foreground">
                  {data.airyDiskDiameter?.toFixed(1)}µm
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Vertical line = pixel pitch ({result?.pixelPitch}µm). Bars exceeding this are
          diffraction-limited.
        </p>
      </div>

      {/* Formula Reference */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="font-medium mb-2">Diffraction Formula</p>
        <p className="text-sm font-mono text-muted-foreground mb-2">
          Airy Disk Diameter = 2.44 × λ × N
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Where:</p>
          <ul className="ml-4">
            <li>λ = wavelength of light (typically 550nm for green)</li>
            <li>N = f-number (aperture)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
