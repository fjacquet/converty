import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { NDFilterCalculator } from "./nd-filter-calculator";

export const metadata: Metadata = {
  title: "ND Filter Exposure Calculator",
  description:
    "Calculate exposure time with neutral density filters for long exposure photography.",
  keywords: ["nd filter", "neutral density", "long exposure", "shutter speed", "photography"],
};

export default function NDFilterPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="ND Filter Calculator"
      description="Calculate exposure time when using ND filters."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <NDFilterCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
