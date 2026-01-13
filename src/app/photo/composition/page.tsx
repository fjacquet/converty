import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { CompositionCalculator } from "./composition-calculator";

export const metadata: Metadata = {
  title: "Composition Calculator",
  description:
    "Calculate field of view and image composition from focal length, distance, and crop factor.",
  keywords: ["composition", "focal length", "field of view", "crop factor", "photography"],
};

export default function CompositionPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Composition Calculator"
      description="Calculate field of view and composition from focal length, distance, and crop factor."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <CompositionCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
