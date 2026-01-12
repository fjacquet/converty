import { Metadata } from "next";
import { Suspense } from "react";
import { DepthOfFieldCalculator } from "./depth-of-field-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Depth of Field Calculator",
  description: "Calculate depth of field from aperture, focal length, and distance. Find hyperfocal distance.",
  keywords: ["depth of field", "dof", "aperture", "bokeh", "hyperfocal", "photography"],
};

export default function DepthOfFieldPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Depth of Field Calculator"
      description="Calculate depth of field, near/far limits, and hyperfocal distance."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <DepthOfFieldCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
