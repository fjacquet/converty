"use client";

import { useState } from "react";
import {
  BASE_SHUTTER_SPEEDS,
  calculateNDFilter,
  ND_FILTER_INFO,
  ND_FILTERS,
} from "@/lib/converters/photo/nd-filter";

export function NDFilterCalculator() {
  const [baseShutterSpeed, setBaseShutterSpeed] = useState(1 / 125);
  const [filterStops, setFilterStops] = useState(10);

  const result = calculateNDFilter({
    baseShutterSpeed,
    filterStops,
  });

  const formatBaseSpeed = (speed: number): string => {
    if (speed < 1) {
      return `1/${Math.round(1 / speed)}s`;
    }
    return `${speed}s`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Base Shutter Speed (without filter)</label>
          <select
            value={baseShutterSpeed}
            onChange={(e) => setBaseShutterSpeed(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {BASE_SHUTTER_SPEEDS.map((speed) => (
              <option key={speed.name} value={speed.value}>
                {speed.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            This is the correct exposure without any filter
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">ND Filter</label>
          <select
            value={filterStops}
            onChange={(e) => setFilterStops(parseFloat(e.target.value))}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {ND_FILTERS.map((filter) => (
              <option key={filter.name} value={filter.stops}>
                {filter.name} - {filter.stops} stops
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-lg border bg-primary/10 text-center">
          <p className="text-sm text-muted-foreground">New Shutter Speed</p>
          <p className="text-2xl font-bold text-primary">{result.newShutterSpeedFormatted}</p>
        </div>
        <div className="p-4 rounded-lg border bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">Base Speed</p>
          <p className="text-2xl font-bold">{formatBaseSpeed(baseShutterSpeed)}</p>
        </div>
        <div className="p-4 rounded-lg border bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">Filter Factor</p>
          <p className="text-2xl font-bold">{result.filterFactor}x</p>
        </div>
        <div className="p-4 rounded-lg border bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">Light Reduction</p>
          <p className="text-2xl font-bold">{result.lightReductionPercent.toFixed(1)}%</p>
        </div>
      </div>

      <div className="p-4 rounded-lg border bg-primary/10">
        <p className="font-medium">{result.description}</p>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Quick Reference Table</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Filter</th>
                <th className="text-left py-2">Stops</th>
                <th className="text-left py-2">Factor</th>
                <th className="text-left py-2">Result for {formatBaseSpeed(baseShutterSpeed)}</th>
              </tr>
            </thead>
            <tbody>
              {ND_FILTERS.slice(0, 12).map((filter) => {
                const filterResult = calculateNDFilter({
                  baseShutterSpeed,
                  filterStops: filter.stops,
                });
                return (
                  <tr
                    key={filter.name}
                    className={`border-b border-muted ${filter.stops === filterStops ? "bg-primary/10" : ""}`}
                    onClick={() => setFilterStops(filter.stops)}
                  >
                    <td className="py-2 cursor-pointer">{filter.name}</td>
                    <td className="py-2">{filter.stops}</td>
                    <td className="py-2">{filter.factor}x</td>
                    <td className="py-2 font-medium">{filterResult.newShutterSpeedFormatted}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-lg border bg-muted/30">
          <p className="font-medium mb-2">Common Uses</p>
          <div className="space-y-2">
            {ND_FILTER_INFO.commonUses.map((use, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{use.effect}</span>
                <span className="text-muted-foreground">{use.shutter}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-muted/30">
          <p className="font-medium mb-2">Why Use ND Filters?</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {ND_FILTER_INFO.purpose.map((purpose, i) => (
              <li key={i}>• {purpose}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="font-medium mb-2">Filter Naming Systems</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            <strong>ND Number:</strong> {ND_FILTER_INFO.naming.ndNumber}
          </li>
          <li>
            <strong>Optical Density:</strong> {ND_FILTER_INFO.naming.opticalDensity}
          </li>
          <li>
            <strong>Stops:</strong> {ND_FILTER_INFO.naming.stops}
          </li>
        </ul>
      </div>

      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="font-medium mb-2">Tips</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          {ND_FILTER_INFO.tips.map((tip, i) => (
            <li key={i}>• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
