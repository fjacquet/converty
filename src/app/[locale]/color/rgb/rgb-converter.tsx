"use client";

import { useState } from "react";
import { InputField, ResultGrid } from "@/components/converter";
import { type ColorConversion, convertFromRgb } from "@/lib/converters/color/rgb";

export function RGBConverter() {
  const [r, setR] = useState("128");
  const [g, setG] = useState("128");
  const [b, setB] = useState("128");

  const rVal = parseInt(r) || 0;
  const gVal = parseInt(g) || 0;
  const bVal = parseInt(b) || 0;

  const result: ColorConversion | null =
    rVal >= 0 && rVal <= 255 && gVal >= 0 && gVal <= 255 && bVal >= 0 && bVal <= 255
      ? convertFromRgb(rVal, gVal, bVal)
      : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <InputField
          id="r"
          label="Red (R)"
          value={r}
          onChange={setR}
          min={0}
          max={255}
          step={1}
          placeholder="0-255"
        />
        <InputField
          id="g"
          label="Green (G)"
          value={g}
          onChange={setG}
          min={0}
          max={255}
          step={1}
          placeholder="0-255"
        />
        <InputField
          id="b"
          label="Blue (B)"
          value={b}
          onChange={setB}
          min={0}
          max={255}
          step={1}
          placeholder="0-255"
        />
      </div>

      {result && (
        <div className="space-y-6">
          {/* Color Preview */}
          <div className="flex gap-4 items-center">
            <div
              className="w-24 h-24 rounded-lg border shadow-inner"
              style={{
                backgroundColor: result.hex,
              }}
            />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Preview</p>
              <p className="text-2xl font-mono font-bold">{result.hex}</p>
            </div>
          </div>

          {/* All Formats */}
          <ResultGrid
            results={[
              { label: "HEX", value: result.hex },
              {
                label: "RGB",
                value: `rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})`,
              },
              {
                label: "HSL",
                value: `hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)`,
              },
              {
                label: "CMYK",
                value: `cmyk(${result.cmyk.c}%, ${result.cmyk.m}%, ${result.cmyk.y}%, ${result.cmyk.k}%)`,
              },
            ]}
            columns={2}
          />

          {/* Component Values */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg border">
              <h3 className="font-medium mb-2">HSL Components</h3>
              <div className="space-y-1 text-sm">
                <p>
                  Hue: <span className="font-mono">{result.hsl.h}°</span>
                </p>
                <p>
                  Saturation: <span className="font-mono">{result.hsl.s}%</span>
                </p>
                <p>
                  Lightness: <span className="font-mono">{result.hsl.l}%</span>
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <h3 className="font-medium mb-2">CMYK Components</h3>
              <div className="space-y-1 text-sm">
                <p>
                  Cyan: <span className="font-mono">{result.cmyk.c}%</span>
                </p>
                <p>
                  Magenta: <span className="font-mono">{result.cmyk.m}%</span>
                </p>
                <p>
                  Yellow: <span className="font-mono">{result.cmyk.y}%</span>
                </p>
                <p>
                  Key (Black): <span className="font-mono">{result.cmyk.k}%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
