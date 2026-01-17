"use client";

import { useState } from "react";
import {
  formatTableDistance,
  generateDoFTable,
  TABLE_APERTURES,
  TABLE_DISTANCES,
  TABLE_FOCAL_LENGTHS,
  TABLE_SENSORS,
} from "@/lib/converters/photo/dof-table";

export function DoFTableCalculator() {
  const [focalLength, setFocalLength] = useState("50");
  const [sensorPreset, setSensorPreset] = useState("Full Frame (35mm)");
  const [displayMode, setDisplayMode] = useState<"total" | "near" | "far">("total");

  const sensor = TABLE_SENSORS.find((s) => s.name === sensorPreset) || TABLE_SENSORS[0];

  const table = generateDoFTable({
    focalLength: parseFloat(focalLength) || 50,
    coc: sensor.coc,
    apertures: TABLE_APERTURES,
    distances: TABLE_DISTANCES,
  });

  // Calculate hyperfocal distances for each aperture
  const hyperfocalDistances = TABLE_APERTURES.map((aperture) => {
    const f = (parseFloat(focalLength) || 50) / 1000;
    const c = sensor.coc / 1000;
    return (f * f) / (aperture * c) + f;
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Focal Length</label>
          <select
            value={focalLength}
            onChange={(e) => setFocalLength(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {TABLE_FOCAL_LENGTHS.map((fl) => (
              <option key={fl} value={fl}>
                {fl}mm
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sensor Size</label>
          <select
            value={sensorPreset}
            onChange={(e) => setSensorPreset(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {TABLE_SENSORS.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Display</label>
          <select
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value as "total" | "near" | "far")}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            <option value="total">Total DoF</option>
            <option value="near">Near Limit</option>
            <option value="far">Far Limit</option>
          </select>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="font-medium mb-2">Settings</p>
        <div className="text-sm text-muted-foreground">
          <p>
            Focal Length: <strong>{focalLength}mm</strong> | Sensor: <strong>{sensorPreset}</strong>{" "}
            | CoC: <strong>{sensor.coc}mm</strong>
          </p>
        </div>
      </div>

      {/* DoF Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 sticky left-0 bg-background">f/</th>
              {TABLE_DISTANCES.map((dist) => (
                <th key={dist} className="text-center py-2 px-2 min-w-[70px]">
                  {formatTableDistance(dist)}
                </th>
              ))}
              <th className="text-center py-2 px-2 bg-amber-500/10">Hyperfocal</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, rowIndex) => {
              const aperture = TABLE_APERTURES[rowIndex];
              const hyperfocal = hyperfocalDistances[rowIndex];

              return (
                <tr key={aperture} className="border-b border-muted hover:bg-muted/20">
                  <td className="py-2 px-2 font-medium sticky left-0 bg-background">
                    f/{aperture}
                  </td>
                  {row.map((cell) => {
                    let value: number;
                    switch (displayMode) {
                      case "near":
                        value = cell.nearLimit;
                        break;
                      case "far":
                        value = cell.farLimit;
                        break;
                      default:
                        value = cell.totalDoF;
                    }

                    // Highlight cells where far limit is infinity
                    const isInfinity = cell.farLimit === Infinity;
                    // Highlight if distance >= hyperfocal
                    const isAtHyperfocal = cell.distance >= hyperfocal;

                    return (
                      <td
                        key={`cell-${cell.distance}`}
                        className={`py-2 px-2 text-center ${
                          isInfinity
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : isAtHyperfocal
                              ? "bg-blue-500/10"
                              : ""
                        }`}
                      >
                        {formatTableDistance(value)}
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 text-center bg-amber-500/10 font-medium">
                    {formatTableDistance(hyperfocal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/50" />
          <span className="text-muted-foreground">Infinity focus (far limit = ∞)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/50" />
          <span className="text-muted-foreground">Hyperfocal distance</span>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="font-medium mb-2">Understanding the Table</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            &#8226; <strong>Total DoF:</strong> The total depth from near to far that appears sharp
          </li>
          <li>
            &#8226; <strong>Near Limit:</strong> Closest distance that appears sharp
          </li>
          <li>
            &#8226; <strong>Far Limit:</strong> Farthest distance that appears sharp (∞ = infinity)
          </li>
          <li>
            &#8226; <strong>Hyperfocal:</strong> Focus here for maximum DoF extending to infinity
          </li>
          <li>&#8226; Green cells indicate the far limit reaches infinity</li>
        </ul>
      </div>
    </div>
  );
}
