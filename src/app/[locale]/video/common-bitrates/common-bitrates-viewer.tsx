"use client";

import { useState } from "react";
import { COMMON_BITRATES, getCategories } from "@/lib/converters/video/common-bitrates";

export function CommonBitratesViewer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const categories = getCategories();

  const filteredBitrates =
    selectedCategory === "all"
      ? COMMON_BITRATES
      : COMMON_BITRATES.filter((b) => b.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 font-medium">Codec/Format</th>
              <th className="text-left py-3 font-medium">Name</th>
              <th className="text-right py-3 font-medium">Bitrate</th>
              <th className="text-left py-3 font-medium pl-4">Resolution</th>
              <th className="text-left py-3 font-medium pl-4">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredBitrates.map((bitrate, idx) => (
              <tr
                key={`${bitrate.name}-${idx}`}
                className="border-b border-muted hover:bg-muted/50"
              >
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-muted text-xs font-medium">
                    {bitrate.category}
                  </span>
                </td>
                <td className="py-3 font-medium">{bitrate.name}</td>
                <td className="py-3 text-right font-mono">{bitrate.bitrateMbps} Mbps</td>
                <td className="py-3 pl-4 text-muted-foreground">{bitrate.resolution || "-"}</td>
                <td className="py-3 pl-4 text-muted-foreground">{bitrate.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {categories.slice(0, 6).map((cat) => {
          const catBitrates = COMMON_BITRATES.filter((b) => b.category === cat);
          const avgBitrate =
            catBitrates.reduce((a, b) => a + b.bitrateMbps, 0) / catBitrates.length;
          return (
            <div key={cat} className="p-4 rounded-lg border bg-muted/50">
              <p className="font-medium">{cat}</p>
              <p className="text-2xl font-mono">{Math.round(avgBitrate)} Mbps</p>
              <p className="text-xs text-muted-foreground">avg. of {catBitrates.length} presets</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
