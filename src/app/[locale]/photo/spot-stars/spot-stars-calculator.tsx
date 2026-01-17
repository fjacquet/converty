"use client";

import { useState } from "react";
import {
  CAMERA_PRESETS,
  calculateSpotStars,
  SENSOR_SIZES,
  SPOT_STARS_INFO,
} from "@/lib/converters/photo/spot-stars";

export function SpotStarsCalculator() {
  const [focalLength, setFocalLength] = useState(24);
  const [aperture, setAperture] = useState(2.8);
  const [sensorWidth, setSensorWidth] = useState(36);
  const [megapixels, setMegapixels] = useState(24);
  const [declination, setDeclination] = useState(0);
  const [accuracy, setAccuracy] = useState<"default" | "accurate">("default");

  const result = calculateSpotStars({
    focalLength,
    aperture,
    sensorWidth,
    megapixels,
    declination,
    accuracy,
  });

  const handlePresetCamera = (preset: (typeof CAMERA_PRESETS)[0]) => {
    setSensorWidth(preset.sensorWidth);
    setMegapixels(preset.megapixels);
  };

  const handleSensorSize = (sensor: (typeof SENSOR_SIZES)[0]) => {
    setSensorWidth(sensor.width);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Camera Preset</label>
          <select
            onChange={(e) => {
              const preset = CAMERA_PRESETS.find((p) => p.name === e.target.value);
              if (preset) handlePresetCamera(preset);
            }}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            <option value="">Select camera...</option>
            {CAMERA_PRESETS.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name} ({preset.megapixels}MP)
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sensor Size</label>
          <select
            value={SENSOR_SIZES.find((s) => Math.abs(s.width - sensorWidth) < 1)?.name || ""}
            onChange={(e) => {
              const sensor = SENSOR_SIZES.find((s) => s.name === e.target.value);
              if (sensor) handleSensorSize(sensor);
            }}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {SENSOR_SIZES.map((sensor) => (
              <option key={sensor.name} value={sensor.name}>
                {sensor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Megapixels</label>
          <input
            type="number"
            value={megapixels}
            onChange={(e) => setMegapixels(parseFloat(e.target.value) || 0)}
            min={1}
            max={200}
            step={0.1}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Focal Length (mm)</label>
          <input
            type="number"
            value={focalLength}
            onChange={(e) => setFocalLength(parseFloat(e.target.value) || 0)}
            min={8}
            max={800}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
          <div className="flex flex-wrap gap-2">
            {[14, 20, 24, 35, 50].map((fl) => (
              <button
                key={fl}
                onClick={() => setFocalLength(fl)}
                className="px-2 py-1 text-xs rounded border hover:bg-muted"
              >
                {fl}mm
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Aperture (f/)</label>
          <input
            type="number"
            value={aperture}
            onChange={(e) => setAperture(parseFloat(e.target.value) || 0)}
            min={1}
            max={22}
            step={0.1}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
          <div className="flex flex-wrap gap-2">
            {[1.4, 1.8, 2.8, 4].map((ap) => (
              <button
                key={ap}
                onClick={() => setAperture(ap)}
                className="px-2 py-1 text-xs rounded border hover:bg-muted"
              >
                f/{ap}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Declination (°)</label>
          <input
            type="number"
            value={declination}
            onChange={(e) => setDeclination(parseFloat(e.target.value) || 0)}
            min={-90}
            max={90}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
          <p className="text-xs text-muted-foreground">0° = celestial equator (use if unsure)</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Accuracy Mode</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={accuracy === "default"}
              onChange={() => setAccuracy("default")}
              className="w-4 h-4"
            />
            <span className="text-sm">Default (web/standard prints)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={accuracy === "accurate"}
              onChange={() => setAccuracy("accurate")}
              className="w-4 h-4"
            />
            <span className="text-sm">Accurate (large prints)</span>
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-lg border bg-primary/10 text-center">
          <p className="text-sm text-muted-foreground">NPF Rule (Recommended)</p>
          <p className="text-3xl font-bold text-primary">{result.npfRule}s</p>
        </div>
        <div className="p-4 rounded-lg border bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">500 Rule</p>
          <p className="text-2xl font-bold">{result.rule500}s</p>
        </div>
        <div className="p-4 rounded-lg border bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">400 Rule</p>
          <p className="text-2xl font-bold">{result.rule400}s</p>
        </div>
        <div className="p-4 rounded-lg border bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">Recommended</p>
          <p className="text-2xl font-bold">{result.recommended}s</p>
        </div>
      </div>

      <div className="p-4 rounded-lg border bg-primary/10">
        <p className="font-medium">{result.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-lg border bg-muted/30">
          <p className="font-medium mb-2">Rule Explanations</p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>
              <strong>NPF Rule:</strong> {SPOT_STARS_INFO.npfRule}
            </li>
            <li>
              <strong>500 Rule:</strong> {SPOT_STARS_INFO.rule500}
            </li>
            <li>
              <strong>400 Rule:</strong> {SPOT_STARS_INFO.rule400}
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border bg-muted/30">
          <p className="font-medium mb-2">Tips</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {SPOT_STARS_INFO.tips.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Common Camera Reference</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Camera</th>
                <th className="text-left py-2">Sensor Width</th>
                <th className="text-left py-2">Megapixels</th>
              </tr>
            </thead>
            <tbody>
              {CAMERA_PRESETS.map((camera) => (
                <tr
                  key={camera.name}
                  className="border-b border-muted hover:bg-muted/50 cursor-pointer"
                  onClick={() => handlePresetCamera(camera)}
                >
                  <td className="py-2">{camera.name}</td>
                  <td className="py-2">{camera.sensorWidth}mm</td>
                  <td className="py-2">{camera.megapixels}MP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
