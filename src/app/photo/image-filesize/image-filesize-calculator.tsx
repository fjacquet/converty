"use client";

import { useState } from "react";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { calculateImageFilesize, IMAGE_FORMATS, COMMON_RESOLUTIONS, type ImageFormat } from "@/lib/converters/photo/image-filesize";

export function ImageFilesizeCalculator() {
  const [width, setWidth] = useState("4000");
  const [height, setHeight] = useState("3000");
  const [format, setFormat] = useState<ImageFormat>("jpeg");
  const [quality, setQuality] = useState<"low" | "typical" | "high">("typical");

  const result = calculateImageFilesize(parseInt(width) || 0, parseInt(height) || 0, format, quality);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InputField id="width" label="Width" value={width} onChange={setWidth} unit="px" min={1} />
        <InputField id="height" label="Height" value={height} onChange={setHeight} unit="px" min={1} />
        <div className="space-y-2">
          <label className="text-sm font-medium">Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value as ImageFormat)} className="w-full h-10 px-3 rounded-md border bg-background">
            {IMAGE_FORMATS.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
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
      </div>

      <div className="flex flex-wrap gap-2">
        {COMMON_RESOLUTIONS.map((res) => (
          <button key={res.name} onClick={() => { setWidth(res.width.toString()); setHeight(res.height.toString()); }} className="text-xs px-2 py-1 rounded border hover:bg-muted/50">{res.name}</button>
        ))}
      </div>

      {result && (
        <div className="space-y-6">
          <OutputDisplay label="Estimated File Size" value={result.formatted} size="lg" />
          <ResultGrid
            results={[
              { label: "Megapixels", value: result.megapixels, unit: "MP" },
              { label: "Total Pixels", value: result.totalPixels.toLocaleString() },
              { label: "Bits per Pixel", value: result.bitsPerPixel, unit: "bpp" },
              { label: "Size (KB)", value: result.estimatedKB, unit: "KB" },
            ]}
            columns={2}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Format</th><th className="text-left py-2">Description</th><th className="text-right py-2">Est. Size</th></tr></thead>
              <tbody>
                {IMAGE_FORMATS.map((f) => {
                  const est = calculateImageFilesize(parseInt(width) || 0, parseInt(height) || 0, f.id, quality);
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
