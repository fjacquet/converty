import { Metadata } from "next";
import { Suspense } from "react";
import { HyperfocalCalculator } from "./hyperfocal-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Hyperfocal Distance Calculator",
  description: "Calculate hyperfocal distance for maximum depth of field in landscape photography.",
  keywords: ["hyperfocal", "depth of field", "landscape", "sharpness", "focus", "photography"],
};

export default function HyperfocalPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Hyperfocal Distance Calculator"
      description="Calculate hyperfocal distance for maximum depth of field."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <HyperfocalCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
