"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  analyzeSEO,
  generateRecommendations,
  SEO_BEST_PRACTICES,
  type SEOMetrics,
} from "@/lib/converters/web/seo-performance";

export function SEOAnalyzer() {
  const _t = useTranslations("calculator.labels");
  const _tSections = useTranslations("calculator.sections");
  const [metrics, setMetrics] = useState<SEOMetrics>({
    titleLength: 55,
    descriptionLength: 155,
    h1Count: 1,
    imageCount: 5,
    imagesWithAlt: 4,
    wordCount: 850,
    linkCount: 15,
    externalLinks: 3,
    internalLinks: 12,
  });

  const score = analyzeSEO(metrics);
  const recommendations = generateRecommendations(metrics);

  const handleChange = (field: keyof SEOMetrics, value: string) => {
    setMetrics((prev) => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title Length</label>
          <input
            type="number"
            value={metrics.titleLength}
            onChange={(e) => handleChange("titleLength", e.target.value)}
            min={0}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
          <p className="text-xs text-muted-foreground">Optimal: 50-60 characters</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description Length</label>
          <input
            type="number"
            value={metrics.descriptionLength}
            onChange={(e) => handleChange("descriptionLength", e.target.value)}
            min={0}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
          <p className="text-xs text-muted-foreground">Optimal: 150-160 characters</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">H1 Tags</label>
          <input
            type="number"
            value={metrics.h1Count}
            onChange={(e) => handleChange("h1Count", e.target.value)}
            min={0}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
          <p className="text-xs text-muted-foreground">Optimal: exactly 1</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Total Images</label>
          <input
            type="number"
            value={metrics.imageCount}
            onChange={(e) => handleChange("imageCount", e.target.value)}
            min={0}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Images with Alt</label>
          <input
            type="number"
            value={metrics.imagesWithAlt}
            onChange={(e) => handleChange("imagesWithAlt", e.target.value)}
            min={0}
            max={metrics.imageCount}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Word Count</label>
          <input
            type="number"
            value={metrics.wordCount}
            onChange={(e) => handleChange("wordCount", e.target.value)}
            min={0}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
          <p className="text-xs text-muted-foreground">Optimal: 300+ words</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Total Links</label>
          <input
            type="number"
            value={metrics.linkCount}
            onChange={(e) => handleChange("linkCount", e.target.value)}
            min={0}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Internal Links</label>
          <input
            type="number"
            value={metrics.internalLinks}
            onChange={(e) => handleChange("internalLinks", e.target.value)}
            min={0}
            max={metrics.linkCount}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">External Links</label>
          <input
            type="number"
            value={metrics.externalLinks}
            onChange={(e) => handleChange("externalLinks", e.target.value)}
            min={0}
            max={metrics.linkCount}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
        </div>
      </div>

      <div className="p-6 rounded-lg border bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground mb-2">Overall SEO Score</p>
        <p
          className={`text-5xl font-bold ${
            score.overall >= 80
              ? "text-green-600"
              : score.overall >= 60
                ? "text-yellow-600"
                : "text-red-600"
          }`}
        >
          {score.overall}
        </p>
        <p className="text-sm text-muted-foreground mt-2">out of 100</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(score)
          .filter(([key]) => key !== "overall")
          .map(([key, value]) => (
            <div key={key} className="p-4 rounded-lg border bg-background">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">{key}</span>
                <span
                  className={`text-lg font-bold ${
                    value.score >= 80
                      ? "text-green-600"
                      : value.score >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {value.score}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{value.feedback}</p>
            </div>
          ))}
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Recommendations</p>
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                rec.priority === "high"
                  ? "border-red-500/50 bg-red-500/10"
                  : rec.priority === "medium"
                    ? "border-yellow-500/50 bg-yellow-500/10"
                    : "border-blue-500/50 bg-blue-500/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    rec.priority === "high"
                      ? "bg-red-500/20 text-red-600"
                      : rec.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-600"
                        : "bg-blue-500/20 text-blue-600"
                  }`}
                >
                  {rec.priority}
                </span>
                <span className="font-medium">{rec.category}</span>
              </div>
              <p className="text-sm text-muted-foreground">{rec.issue}</p>
              <p className="text-sm mt-1">{rec.recommendation}</p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm font-medium">SEO Best Practices</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Element</th>
                <th className="text-left py-2">Optimal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-muted">
                <td className="py-2">Title</td>
                <td className="py-2 text-muted-foreground">
                  {SEO_BEST_PRACTICES.title.optimalLength}
                </td>
              </tr>
              <tr className="border-b border-muted">
                <td className="py-2">Description</td>
                <td className="py-2 text-muted-foreground">
                  {SEO_BEST_PRACTICES.description.optimalLength}
                </td>
              </tr>
              <tr className="border-b border-muted">
                <td className="py-2">Content</td>
                <td className="py-2 text-muted-foreground">
                  {SEO_BEST_PRACTICES.content.optimalWords}
                </td>
              </tr>
              <tr className="border-b border-muted">
                <td className="py-2">Images</td>
                <td className="py-2 text-muted-foreground">
                  {SEO_BEST_PRACTICES.images.requirement}
                </td>
              </tr>
              <tr className="border-b border-muted">
                <td className="py-2">Headings</td>
                <td className="py-2 text-muted-foreground">
                  {SEO_BEST_PRACTICES.headings.requirement}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
